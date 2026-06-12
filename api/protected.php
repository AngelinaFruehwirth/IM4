/* BESCHREIBUNG: Stellt einen geschützten API-Endpunkt bereit.
Überprüft anhand der Session (user_id, name, email), ob ein Benutzer angemeldet ist. Bei erfolgreicher Authentifizierung 
werden die Userdaten als JSON-Objekt an die Webanwendung zurückgegeben.
Nicht angemeldete Benutzer erhalten eine HTTP-401-Fehlermeldung und der Zugriff funktioniert nicht. */

<?php
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

echo json_encode([
    "status" => "success",
    "user_id" => $_SESSION['user_id'],
    "name" => $_SESSION['name'] ?? "",
    "email" => $_SESSION['email'] ?? ""
]);