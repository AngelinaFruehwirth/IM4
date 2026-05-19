/******************************************************************************************
 * Kap. 13: Sende Sensordaten an Server
 * mc.ino
 * Installiere Library "Arduino_JSON" by Arduino
 * Sensordaten sammeln und per HTTP POST Request an Server schicken (-> an load.php).
 * load.php schreibt die Werte dann in die Datenbank
 * Beachte: Passe den Pfad zur load.php in const char* serverURL auf deinen eigenen an.
 * Gib SSID und Passwort deines WLANs an.
 * Ersetze den Block "Sensor auslesen" durch tatsächliche Sensorwerte.
 ******************************************************************************************/



#include <WiFi.h>
#include <HTTPClient.h>
#include <Adafruit_NeoPixel.h>
#include <Arduino_JSON.h> 

unsigned long lastTime = 0;
unsigned long timerDelay = 15000;                                  // alle 15s wird ein neuer Wert verschickt

const char* ssid     = "tinkergarden";                             // WLAN SSID
const char* pass     = "strenggeheim";                             // WLAN Passwort
const char* serverURL = "https://im4.angelina-fruehwirth.ch/api/load.php";  // Server-Adresse: hier kann http oder https stehen, aber nicht ohne, zB. https://im4.physco.dorfkneipe.ch/api/load.php

bool isWlanConnected = 0;
int led = LED_BUILTIN;

// --- LED RING SETUP ---
#define LED_PIN        5   // Datenleitung des LED-Rings an GPIO 5 anschließen
#define NUMPIXELS     12   // HIER ANPASSEN: Anzahl der LEDs auf eurem Ring (z.B. 8, 12, 16 oder 24)
Adafruit_NeoPixel ring(NUMPIXELS, LED_PIN, NEO_GRB + NEO_KHZ800);

// Temperatur Sensor
#include "DHT.h"
#define DHTPIN 7    
#define DHTTYPE DHT11           
DHT dht(DHTPIN, DHTTYPE);

// --- SENSOR 2: MQ-135 (Gassensor / CO2) ---
// Falls ihr den AO-Pin an einen anderen GPIO angeschlossen habt, hier die Zahl ändern!
#define MQ135_PIN 4

void setup() {
  Serial.begin(115200);
  delay(1000);
  pinMode(led, OUTPUT);
  rgbLedWrite(led, 0, 255, 0);                        // GRB: rot
  Serial.println("Starte Verbindung...");
  connectWiFi();

  // Temperatur Sensor
  dht.begin();
// Analoge Pins müssen nicht zwingend mit pinMode definiert werden, schadet aber nicht:
  pinMode(MQ135_PIN, INPUT);
}

