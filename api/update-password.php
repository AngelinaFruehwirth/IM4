<?php
session_start();
header('Content-Type: application/json');

require_once '../system/config.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

$currentPassword = trim($_POST['currentPassword'] ?? '');
$newPassword = trim($_POST['newPassword'] ?? '');

if (!$currentPassword || !$newPassword) {
    echo json_encode(["status" => "error", "message" => "Bitte beide Passwörter eingeben."]);
    exit;
}

if (strlen($newPassword) < 4) {
    echo json_encode(["status" => "error", "message" => "Das neue Passwort ist zu kurz."]);
    exit;
}

$stmt = $pdo->prepare("SELECT password FROM users WHERE id = :id");
$stmt->execute([
    ':id' => $_SESSION['user_id']
]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($currentPassword, $user['password'])) {
    echo json_encode(["status" => "error", "message" => "Aktuelles Passwort ist falsch."]);
    exit;
}

$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

$update = $pdo->prepare("UPDATE users SET password = :password WHERE id = :id");
$update->execute([
    ':password' => $hashedPassword,
    ':id' => $_SESSION['user_id']
]);

echo json_encode(["status" => "success"]);