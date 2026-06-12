/* BESCHREIBUNG: Pfüft, ob der User angemeldet ist. Stellt einen API-Endpunkt zur Verwaltung von Räumen und Sensoren bereit. 
Per GET werden vorhandene Räume und die dazugehörigen Sensoren aus der Datenbank geladen. 
Per POST werden neue Räume inklusive zugeordneter Sensoren in der DB erstellt und gespeichert. 
Diese Kommunikation erfolgt über JSON-Antworten.*/


<?php
session_start();
header('Content-Type: application/json');

require_once '../system/config.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit;
}

$user_id = $_SESSION['user_id'];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->prepare("
        SELECT 
            r.id AS room_id,
            r.name AS room_name,
            s.id AS sensor_id,
            s.serien_nr
        FROM Raeume r
        LEFT JOIN Sensoren s 
            ON s.raum_id = r.id
        WHERE r.user_id = :user_id
        ORDER BY r.id ASC
    ");

    $stmt->execute([
        ':user_id' => $user_id
    ]);

    echo json_encode([
        "status" => "success",
        "rooms" => $stmt->fetchAll(PDO::FETCH_ASSOC)
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $roomName = trim($_POST['roomName'] ?? '');
    $serialNumber = trim($_POST['serialNumber'] ?? '');

    if (!$roomName || !$serialNumber) {
        echo json_encode([
            "status" => "error",
            "message" => "Zimmername und Gerätenummer sind erforderlich."
        ]);
        exit;
    }

    $pdo->beginTransaction();

    try {
        $insertRoom = $pdo->prepare("
            INSERT INTO Raeume (name, user_id)
            VALUES (:name, :user_id)
        ");

        $insertRoom->execute([
            ':name' => $roomName,
            ':user_id' => $user_id
        ]);

        $roomId = $pdo->lastInsertId();

        $insertSensor = $pdo->prepare("
            INSERT INTO Sensoren (serien_nr, raum_id)
            VALUES (:serien_nr, :raum_id)
        ");

        $insertSensor->execute([
            ':serien_nr' => $serialNumber,
            ':raum_id' => $roomId
        ]);

        $pdo->commit();

        echo json_encode([
            "status" => "success",
            "message" => "Zimmer wurde hinzugefügt."
        ]);
    } catch (PDOException $e) {
        $pdo->rollBack();

        echo json_encode([
            "status" => "error",
            "message" => "Zimmer konnte nicht gespeichert werden."
        ]);
    }

    exit;
}

echo json_encode([
    "status" => "error",
    "message" => "Invalid request method"
]);