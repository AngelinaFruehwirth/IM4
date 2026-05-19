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

try {
    $stmt = $pdo->prepare("
        SELECT 
            r.id AS room_id,
            r.name AS room_name,
            s.id AS sensor_id,
            m.ppm,
            m.zeit
        FROM Raeume r
        LEFT JOIN Sensoren s 
            ON s.raum_id = r.id
        LEFT JOIN Messwerte m 
            ON m.sensor_id = s.id
            AND m.zeit = (
                SELECT MAX(m2.zeit)
                FROM Messwerte m2
                WHERE m2.sensor_id = s.id
            )
        WHERE r.user_id = :user_id
        ORDER BY r.name ASC
    ");

    $stmt->execute([
        "user_id" => $user_id
    ]);

    $rooms = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "rooms" => $rooms
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Datenbankfehler"
    ]);
}