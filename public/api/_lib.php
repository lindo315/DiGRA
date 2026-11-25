<?php
/**
 * DiGRA SA website: shared helpers for the API.
 * Not called directly (blocked by .htaccess).
 */
declare(strict_types=1);

date_default_timezone_set('Africa/Johannesburg');

const COLLECTIONS  = ['team', 'events', 'news', 'research_areas', 'journals', 'teaching'];
const SETTING_KEYS = ['site', 'nav', 'footer', 'home', 'about', 'events_page', 'research_page',
                      'news_page', 'membership_page', 'contact_page', 'not_found'];
const MAX_JSON     = 400000;   // bytes per saved record
const REVISIONS_KEPT = 25;

/** Where the database password lives. Outside public_html first, so redeploys never touch it. */
function config_paths(): array {
    return [
        dirname(__DIR__, 2) . '/digrasa-config.php',   // one level above public_html
        __DIR__ . '/config.php',
    ];
}

function load_config(): ?array {
    foreach (config_paths() as $p) {
        if (is_file($p)) {
            $c = require $p;
            if (is_array($c)) return $c;
        }
    }
    return null;
}

function json_out(int $status, $payload): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(int $status, string $message, array $extra = []): void {
    json_out($status, array_merge(['ok' => false, 'error' => $message], $extra));
}

function db(): PDO {
    static $pdo = null;
    if ($pdo) return $pdo;
    $c = load_config();
    if (!$c) fail(503, 'The site has not been installed yet. Open /api/install.php.');
    $dsn = 'mysql:host=' . $c['db_host'] . ';dbname=' . $c['db_name'] . ';charset=utf8mb4';
    try {
        $pdo = new PDO($dsn, $c['db_user'], $c['db_pass'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } catch (Throwable $e) {
        fail(503, 'Could not connect to the database.');
    }
    return $pdo;
}

function now(): string { return date('Y-m-d H:i:s'); }

function body_json(): array {
    $raw = file_get_contents('php://input') ?: '';
    if (strlen($raw) > MAX_JSON * 3) fail(413, 'That is too large to save.');
    $d = json_decode($raw, true);
    return is_array($d) ? $d : [];
}

function client_ip(): string { return substr((string)($_SERVER['REMOTE_ADDR'] ?? 'unknown'), 0, 64); }

function is_https(): bool {
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
}

function site_url(): string {
    $c = load_config();
    if (!empty($c['site_url'])) return rtrim($c['site_url'], '/');
    return (is_https() ? 'https://' : 'http://') . ($_SERVER['HTTP_HOST'] ?? 'digrasa.co.za');
}

// ── Sessions & auth ─────────────────────────────────────────────────────

const SESSION_IDLE = 8 * 3600;

function start_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    session_name('digrasa_admin');
    session_set_cookie_params([
        'lifetime' => 0, 'path' => '/', 'secure' => is_https(),
        'httponly' => true, 'samesite' => 'Strict',
    ]);
    session_start();
    if (!empty($_SESSION['uid']) && (time() - ($_SESSION['seen'] ?? 0)) > SESSION_IDLE) {
        $_SESSION = [];
        session_regenerate_id(true);
    }
    $_SESSION['seen'] = time();
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
}

function current_user(): ?array {
    start_session();
    if (empty($_SESSION['uid'])) return null;
    $st = db()->prepare('SELECT id, name, email, role, last_login FROM users WHERE id = ?');
    $st->execute([$_SESSION['uid']]);
    $u = $st->fetch();
    return $u ?: null;
}

function require_user(): array {
    $u = current_user();
    if (!$u) fail(401, 'Please sign in again.');
    return $u;
}

function require_admin(): array {
    $u = require_user();
    if ($u['role'] !== 'admin') fail(403, 'Only administrators can do that.');
    return $u;
}

function require_csrf(): void {
    start_session();
    $sent = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!is_string($sent) || !hash_equals($_SESSION['csrf'] ?? '', $sent)) {
        fail(419, 'Your session expired. Reload the page and try again.');
    }
}

function require_post(): void {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') fail(405, 'Method not allowed');
}

