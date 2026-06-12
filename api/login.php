/* BESCHREIBUNG: Prüft, ob für das Login eine Emailadresse und Passwort (gehasht) eingegeben wurde und gleicht diese mit den gespeicherten Daten in der Datenbank ab. 
Stimmen die eingegebenen Datne mit den Daten in der DB überein, wird eine Session gestartet (mit der User_id, E-Mail und Name hinterlegt).
Sollte Passwort oder Email nicht eingegeben werden, erscheint eine Fehlermeldung.
Wurde die E-Mail oder das Passwort falsche eingegeben, was nach durch das Abgleichen mit den gesammelten Daten in der DB erfolgt, erscheint eine Fehlermeldung.*/

<?php
// login.php
ini_set('session.cookie_httponly', 1);
// ini_set('session.cookie_secure', 1); // if using HTTPS

session_start();
header('Content-Type: application/json');

require_once '../system/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email    = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (!$email || !$password) {
        echo json_encode([
            "status" => "error",
            "message" => "Email and password are required"
        ]);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT id, name, email, password 
        FROM users 
        WHERE email = :email
    ");

    $stmt->execute([
        ':email' => $email
    ]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        session_regenerate_id(true);

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email']   = $user['email'];
        $_SESSION['name']    = $user['name'];

        echo json_encode([
            "status" => "success"
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Invalid credentials"
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid request method"
    ]);
}