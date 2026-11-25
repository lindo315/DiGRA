<?php
/**
 * Sign in / out and password reset.
 *   GET  ?action=me
 *   POST ?action=login   {email, password}
 *   POST ?action=logout
 *   POST ?action=forgot  {email}
 *   POST ?action=reset   {token, password}
 */
declare(strict_types=1);
require __DIR__ . '/_lib.php';

const MAX_FAILS = 6;
const FAIL_WINDOW_MIN = 15;

$action = $_GET['action'] ?? '';
start_session();

function user_public(array $u): array {
    return ['id' => (int)$u['id'], 'name' => $u['name'], 'email' => $u['email'], 'role' => $u['role']];
}

switch ($action) {
case 'me':
    $u = current_user();
    json_out(200, ['ok' => true, 'user' => $u ? user_public($u) : null, 'csrf' => $_SESSION['csrf']]);

case 'login':
    require_post();
    $d = body_json();
    $email = strtolower(trim((string)($d['email'] ?? '')));
    $pass  = (string)($d['password'] ?? '');
    $pdo = db();
    $since = date('Y-m-d H:i:s', time() - FAIL_WINDOW_MIN * 60);
    $st = $pdo->prepare('SELECT COUNT(*) FROM login_attempts WHERE (ip = ? OR email = ?) AND created_at > ?');
    $st->execute([client_ip(), $email, $since]);
    if ((int)$st->fetchColumn() >= MAX_FAILS) {
        fail(429, 'Too many attempts. Wait 15 minutes, or reset your password.');
    }
    $st = $pdo->prepare('SELECT * FROM users WHERE email = ?');
    $st->execute([$email]);
    $u = $st->fetch();
    if (!$u || !password_verify($pass, $u['password_hash'])) {
        $pdo->prepare('INSERT INTO login_attempts (ip, email, created_at) VALUES (?,?,?)')->execute([client_ip(), $email, now()]);
        usleep(400000);
        fail(401, 'That email and password do not match.');
    }
    if (password_needs_rehash($u['password_hash'], PASSWORD_DEFAULT)) {
        $pdo->prepare('UPDATE users SET password_hash=? WHERE id=?')->execute([password_hash($pass, PASSWORD_DEFAULT), $u['id']]);
    }
    $pdo->prepare('DELETE FROM login_attempts WHERE email = ?')->execute([$email]);
    $pdo->prepare('UPDATE users SET last_login = ? WHERE id = ?')->execute([now(), $u['id']]);
    session_regenerate_id(true);
    $_SESSION['uid'] = (int)$u['id'];
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
    json_out(200, ['ok' => true, 'user' => user_public($u), 'csrf' => $_SESSION['csrf']]);

case 'logout':
    require_post();
    $_SESSION = [];
    session_regenerate_id(true);
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
    json_out(200, ['ok' => true, 'csrf' => $_SESSION['csrf']]);

case 'forgot':
    require_post();
    $d = body_json();
    $email = strtolower(trim((string)($d['email'] ?? '')));
    $pdo = db();
    $st = $pdo->prepare('SELECT COUNT(*) FROM login_attempts WHERE ip = ? AND created_at > ?');
    $st->execute([client_ip(), date('Y-m-d H:i:s', time() - 900)]);
    if ((int)$st->fetchColumn() >= MAX_FAILS * 2) fail(429, 'Too many requests. Try again in 15 minutes.');
    $pdo->prepare('INSERT INTO login_attempts (ip, email, created_at) VALUES (?,?,?)')->execute([client_ip(), 'forgot:' . $email, now()]);
    $st = $pdo->prepare('SELECT id, name, email FROM users WHERE email = ?');
    $st->execute([$email]);
    $u = $st->fetch();
    if ($u) {
        $token = bin2hex(random_bytes(32));
        $pdo->prepare('INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?,?,?)')
            ->execute([$u['id'], hash('sha256', $token), date('Y-m-d H:i:s', time() + 3600)]);
        $link = site_url() . '/admin?reset=' . $token;
        send_mail($u['email'], 'Reset your DiGRA SA website password',
            "Hi {$u['name']},\n\nSomeone (hopefully you) asked to reset the password for the DiGRA SA website admin.\n\nChoose a new password here (the link works for one hour):\n$link\n\nIf you didn't ask for this, ignore this email. Your password won't change.\n");
    }
    // Same answer whether or not the email exists.
    json_out(200, ['ok' => true]);

case 'reset':
    require_post();
    $d = body_json();
    $token = (string)($d['token'] ?? '');
    $pass  = (string)($d['password'] ?? '');
    if (strlen($pass) < 10) fail(422, 'Use at least 10 characters for the new password.');
    $pdo = db();
    $st = $pdo->prepare('SELECT * FROM password_resets WHERE token_hash = ? AND used = 0 AND expires_at > ?');
    $st->execute([hash('sha256', $token), now()]);
    $r = $st->fetch();
    if (!$r) fail(400, 'This reset link has expired or was already used. Ask for a new one.');
    $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?')->execute([password_hash($pass, PASSWORD_DEFAULT), $r['user_id']]);
    $pdo->prepare('UPDATE password_resets SET used = 1 WHERE user_id = ?')->execute([$r['user_id']]);
    json_out(200, ['ok' => true]);

default:
    fail(400, 'Unknown action');
}
