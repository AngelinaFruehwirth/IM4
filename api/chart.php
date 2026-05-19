<?php
session_start();
header("Content-Type: application/json");

require_once __DIR__ . "/../system/config.php";

if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["error" => "Nicht eingeloggt"]);
    exit;
}

$user_id = $_SESSION["user_id"];
$room_id = $_GET["room_id"] ?? null;

if (!$room_id) {
    echo json_encode(["error" => "Keine Raum-ID übergeben"]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT 
            DATE_FORMAT(sd.zeit, '%H:%i') AS time,
            sd.co2
        FROM sensordata sd
        INNER JOIN Sensoren s 
            ON sd.sensor_id = s.id
        INNER JOIN Raeume r 
            ON s.raum_id = r.id
        WHERE r.user_id = :user_id
          AND r.id = :room_id
          AND DATE(sd.zeit) = CURDATE()
        ORDER BY sd.zeit ASC
    ");

    $stmt->execute([
        ":user_id" => $user_id,
        ":room_id" => $room_id
    ]);

    $history = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "history" => $history
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Datenbankfehler"]);
}