// ── Content helpers ─────────────────────────────────────────────────────

function enc($v): string {
    $s = json_encode($v, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($s === false) fail(400, 'That content could not be saved.');
    if (strlen($s) > MAX_JSON) fail(413, 'That is too large to save. Try splitting it up.');
    return $s;
}

function dec(string $s) { return json_decode($s, true); }

function save_revision(string $type, string $key, string $data, ?string $by): void {
    $pdo = db();
    $pdo->prepare('INSERT INTO revisions (ref_type, ref_key, data, saved_by, created_at) VALUES (?,?,?,?,?)')
        ->execute([$type, $key, $data, $by, now()]);
    // keep the newest N
    $st = $pdo->prepare('SELECT id FROM revisions WHERE ref_type=? AND ref_key=? ORDER BY id DESC LIMIT 1 OFFSET ' . REVISIONS_KEPT);
    $st->execute([$type, $key]);
    $cut = $st->fetchColumn();
    if ($cut) $pdo->prepare('DELETE FROM revisions WHERE ref_type=? AND ref_key=? AND id <= ?')->execute([$type, $key, $cut]);
}

function all_settings(): array {
    $out = [];
    foreach (db()->query('SELECT skey, data FROM settings') as $r) $out[$r['skey']] = dec($r['data']);
    return $out;
}

function all_items(bool $onlyPublished): array {
    $out = array_fill_keys(COLLECTIONS, []);
    $sql = 'SELECT id, collection, sort_order, published, data, updated_at, updated_by FROM items'
         . ($onlyPublished ? ' WHERE published = 1' : '') . ' ORDER BY collection, sort_order, id';
    foreach (db()->query($sql) as $r) {
        if (!isset($out[$r['collection']])) continue;
        $d = dec($r['data']) ?: [];
        $d['id'] = (int)$r['id'];
        if (!$onlyPublished) {
            $d['_published'] = (bool)$r['published'];
            $d['_updated_at'] = $r['updated_at'];
            $d['_updated_by'] = $r['updated_by'];
        }
        $out[$r['collection']][] = $d;
    }
    return $out;
}

/** Inserts the seed content (used by the installer and "reset to original"). */
function seed_content(array $seed): void {
    $pdo = db();
    $t = now();
    $st = $pdo->prepare('REPLACE INTO settings (skey, data, updated_at, updated_by) VALUES (?,?,?,?)');
    foreach ($seed['settings'] as $k => $v) {
        if (in_array($k, SETTING_KEYS, true)) $st->execute([$k, enc($v), $t, 'installer']);
    }
    $ins = $pdo->prepare('INSERT INTO items (collection, sort_order, published, data, created_at, updated_at, updated_by) VALUES (?,?,?,?,?,?,?)');
    foreach ($seed['collections'] as $col => $list) {
        if (!in_array($col, COLLECTIONS, true)) continue;
        foreach (array_values($list) as $i => $item) {
            $pub = array_key_exists('_published', $item) ? (int)(bool)$item['_published'] : 1;
            unset($item['id'], $item['_published'], $item['_updated_at'], $item['_updated_by']);
            $ins->execute([$col, ($i + 1) * 10, $pub, enc($item), $t, $t, 'installer']);
        }
    }
}

/** Plain-text email. Returns true if PHP accepted it for delivery. */
function send_mail(string $to, string $subject, string $body, ?string $replyName = null, ?string $replyEmail = null): bool {
    $c = load_config() ?: [];
    $from = $c['mail_from'] ?? ('no-reply@' . preg_replace('/^www\./', '', (string)($_SERVER['HTTP_HOST'] ?? 'digrasa.co.za')));
    $headers = [
        'From: DiGRA SA Website <' . $from . '>',
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'X-Mailer: DiGRA-SA-Website',
    ];
    if ($replyEmail) $headers[] = 'Reply-To: ' . str_replace(["\r", "\n", '<', '>'], '', (string)$replyName) . ' <' . $replyEmail . '>';
    $subj = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    if (!empty($c['mail_disabled'])) return true;   // local testing
    return @mail($to, $subj, $body, implode("\r\n", $headers), '-f' . $from);
}
