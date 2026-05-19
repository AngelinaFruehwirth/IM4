<?php
// register.php
session_start();
header('Content-Type: application/json');

require_once '../system/config.php'; //verbindet mit Datenbank

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email    = trim($_POST['email'] ?? '');
    $name    = trim($_POST['name'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (!$email || !$password || !$name) {
        echo json_encode(["status" => "error", "message" => "Email and password are required"]);
        exit;
    }

    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->execute([':email' => $email]);
    if ($stmt->fetch()) {
        echo json_encode(["status" => "error", "message" => "Email is already in use"]);
        exit;
    }

    // Hash the password verschlüsseltes Passwort
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert the new user
    $insert = $pdo->prepare("INSERT INTO users (email, name, password) VALUES (:email, :name, :password)");
    $insert->execute([
        ':email' => $email,
        ':name' => $name,
        ':password'  => $hashedPassword
    ]);

    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}
