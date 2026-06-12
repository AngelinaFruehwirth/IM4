/* BESCHREIBUNG: Session wird gestartet und geprüft, ob für den User bereits ein Raum registriert wurde in der Datenbank. Falls nicht, wird automatisch ein Raum erstellt. 
Aktuelle Messwerte des verbundenen Sensors werden von der Datenbank geholt und ausgespielt.
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

$user_id = $_SESSION["user_id"];

try {
    // Ersten Raum des eingeloggten Users holen
    $roomStmt = $pdo->prepare("
        SELECT id, name 
        FROM Raeume
        WHERE user_id = :user_id
        ORDER BY id ASC
        LIMIT 1
    ");

    $roomStmt->execute([
        "user_id" => $user_id
    ]);

    $room = $roomStmt->fetch(PDO::FETCH_ASSOC);

    // Falls noch kein Raum existiert, automatisch einen erstellen
    if (!$room) {
        $insertRoom = $pdo->prepare("
            INSERT INTO Raeume (name, user_id)
            VALUES ('Kinderzimmer', :user_id)
        ");

        $insertRoom->execute([
            "user_id" => $user_id
        ]);

        $room = [
            "id" => $pdo->lastInsertId(),
            "name" => "Kinderzimmer"
        ];
    }

    // Neusten Messwert direkt aus sensordata holen
    $dataStmt = $pdo->query("
        SELECT co2, temp, hum, zeit
        FROM sensordata
        ORDER BY zeit DESC
        LIMIT 1
    ");

    $latest = $dataStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "room" => [
            "room_id" => $room["id"],
            "room_name" => $room["name"]
        ],
        "latest" => $latest
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Datenbankfehler"
    ]);
}