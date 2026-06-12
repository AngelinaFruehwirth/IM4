/*BESCHREIBUNG: Ermöglicht es, dem angemeldeten User, sein Passwort zu ändern. 
Zur Änderung muss das alte Passwort und das Neue eingegeben werden. Das aktuelle Passwort wird zuerst in der DB überprüft, ob es mit dem gespeicherten übereinstimmt.
Das neu eingegebene Passwort wird gehasht und die Änderung in der Datenbank gespeichert.
Ist das aktuelle Passwort falsch, oder das neue zu kurz oder ein Feld belibt leer, erscheint eine Fehlermeldung.
Das Ergebnis wird als JSON-Antwort an die Webapp zurückgegeben. */ 

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