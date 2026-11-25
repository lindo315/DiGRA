<?php
/**
 * One-time installer. Open https://digrasa.co.za/api/install.php after uploading the site.
 * It creates the database tables, loads the current website content and makes the first
 * administrator account. Once that's done it locks itself.
 */
declare(strict_types=1);
require __DIR__ . '/_lib.php';

session_name('digrasa_install');
session_start();
if (empty($_SESSION['t'])) $_SESSION['t'] = bin2hex(random_bytes(16));

function installed(): bool {
    $c = load_config();
    if (!$c) return false;
    try {
        $pdo = new PDO('mysql:host=' . $c['db_host'] . ';dbname=' . $c['db_name'] . ';charset=utf8mb4', $c['db_user'], $c['db_pass']);
        return (int)$pdo->query('SELECT COUNT(*) FROM users')->fetchColumn() > 0;
    } catch (Throwable $e) { return false; }
}
function h($s): string { return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8'); }

$errors = [];
$done = false;
$configWhere = '';
$v = fn($k, $def = '') => h($_POST[$k] ?? $def);

if (installed()) {
    $done = 'already';
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!hash_equals($_SESSION['t'], (string)($_POST['t'] ?? ''))) $errors[] = 'The form expired. Reload the page and try again.';
    $cfg = [
        'db_host' => trim((string)($_POST['db_host'] ?? 'localhost')),
        'db_name' => trim((string)($_POST['db_name'] ?? '')),
        'db_user' => trim((string)($_POST['db_user'] ?? '')),
        'db_pass' => (string)($_POST['db_pass'] ?? ''),
        'site_url' => rtrim(trim((string)($_POST['site_url'] ?? '')), '/'),
        'mail_from' => trim((string)($_POST['mail_from'] ?? '')),
    ];
    $name  = trim((string)($_POST['name'] ?? ''));
    $email = strtolower(trim((string)($_POST['email'] ?? '')));
    $pass  = (string)($_POST['password'] ?? '');
    if ($cfg['db_name'] === '' || $cfg['db_user'] === '') $errors[] = 'Enter the database name and database user from cPanel.';
    if ($name === '') $errors[] = 'Enter your name.';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Enter a valid email for the first administrator.';
    if (strlen($pass) < 10) $errors[] = 'Use a password of at least 10 characters.';
    if (!filter_var($cfg['mail_from'], FILTER_VALIDATE_EMAIL)) $errors[] = 'Enter the address website emails are sent from, for example no-reply@digrasa.co.za.';

    if (!$errors) {
        try {
            $pdo = new PDO('mysql:host=' . $cfg['db_host'] . ';dbname=' . $cfg['db_name'] . ';charset=utf8mb4',
                $cfg['db_user'], $cfg['db_pass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        } catch (Throwable $e) {
            $errors[] = 'Could not connect to the database. Check the name, user and password, and that the user was added to the database with All Privileges in cPanel.';
        }
    }
    if (!$errors) {
        // Write the config file, preferably outside public_html so redeploys never touch it.
        $php = "<?php\n// DiGRA SA website settings. Created by install.php on " . date('Y-m-d H:i') . ". Keep this file private.\nreturn " . var_export($cfg, true) . ";\n";
        foreach (config_paths() as $p) {
            if (@file_put_contents($p, $php, LOCK_EX) !== false) { @chmod($p, 0600); $configWhere = $p; break; }
        }
        if (!$configWhere) $errors[] = 'Could not save the settings file. Make sure the api folder is writable.';
    }
    if (!$errors) {
        try {
            foreach (array_filter(array_map('trim', explode(';', (string)file_get_contents(__DIR__ . '/schema.sql')))) as $sql) {
                if (preg_match('/^(--[^\n]*\n\s*)*$/', $sql)) continue;
                $pdo->exec($sql);
            }
            $seed = json_decode((string)file_get_contents(__DIR__ . '/seed.json'), true);
            if (!$pdo->query('SELECT COUNT(*) FROM items')->fetchColumn()) seed_content($seed);
            db()->prepare('INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?,?,?,?,?)')
                ->execute([$name, $email, password_hash($pass, PASSWORD_DEFAULT), 'admin', now()]);
            $done = 'now';
        } catch (Throwable $e) {
            $errors[] = 'Setting up the tables failed: ' . $e->getMessage();
        }
    }
}
$host = preg_replace('/^www\./', '', (string)($_SERVER['HTTP_HOST'] ?? 'digrasa.co.za'));
?><!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Install · DiGRA SA website</title>
<style>
body{margin:0;background:#1C0A3A;font:16px/1.6 system-ui,sans-serif;color:#1C0A3A}
.wrap{max-width:620px;margin:40px auto;background:#fff;padding:32px;border-top:6px solid #F5A623}
h1{margin:0 0 8px;font-size:28px} h2{font-size:18px;margin:28px 0 8px}
label{display:block;font-weight:600;margin:14px 0 4px} input{width:100%;box-sizing:border-box;padding:10px;border:2px solid #DDD5F5;font:inherit}
input:focus{outline:3px solid #F5A623;border-color:#F5A623} .hint{color:#5A4D7A;font-size:14px;margin:4px 0 0}
button,.btn{display:inline-block;margin-top:24px;background:#F5A623;color:#1C0A3A;font-weight:700;border:0;padding:14px 24px;font:inherit;font-weight:700;cursor:pointer;text-decoration:none}
.err{background:#FDECEF;border-left:4px solid #BC1632;padding:12px 16px;margin:16px 0} .ok{background:#E9F8EE;border-left:4px solid #0E7633;padding:12px 16px}
code{background:#F5F0FF;padding:2px 6px}
</style></head><body><div class="wrap">
<?php if ($done === 'already'): ?>
  <h1>Already installed</h1>
  <p>The website is set up. Sign in at <a href="/admin">/admin</a>.</p>
  <p class="hint">If you've lost every administrator password, use "Forgot password" on the sign-in page.</p>
<?php elseif ($done === 'now'): ?>
  <h1>All set</h1>
  <p class="ok">The database is ready, the current website content has been loaded, and your administrator account exists.</p>
  <p>Settings were saved to <code><?= h($configWhere) ?></code>.</p>
  <a class="btn" href="/admin">Open the admin dashboard</a>
<?php else: ?>
  <h1>Set up the DiGRA SA website</h1>
  <p>This runs once. You'll need the MySQL database you created in cPanel (MySQL Database Wizard).</p>
  <?php foreach ($errors as $e): ?><p class="err"><?= h($e) ?></p><?php endforeach; ?>
  <form method="post" autocomplete="off">
    <input type="hidden" name="t" value="<?= h($_SESSION['t']) ?>">
    <h2>Database</h2>
    <label for="db_name">Database name</label><input id="db_name" name="db_name" required value="<?= $v('db_name') ?>">
    <p class="hint">In cPanel it looks like <code>cpanelname_digrasa</code>.</p>
    <label for="db_user">Database user</label><input id="db_user" name="db_user" required value="<?= $v('db_user') ?>">
    <label for="db_pass">Database password</label><input id="db_pass" name="db_pass" type="password">
    <label for="db_host">Database server</label><input id="db_host" name="db_host" value="<?= $v('db_host', 'localhost') ?>">
    <p class="hint">Leave this as <code>localhost</code> on Axxess.</p>
    <h2>Website</h2>
    <label for="site_url">Website address</label><input id="site_url" name="site_url" value="<?= $v('site_url', 'https://' . $host) ?>">
    <label for="mail_from">Send website emails from</label><input id="mail_from" name="mail_from" value="<?= $v('mail_from', 'no-reply@' . $host) ?>">
    <p class="hint">This mailbox or forwarder must exist in cPanel → Email Accounts.</p>
    <h2>First administrator</h2>
    <label for="name">Your name</label><input id="name" name="name" required value="<?= $v('name') ?>">
    <label for="email">Your email</label><input id="email" name="email" type="email" required value="<?= $v('email') ?>">
    <label for="password">Password</label><input id="password" name="password" type="password" minlength="10" required>
    <p class="hint">At least 10 characters. You can add more people later under Admin → People.</p>
    <button type="submit">Install</button>
  </form>
<?php endif; ?>
</div></body></html>
