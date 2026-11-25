<?php
/**
 * Admin API. Every request needs a signed-in user; every POST also needs the
 * X-CSRF-Token header. Usage: /api/admin.php?action=<name>
 */
declare(strict_types=1);
require __DIR__ . '/_lib.php';

$user   = require_user();
$action = $_GET['action'] ?? '';
$isPost = ($_SERVER['REQUEST_METHOD'] ?? '') === 'POST';
if ($isPost) require_csrf();
$d   = $isPost ? body_json() : [];
$pdo = db();
$by  = $user['name'];

function need_collection(string $c): string {
    if (!in_array($c, COLLECTIONS, true)) fail(400, 'Unknown section');
    return $c;
}
function item_row(int $id): array {
    $st = db()->prepare('SELECT * FROM items WHERE id = ?');
    $st->execute([$id]);
    $r = $st->fetch();
    if (!$r) fail(404, 'That item no longer exists. Reload the page.');
    return $r;
}
function clean_item(array $data): array {
    foreach (array_keys($data) as $k) if (is_string($k) && ($k === 'id' || $k[0] === '_')) unset($data[$k]);
    return $data;
}
function upload_root(): string { return dirname(__DIR__) . '/uploads'; }

switch ($action) {

// ── Loading ───────────────────────────────────────────────────────────
case 'bootstrap':
    $unread = (int)$pdo->query('SELECT COUNT(*) FROM submissions WHERE is_read = 0')->fetchColumn();
    json_out(200, [
        'ok' => true,
        'user' => ['id' => (int)$user['id'], 'name' => $user['name'], 'email' => $user['email'], 'role' => $user['role']],
        'settings' => all_settings(),
        'collections' => all_items(false),
        'unread' => $unread,
    ]);

// ── Page text & site settings ─────────────────────────────────────────
case 'save_settings':
    $key = (string)($d['key'] ?? '');
    if (!in_array($key, SETTING_KEYS, true)) fail(400, 'Unknown settings page');
    if (!is_array($d['data'] ?? null)) fail(400, 'Nothing to save');
    $st = $pdo->prepare('SELECT data FROM settings WHERE skey = ?');
    $st->execute([$key]);
    $old = $st->fetchColumn();
    if ($old !== false) save_revision('settings', $key, $old, $by);
    $pdo->prepare('REPLACE INTO settings (skey, data, updated_at, updated_by) VALUES (?,?,?,?)')
        ->execute([$key, enc($d['data']), now(), $by]);
    json_out(200, ['ok' => true]);

// ── Collections (team, events, news …) ────────────────────────────────
case 'save_item':
    $col  = need_collection((string)($d['collection'] ?? ''));
    $data = clean_item(is_array($d['data'] ?? null) ? $d['data'] : []);
    $pub  = !empty($d['published']) ? 1 : 0;
    $id   = (int)($d['id'] ?? 0);
    if ($id) {
        $old = item_row($id);
        if ($old['collection'] !== $col) fail(400, 'That item belongs to a different section.');
        save_revision('item', 'item:' . $id, $old['data'], $by);
        $pdo->prepare('UPDATE items SET data=?, published=?, updated_at=?, updated_by=? WHERE id=?')
            ->execute([enc($data), $pub, now(), $by, $id]);
    } else {
        $pos = ($d['position'] ?? 'end') === 'start'
            ? 'SELECT COALESCE(MIN(sort_order),0) - 10 FROM items WHERE collection = ?'
            : 'SELECT COALESCE(MAX(sort_order),0) + 10 FROM items WHERE collection = ?';
        $st = $pdo->prepare($pos);
        $st->execute([$col]);
        $order = (int)$st->fetchColumn();
        $pdo->prepare('INSERT INTO items (collection, sort_order, published, data, created_at, updated_at, updated_by) VALUES (?,?,?,?,?,?,?)')
            ->execute([$col, $order, $pub, enc($data), now(), now(), $by]);
        $id = (int)$pdo->lastInsertId();
    }
    json_out(200, ['ok' => true, 'id' => $id]);

case 'set_published':
    $id = (int)($d['id'] ?? 0);
    item_row($id);
    $pdo->prepare('UPDATE items SET published=?, updated_at=?, updated_by=? WHERE id=?')
        ->execute([!empty($d['published']) ? 1 : 0, now(), $by, $id]);
    json_out(200, ['ok' => true]);

case 'delete_item':
    $id = (int)($d['id'] ?? 0);
    $r = item_row($id);
    $snapshot = json_encode(['collection' => $r['collection'], 'published' => (int)$r['published'], 'data' => dec($r['data'])], JSON_UNESCAPED_UNICODE);
    save_revision('deleted', $r['collection'], $snapshot, $by);
    $pdo->prepare('DELETE FROM items WHERE id = ?')->execute([$id]);
    json_out(200, ['ok' => true]);

case 'deleted':
    $col = need_collection((string)($_GET['collection'] ?? ''));
    $st = $pdo->prepare("SELECT id, data, saved_by, created_at FROM revisions WHERE ref_type='deleted' AND ref_key=? ORDER BY id DESC");
    $st->execute([$col]);
    $out = [];
    foreach ($st as $r) { $x = dec($r['data']); $out[] = ['id' => (int)$r['id'], 'data' => $x['data'] ?? [], 'saved_by' => $r['saved_by'], 'created_at' => $r['created_at']]; }
    json_out(200, ['ok' => true, 'items' => $out]);

case 'restore_deleted':
    $rid = (int)($d['revision_id'] ?? 0);
    $st = $pdo->prepare("SELECT * FROM revisions WHERE id=? AND ref_type='deleted'");
    $st->execute([$rid]);
    $r = $st->fetch();
    if (!$r) fail(404, 'That deleted item is no longer available.');
    $x = dec($r['data']);
    $st = $pdo->prepare('SELECT COALESCE(MAX(sort_order),0) + 10 FROM items WHERE collection = ?');
    $st->execute([$x['collection']]);
    $pdo->prepare('INSERT INTO items (collection, sort_order, published, data, created_at, updated_at, updated_by) VALUES (?,?,?,?,?,?,?)')
        ->execute([$x['collection'], (int)$st->fetchColumn(), (int)$x['published'], enc($x['data']), now(), now(), $by]);
    $newId = (int)$pdo->lastInsertId();
    $pdo->prepare('DELETE FROM revisions WHERE id=?')->execute([$rid]);
    json_out(200, ['ok' => true, 'id' => $newId]);

case 'reorder':
    $col = need_collection((string)($d['collection'] ?? ''));
    $ids = array_map('intval', is_array($d['ids'] ?? null) ? $d['ids'] : []);
    $st = $pdo->prepare('UPDATE items SET sort_order=? WHERE id=? AND collection=?');
    foreach ($ids as $i => $id) $st->execute([($i + 1) * 10, $id, $col]);
    json_out(200, ['ok' => true]);

// ── History ───────────────────────────────────────────────────────────
case 'revisions':
    $type = ($_GET['type'] ?? '') === 'settings' ? 'settings' : 'item';
    $key  = (string)($_GET['key'] ?? '');
    $st = $pdo->prepare('SELECT id, saved_by, created_at, data FROM revisions WHERE ref_type=? AND ref_key=? ORDER BY id DESC');
    $st->execute([$type, $type === 'item' ? 'item:' . (int)$key : $key]);
    $out = [];
    foreach ($st as $r) $out[] = ['id' => (int)$r['id'], 'saved_by' => $r['saved_by'], 'created_at' => $r['created_at'], 'data' => dec($r['data'])];
    json_out(200, ['ok' => true, 'revisions' => $out]);

// ── Messages from the website forms ───────────────────────────────────
case 'submissions':
    $rows = $pdo->query('SELECT * FROM submissions ORDER BY id DESC LIMIT 500')->fetchAll();
    foreach ($rows as &$r) { $r['data'] = dec($r['data']); $r['id'] = (int)$r['id']; $r['is_read'] = (bool)$r['is_read']; $r['emailed'] = (bool)$r['emailed']; }
    json_out(200, ['ok' => true, 'submissions' => $rows]);

case 'submission_read':
    $pdo->prepare('UPDATE submissions SET is_read=? WHERE id=?')->execute([!empty($d['read']) ? 1 : 0, (int)($d['id'] ?? 0)]);
    json_out(200, ['ok' => true]);

case 'submission_delete':
    $pdo->prepare('DELETE FROM submissions WHERE id=?')->execute([(int)($d['id'] ?? 0)]);
    json_out(200, ['ok' => true]);

// ── Your account ──────────────────────────────────────────────────────
case 'change_password':
    $st = $pdo->prepare('SELECT password_hash FROM users WHERE id=?');
    $st->execute([$user['id']]);
    if (!password_verify((string)($d['current'] ?? ''), (string)$st->fetchColumn())) fail(422, 'Your current password is not right.');
    $new = (string)($d['new'] ?? '');
    if (strlen($new) < 10) fail(422, 'Use at least 10 characters.');
    $pdo->prepare('UPDATE users SET password_hash=? WHERE id=?')->execute([password_hash($new, PASSWORD_DEFAULT), $user['id']]);
    json_out(200, ['ok' => true]);

case 'update_profile':
    $name  = trim((string)($d['name'] ?? ''));
    $email = strtolower(trim((string)($d['email'] ?? '')));
    if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) fail(422, 'Enter your name and a valid email.');
    try {
        $pdo->prepare('UPDATE users SET name=?, email=? WHERE id=?')->execute([$name, $email, $user['id']]);
    } catch (PDOException $e) { fail(422, 'Another account already uses that email.'); }
    json_out(200, ['ok' => true]);

