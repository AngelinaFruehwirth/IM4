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
$roomName = trim($_POST["roomName"] ?? "");

if ($roomName === "") {
    echo json_encode([
        "status" => "error",
        "message" => "Zimmername darf nicht leer sein."
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        UPDATE Raeume
        SET name = :name
        WHERE id = (
            SELECT id FROM (
                SELECT id
                FROM Raeume
                WHERE user_id = :user_id
                ORDER BY id ASC
                LIMIT 1
            ) AS first_room
        )
    ");

    $stmt->execute([
        "name" => $roomName,
        "user_id" => $user_id
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "Zimmername gespeichert."
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Zimmername konnte nicht gespeichert werden."
    ]);
}