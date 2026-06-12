/*BESCHREIBUNG: Ermöglicht angemeldeten Usern ihren Benutzernamen zu ändern.
Der neue Name wird in der DB aktualisiert und anschliessend in der aktiven Session gespeichert. 
Das Ergebnis wird als JSON-Antwort an die Webapp zurückgegeben.
Wird kein Name eingegeben und auf Submit gedrückt, erscheint eine Fehlermeldung, dass das Feld nicht leer sein darf. */

<?php
session_start();
header('Content-Type: application/json');

require_once '../system/config.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

$name = trim($_POST['name'] ?? '');

if (!$name) {
    echo json_encode(["status" => "error", "message" => "Name darf nicht leer sein."]);
    exit;
}

$stmt = $pdo->prepare("UPDATE users SET name = :name WHERE id = :id");
$stmt->execute([
    ':name' => $name,
    ':id' => $_SESSION['user_id']
]);

$_SESSION['name'] = $name;

echo json_encode([
    "status" => "success",
    "name" => $name
]);