// ── People who can sign in (administrators only) ──────────────────────
case 'users':
    require_admin();
    $rows = $pdo->query('SELECT id, name, email, role, created_at, last_login FROM users ORDER BY name')->fetchAll();
    json_out(200, ['ok' => true, 'users' => $rows]);

case 'user_save':
    require_admin();
    $id    = (int)($d['id'] ?? 0);
    $name  = trim((string)($d['name'] ?? ''));
    $email = strtolower(trim((string)($d['email'] ?? '')));
    $role  = ($d['role'] ?? '') === 'admin' ? 'admin' : 'editor';
    $pass  = (string)($d['password'] ?? '');
    if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) fail(422, 'Enter a name and a valid email.');
    if (!$id && strlen($pass) < 10) fail(422, 'Give the new account a password of at least 10 characters.');
    if ($pass !== '' && strlen($pass) < 10) fail(422, 'Passwords need at least 10 characters.');
    if ($id === (int)$user['id'] && $role !== 'admin') fail(422, "You can't remove your own administrator access.");
    try {
        if ($id) {
            $pdo->prepare('UPDATE users SET name=?, email=?, role=? WHERE id=?')->execute([$name, $email, $role, $id]);
            if ($pass !== '') $pdo->prepare('UPDATE users SET password_hash=? WHERE id=?')->execute([password_hash($pass, PASSWORD_DEFAULT), $id]);
        } else {
            $pdo->prepare('INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?,?,?,?,?)')
                ->execute([$name, $email, password_hash($pass, PASSWORD_DEFAULT), $role, now()]);
        }
    } catch (PDOException $e) { fail(422, 'Another account already uses that email.'); }
    json_out(200, ['ok' => true]);

