/* BESCHREIBUNG: Beendet die aktive Session und meldet den User sicher von der Webapp ab.*/

<?php
// logout.php
session_start();
$_SESSION = [];
session_destroy();

// Return a success response instead of redirecting
header('Content-Type: application/json');
echo json_encode(["status" => "success"]);
exit;
?>