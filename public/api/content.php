<?php
/** Public, read-only: everything the website shows. GET /api/content.php */
declare(strict_types=1);
require __DIR__ . '/_lib.php';

$payload = ['ok' => true, 'settings' => all_settings(), 'collections' => all_items(true)];
$json = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
$etag = '"' . md5($json) . '"';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-cache');
header('ETag: ' . $etag);
if (($_SERVER['HTTP_IF_NONE_MATCH'] ?? '') === $etag) { http_response_code(304); exit; }
echo $json;
