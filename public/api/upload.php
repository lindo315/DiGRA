<?php
/**
 * Upload a photo or PDF. POST multipart "file" with the X-CSRF-Token header.
 * Photos are resized (max 1600px) and saved as WebP when the server supports it.
 */
declare(strict_types=1);
require __DIR__ . '/_lib.php';

require_post();
require_user();
require_csrf();

const MAX_BYTES = 12 * 1024 * 1024;
const MAX_SIDE  = 1600;

$f = $_FILES['file'] ?? null;
if (!$f || ($f['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    $code = $f['error'] ?? UPLOAD_ERR_NO_FILE;
    fail(400, $code === UPLOAD_ERR_INI_SIZE || $code === UPLOAD_ERR_FORM_SIZE
        ? 'That file is too big. Keep photos under 12 MB.' : 'No file arrived. Try again.');
}
if ($f['size'] > MAX_BYTES) fail(413, 'That file is too big. Keep photos under 12 MB.');

$tmp  = $f['tmp_name'];
$base = strtolower(preg_replace('/[^A-Za-z0-9]+/', '-', pathinfo((string)$f['name'], PATHINFO_FILENAME)));
$base = trim(substr($base, 0, 50), '-') ?: 'file';
$dirRel = '/uploads/' . date('Y/m');
$dirAbs = dirname(__DIR__) . $dirRel;
if (!is_dir($dirAbs) && !mkdir($dirAbs, 0755, true)) fail(500, 'The uploads folder is not writable on the server.');
$stamp = substr(bin2hex(random_bytes(4)), 0, 6);

// PDF?
$head = (string)file_get_contents($tmp, false, null, 0, 5);
if ($head === '%PDF-') {
    $name = "$base-$stamp.pdf";
    if (!move_uploaded_file($tmp, "$dirAbs/$name")) fail(500, 'Could not save the file.');
    json_out(200, ['ok' => true, 'url' => "$dirRel/$name"]);
}

$info = @getimagesize($tmp);
$types = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp', IMAGETYPE_GIF => 'gif'];
if (!$info || !isset($types[$info[2]])) fail(415, 'Upload a JPG, PNG, WebP or GIF photo, or a PDF.');

[$w, $h, $type] = $info;
$canResize = function_exists('imagecreatetruecolor') && function_exists('imagewebp');
if ($canResize && $type !== IMAGETYPE_GIF) {
    $src = match ($type) {
        IMAGETYPE_JPEG => @imagecreatefromjpeg($tmp),
        IMAGETYPE_PNG  => @imagecreatefrompng($tmp),
        IMAGETYPE_WEBP => @imagecreatefromwebp($tmp),
    };
    if ($src) {
        // Respect phone camera rotation
        if ($type === IMAGETYPE_JPEG && function_exists('exif_read_data')) {
            $exif = @exif_read_data($tmp);
            $o = $exif['Orientation'] ?? 1;
            if ($o == 3) $src = imagerotate($src, 180, 0);
            if ($o == 6) { $src = imagerotate($src, -90, 0); }
            if ($o == 8) { $src = imagerotate($src, 90, 0); }
            $w = imagesx($src); $h = imagesy($src);
        }
        $scale = min(1, MAX_SIDE / max($w, $h));
        $nw = max(1, (int)round($w * $scale)); $nh = max(1, (int)round($h * $scale));
        $dst = imagecreatetruecolor($nw, $nh);
        imagealphablending($dst, false); imagesavealpha($dst, true);
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $nw, $nh, $w, $h);
        $name = "$base-$stamp.webp";
        if (imagewebp($dst, "$dirAbs/$name", 82)) {
            json_out(200, ['ok' => true, 'url' => "$dirRel/$name", 'width' => $nw, 'height' => $nh]);
        }
    }
}
// Fallback: keep the original file as-is.
$name = "$base-$stamp." . $types[$type];
if (!move_uploaded_file($tmp, "$dirAbs/$name")) fail(500, 'Could not save the file.');
json_out(200, ['ok' => true, 'url' => "$dirRel/$name", 'width' => $w, 'height' => $h]);
