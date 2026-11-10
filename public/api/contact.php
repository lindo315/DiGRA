<?php
/**
 * DiGRA SA: form handler for the Contact and Membership forms.
 * Runs on Axxess (Apache + PHP). Emails every valid submission to TO_ADDRESS.
 *
 * Expects a JSON POST: { form: "contact"|"membership", name, email, ...fields,
 *                        website (honeypot, must be empty), startedAt (ms) }
 */

const TO_ADDRESS   = 'info@digrasa.co.za';
const FROM_ADDRESS = 'no-reply@digrasa.co.za';   // must be an address on the digrasa.co.za domain
const FROM_NAME    = 'DiGRA SA Website';
const RATE_LIMIT   = 5;      // max submissions…
const RATE_WINDOW  = 600;    // …per IP per 10 minutes

date_default_timezone_set('Africa/Johannesburg');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond($status, $payload) {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'Method not allowed']);
}

$raw = file_get_contents('php://input');
if (strlen($raw) > 20000) respond(413, ['ok' => false, 'error' => 'Submission too large']);
$data = json_decode($raw, true);
if (!is_array($data)) respond(400, ['ok' => false, 'error' => 'Invalid request']);

// ── Spam checks ─────────────────────────────────────────────────────────
// Honeypot: real people never see or fill this field.
if (!empty($data['website'])) respond(200, ['ok' => true]);
// Submitted faster than a human could type.
$startedAt = isset($data['startedAt']) ? (int) $data['startedAt'] : 0;
if ($startedAt > 0 && (microtime(true) * 1000 - $startedAt) < 3000) respond(200, ['ok' => true]);

// Per-IP rate limit (file-based; no database needed).
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = sys_get_temp_dir() . '/digrasa_rate_' . md5($ip);
$now = time();
$hits = [];
if (is_file($rateFile)) {
    $hits = array_filter(
        array_map('intval', explode(',', (string) @file_get_contents($rateFile))),
        fn($t) => $t > $now - RATE_WINDOW
    );
}
if (count($hits) >= RATE_LIMIT) {
    respond(429, ['ok' => false, 'error' => 'Too many submissions. Please try again later or email us directly.']);
}

// ── Validation ──────────────────────────────────────────────────────────
function clean_line($v, $max = 200) {
    $v = trim((string) ($v ?? ''));
    $v = preg_replace('/[\r\n\t]+/', ' ', $v);          // no header injection
    return mb_substr($v, 0, $max);
}
function clean_text($v, $max = 5000) {
    $v = trim((string) ($v ?? ''));
    $v = str_replace("\r\n", "\n", $v);
    return mb_substr($v, 0, $max);
}

$form  = ($data['form'] ?? '') === 'membership' ? 'membership' : 'contact';
$name  = clean_line($data['name'] ?? '', 120);
$email = clean_line($data['email'] ?? '', 200);

$errors = [];
if ($name === '') $errors['name'] = 'Name is required';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Enter a valid email';

if ($form === 'contact') {
    $fields = [
        'Subject' => clean_line($data['subject'] ?? '', 200),
        'Message' => clean_text($data['message'] ?? ''),
    ];
    if ($fields['Message'] === '') $errors['message'] = 'Message is required';
    $subject = 'Website enquiry: ' . ($fields['Subject'] !== '' ? $fields['Subject'] : 'New message') . " ($name)";
} else {
    $fields = [
        'Institution / organisation' => clean_line($data['institution'] ?? ''),
        'Role'                       => clean_line($data['role'] ?? ''),
        'Interests'                  => clean_text($data['interests'] ?? '', 3000),
        'How they heard about us'    => clean_line($data['heard'] ?? ''),
    ];
    $subject = "Membership expression of interest: $name";
}

if ($errors) respond(422, ['ok' => false, 'error' => 'Please check the highlighted fields', 'fields' => $errors]);

// ── Compose & send ──────────────────────────────────────────────────────
$lines = [
    ($form === 'contact' ? 'New message from the DiGRA SA contact form' : 'New membership expression of interest'),
    str_repeat('-', 48),
    "Name:  $name",
    "Email: $email",
];
foreach ($fields as $label => $value) {
    if ($value === '') continue;
    $lines[] = strpos($value, "\n") !== false || strlen($value) > 70 ? "\n$label:\n$value" : "$label: $value";
}
$lines[] = '';
$lines[] = str_repeat('-', 48);
$lines[] = 'Sent ' . date('j F Y, H:i') . ' (SAST) from digrasa.co.za. Reply directly to this email to respond.';
$body = implode("\n", $lines);

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$headers = [
    'From: ' . FROM_NAME . ' <' . FROM_ADDRESS . '>',
    'Reply-To: ' . $name . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: DiGRA-SA-Website',
];

$sent = @mail(TO_ADDRESS, $encodedSubject, $body, implode("\r\n", $headers), '-f' . FROM_ADDRESS);

if (!$sent) {
    respond(500, ['ok' => false, 'error' => 'We couldn\'t send your message right now.']);
}

$hits[] = $now;
@file_put_contents($rateFile, implode(',', $hits), LOCK_EX);

respond(200, ['ok' => true]);