void loop() {
  if (!is_wlan_connected())return; 
  if ((millis() - lastTime) > timerDelay) {           // alle 15 Sekunden...
    lastTime = millis();

    ////////////////////////////////////////////////////////////// sensor auslesen

  float hum = dht.readHumidity();       // Reading temperature or humidity takes about 250 milliseconds!
  float temp = dht.readTemperature();    // °C

// MQ-135 auslesen (Liefert einen Wert zwischen 0 und 4095 beim ESP32)
    int co2 = analogRead(MQ135_PIN);

  if (isnan(hum) || isnan(temp)) {
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }

    // float wert = (float)random(0, 1000) / 10;         // ersetzen durch sensor !! Zunächst zufällige Zahl 0 - 100
    // Serial.println(temp);
   //  Serial.println(hum);

    Serial.print("temp: ");
    Serial.print(temp, 1); // 1 Nachkommastelle
    Serial.print("°C | hum: ");
    Serial.print(hum, 1);
    Serial.print("% | co2: ");
    Serial.print(co2);
    Serial.println(); // Zeilenumbruch


    // 2. AMPEL-LOGIK FÜR DEN LED-RING
    // ==========================================
    int r = 0, g = 0, b = 0; // Variablen für Rot, Grün, Blau

    // REGEL 1: Lila Warnung (Temperatur oder Feuchtigkeit ausserhalb des Limits)
    if (hum < 25.0 || hum > 65.0 || temp < 15.0 || temp > 28.0) {
      r = 128; g = 0; b = 128; // Lila
      Serial.println("Ampel: LILA (Warnung: Temp/Hum außerhalb des Limits!)");
    }
    // REGEL 2: Rot (CO2 ab 1600)
    else if (co2 >= 1600) {
      r = 255; g = 0; b = 0;   // Rot
      Serial.println("Ampel: ROT (Lüften zwingend nötig!)");
    }
    // REGEL 3: Gelb (CO2 ab 1000 bis 1599)
    else if (co2 >= 1000) {
      r = 255; g = 150; b = 0; // Gelb/Orange
      Serial.println("Ampel: GELB (Lüften empfohlen!)");
    }
    // REGEL 4: Grün (CO2 bis 999)
    else {
      r = 0; g = 255; b = 0;   // Grün
      Serial.println("Ampel: GRÜN (Gute Luftqualität)");
    }

    // Die ermittelte Farbe auf alle LEDs des Rings übertragen
    for(int i=0; i<NUMPIXELS; i++) {
      ring.setPixelColor(i, ring.Color(r, g, b));
    }
    ring.show(); // Ring aktualisieren, damit er leuchtet

    ////////////////////////////////////////////////////////////// JSON zusammenbauen

   //JSONVar dataObject;
    //dataObject["sensor"] = "DHT11_Sensor"; // Oder ein beliebiger Name
    //dataObject["temp"] = temp;
    //dataObject["hum"] = hum;
    //String jsonString = JSON.stringify(dataObject);
    // String jsonString = "{\"sensor\":\"fiessling\", \"wert\":77}";  // stattdessen könnte man den JSON string auch so zusammenbauen

    //JSONVar dataObject;
    //dataObject["sensor"] = "DHT11_MQ135_Node"; // Name eurer Station
    //dataObject["temp"]   = temp;
    //dataObject["hum"]    = hum;
    //dataObject["co2"]    = co2;           // HIER ERGÄNZT: Gaswert wird ins JSON gepackt!
    
   // String jsonString = JSON.stringify(dataObject);
   // Serial.print("Sende JSON: ");
   // Serial.println(jsonString);
  
////////////////////////////////////////////////////////////// JSON zusammenbauen

    JSONVar dataObject;
    // HIER GEÄNDERT: Wir löschen das dataObject["sensor"], da die load.php es nicht erwartet!
    dataObject["temp"]   = temp;
    dataObject["hum"]    = hum;
    dataObject["co2"]    = co2;           
    
    String jsonString = JSON.stringify(dataObject);
    Serial.print("Sende JSON an Server (jetzt ohne sensor-Feld): ");
    Serial.println(jsonString);

     ////////////////////////////////////////////////////////////// JSON string per HTTP POST request an den Server schicken (server2db.php)

    if (WiFi.status() == WL_CONNECTED) {                // Überprüfen, ob Wi-Fi verbunden ist
      // HTTP Verbindung starten und POST-Anfrage senden
      HTTPClient http;
      http.begin(serverURL);
      http.addHeader("Content-Type", "application/json");
      int httpResponseCode = http.POST(jsonString);

      // Prüfen der Antwort
      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.printf("HTTP Response code: %d\n", httpResponseCode);
        Serial.println("Response: " + response);
      } else {
        Serial.printf("Error on sending POST: %d\n", httpResponseCode);
      }

      http.end();
    } else {
      Serial.println("WiFi Disconnected");
    }
  }
}


void connectWiFi(){
    Serial.printf("\nVerbinde mit WLAN %s", ssid); // ssid ist const char*, kein String(ssid) nötig
    WiFi.begin(ssid, pass);

    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 40)
    { // Max 20 Versuche (10 Sekunden)
        delay(500);
        Serial.print(".");
        attempts++;
    }
    if (WiFi.status() == WL_CONNECTED){
        Serial.printf("\nWiFi verbunden: SSID: %s, IP-Adresse: %s\n", ssid, WiFi.localIP().toString().c_str());
        rgbLedWrite(led, 255, 0, 0);               // GRB: grün
    }
    else{
        Serial.println("\n❌ WiFi Verbindung fehlgeschlagen!");
    }
}

bool is_wlan_connected(){
  if (WiFi.status() != WL_CONNECTED) {
    if (isWlanConnected == 1) {                     // War vorher verbunden?
      Serial.println("WiFi-Verbindung verloren, reconnect...");
      rgbLedWrite(led, 0, 255, 0);                  // GRB: Rot
      isWlanConnected = 0;
    }
    connectWiFi(); 
    return false;                                   // Loop wird abgebrochen
  }
  return true;                                      // WiFi ist da, Loop darf weiterlaufen
}