case 'user_delete':
    require_admin();
    $id = (int)($d['id'] ?? 0);
    if ($id === (int)$user['id']) fail(422, "You can't delete your own account.");
    $admins = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE role='admin'")->fetchColumn();
    $st = $pdo->prepare('SELECT role FROM users WHERE id=?'); $st->execute([$id]);
    if ($st->fetchColumn() === 'admin' && $admins <= 1) fail(422, 'Keep at least one administrator.');
    $pdo->prepare('DELETE FROM users WHERE id=?')->execute([$id]);
    json_out(200, ['ok' => true]);

// ── Backups ───────────────────────────────────────────────────────────
case 'export':
    $payload = ['version' => 1, 'exported_at' => date('c'), 'settings' => all_settings(), 'collections' => all_items(false)];
    header('Content-Type: application/json; charset=utf-8');
    header('Content-Disposition: attachment; filename="digrasa-backup-' . date('Y-m-d') . '.json"');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;

case 'import':
    require_admin();
    $b = $d['backup'] ?? null;
    if (!is_array($b) || !is_array($b['settings'] ?? null) || !is_array($b['collections'] ?? null)) fail(422, "That file isn't a DiGRA SA backup.");
    // Keep a copy of what's there now, so an import can be undone.
    $current = json_encode(['settings' => all_settings(), 'collections' => all_items(false)], JSON_UNESCAPED_UNICODE);
    save_revision('backup', 'before-import', $current, $by);
    $pdo->beginTransaction();
    try {
        $pdo->exec('DELETE FROM items');
        seed_content($b);
        $pdo->commit();
    } catch (Throwable $e) { $pdo->rollBack(); fail(500, 'The backup could not be restored. Nothing was changed.'); }
    json_out(200, ['ok' => true]);

// ── Uploaded files ────────────────────────────────────────────────────
case 'media':
    $root = upload_root();
    $files = [];
    if (is_dir($root)) {
        $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS));
        foreach ($it as $f) {
            if (!$f->isFile() || $f->getFilename()[0] === '.') continue;
            $rel = '/uploads/' . str_replace('\\', '/', substr($f->getPathname(), strlen($root) + 1));
            $files[] = ['url' => $rel, 'size' => $f->getSize(), 'modified' => date('Y-m-d H:i', $f->getMTime())];
        }
    }
    usort($files, fn($a, $b) => strcmp($b['modified'], $a['modified']));
    json_out(200, ['ok' => true, 'files' => $files]);

case 'media_delete':
    $url = (string)($d['url'] ?? '');
    if (!preg_match('#^/uploads/[A-Za-z0-9/_\-.]+$#', $url) || str_contains($url, '..')) fail(400, 'Unknown file');
    $path = dirname(__DIR__) . $url;
    if (is_file($path)) unlink($path);
    json_out(200, ['ok' => true]);

default:
    fail(400, 'Unknown action');
}
