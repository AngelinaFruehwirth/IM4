<?php
 /*****************************************************
 * Kapitel 12: Website2DB > Schritt 2: Website -> DB
 * load.php
 * Daten als JSON-String vom Formular sender.html (später vom MC) serverseitig empfangen und Daten in die Datenbank einfügen
 * Datenbank-Verbindung
**************************/

require_once("../system/config.php");
// echo "This script receives HTTP POST messages and pushes their content into the database.";


###################################### Empfangen der JSON-Daten

$inputJSON = file_get_contents('php://input'); // JSON-Daten aus dem Body der Anfrage
$input = json_decode($inputJSON, true); 


###################################### receiving a post request from a HTML form, later from ESP


// Werte aus dem decodierten json auslesen (Inklusive der neuen sensor_id)
$sensor_id = $input["sensor_id"];
$temp      = $input["temp"];         
$hum       = $input["hum"];
$co2       = $input["co2"];


// SQL-Query anpassen: Spaltennamen und Platzhalter (?) um sensor_id erweitern
$sql = "INSERT INTO sensordata (sensor_id, temp, hum, co2) VALUES (?, ?, ?, ?)";
$stmt = $pdo->prepare($sql);


// Alle Variablen als Array in der exakten Reihenfolge der Fragezeichen übergeben
$stmt->execute([$sensor_id, $temp, $hum, $co2]);

echo "Daten erfolgreich für Sensor-ID " . $sensor_id . " gespeichert.";
?>