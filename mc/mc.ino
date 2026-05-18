/******************************************************************************************
 * Kap. 13: Sende Sensordaten an Server (Erweitert um DHT11 und MQ-135)
 * mc.ino
 * Installiere Libraries: "Arduino_JSON", "DHT sensor library" by Adafruit
 ******************************************************************************************/

#include <WiFi.h>
#include <HTTPClient.h>
#include <Arduino_JSON.h> 
#include "DHT.h"

// --- Zeitsteuerung ---
unsigned long lastTime = 0;
unsigned long timerDelay = 15000;                                  // Alle 15s wird ein neuer Datensatz verschickt

// --- WLAN & Server Konfiguration ---
const char* ssid     = "tinkergarden";                             // WLAN SSID
const char* pass     = "strenggeheim";                             // WLAN Passwort
const char* serverURL = "https://im4.angelina-fruehwirth.ch/api/load.php"; 

bool isWlanConnected = 0;
int led = LED_BUILTIN;

// --- Sensor Konfiguration ---
#define DHTPIN 7     
#define DHTTYPE DHT11           
DHT dht(DHTPIN, DHTTYPE);

int gasPin = 4;


void setup() {
  Serial.begin(115200);
  delay(1000);
  
  // Sensoren initialisieren
  dht.begin();
  
  pinMode(led, OUTPUT);
  rgbLedWrite(led, 0, 255, 0);                        // GRB: rot
  Serial.println("Starte Verbindung...");
  connectWiFi();
}

void loop() {
  if (!is_wlan_connected()) return; 
  
  if ((millis() - lastTime) > timerDelay) {           // Alle 15 Sekunden...
    lastTime = millis();

    ////////////////////////////////////////////////////////////// Sensoren auslesen

    // DHT11 auslesen
    float h = dht.readHumidity();       
    float t = dht.readTemperature();    

    // MQ-135 auslesen
    int gasWert = analogRead(gasPin);

    // Prüfen, ob das Auslesen des DHT11 geklappt hat
    if (isnan(h) || isnan(t)) {
      Serial.println(F("Fehler beim Lesen des DHT-Sensors! Werte werden übersprungen."));
      return; 
    }

    // Konsolen-Ausgabe zur Kontrolle
    Serial.printf("Temp: %.1f°C | Feuchtigkeit: %.1f%% | Gaswert: %d\n", t, h, gasWert);

    ////////////////////////////////////////////////////////////// JSON zusammenbauen

    JSONVar dataObject;
    dataObject["temperatur"] = t;
    dataObject["luftfeuchtigkeit"] = h;
    dataObject["gaswert"] = gasWert;
    
    String jsonString = JSON.stringify(dataObject);

     ////////////////////////////////////////////////////////////// JSON per HTTP POST an den Server schicken

    if (WiFi.status() == WL_CONNECTED) {
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
    Serial.printf("\nVerbinde mit WLAN %s", ssid);
    WiFi.begin(ssid, pass);

    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 40) {
        delay(500);
        Serial.print(".");
        attempts++;
    }
    if (WiFi.status() == WL_CONNECTED){
        Serial.printf("\nWiFi verbunden: SSID: %s, IP-Adresse: %s\n", ssid, WiFi.localIP().toString().c_str());
        rgbLedWrite(led, 255, 0, 0);               // GRB: grün
        isWlanConnected = 1;
    }
    else{
        Serial.println("\n❌ WiFi Verbindung fehlgeschlagen!");
    }
}

bool is_wlan_connected(){
  if (WiFi.status() != WL_CONNECTED) {
    if (isWlanConnected == 1) {
      Serial.println("WiFi-Verbindung verloren, reconnect...");
      rgbLedWrite(led, 0, 255, 0);                  // GRB: Rot
      isWlanConnected = 0;
    }
    connectWiFi(); 
    return false;
  }
  return true;
}