/* BESCHREIBUNG: Empfängt und verabreitet die Registrierungsdaten neuer User. Die übermittelten Registrierungsdaten werden auf bereits vorhandene E-Mail-Adressen
in der DB geprüft und anschliessend, falls noch nicht vorhanden, in der Datenbank gespeichert.
Das Passwort wird vor der Speicherung mit password_hash() gehasht. Das Ergebnis der Registrierung wird als JSON-Antwort an die Webapp zurückgegeben. 
Werden keine Daten eingegeben, erscheint eine Fehlermeldung. Wird eine E-Mailadresse eingegeben, die bereits existiert in der DB, erschient die Meldung, dass diese 
E-Mail Adresse bereits verwendet wird, */

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
