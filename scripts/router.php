<?php
// Local stand-in for the Apache .htaccess rules. Run from inside dist/:
//   cd dist && php -S localhost:8090 ../scripts/router.php
$root = getcwd();
$p = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (preg_match('#^/api/(_lib\.php|config\.php|schema\.sql)#', $p)) { http_response_code(403); exit; }
if ($p !== '/' && is_file($root . $p)) return false;
readfile($root . '/index.html');
