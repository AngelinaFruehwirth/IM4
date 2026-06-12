/* BESCHREIBUNG: Session wird gestartet und die Sensormesswerte der letzten 24 Stunden aus der Datenbank geladen und für die Darstellung im Diagramm bereitgestellt.
Zeigt Fehlermeldung, wenn nicht eingeloggt oder keine Verbindung zur Datenbank besteht. */

<?php
session_start();

header("Content-Type: application/json");

require_once __DIR__ . "/../system/config.php";

if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "Nicht eingeloggt"
    ]);
    exit;
}

try {
    $stmt = $pdo->query("
        SELECT 
            DATE_FORMAT(zeit, '%H:%i') AS time,
            co2
        FROM sensordata
        WHERE DATE(zeit) = CURDATE()
        ORDER BY zeit ASC
    ");

    $history = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "history" => $history
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Datenbankfehler"
    ]);
}