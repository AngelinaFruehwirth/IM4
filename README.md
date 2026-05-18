# 🔑👤 Authentifizierung Minimal (Boilerplate)

![Static Badge](https://img.shields.io/badge/Sprache-PHP-%23f7df1e)
![Static Badge](https://img.shields.io/badge/Kurs-MMP_IM4-blue)
![Last Changed](https://img.shields.io/endpoint?url=https://badges.crazy-internet.ch/im4_example.php)

> 🎨 Dieses Boilerplate kann entweder in einem Code-Along Schritt für Schritt gemeinsam erarbeitet werden oder fixfertig auf einem Webserver installiert werden.

Dieses Repository beinhaltet ein vollständiges, minimales Authenzifizierungs-System basierend auf PHP als Backend und HTML/CSS/JS als Frontend.

Es ermöglicht Benutzern das `Registrieren`, `Anmelden`, `Abmelden` und den Zugriff auf eine `geschützte Seite` nach erfolgreicher Authentifizierung.

# 🏁 Live - Version

Du kannst Homely unter folgendem Link testen:

[https://im4.crazy-internet.ch/](https://im4.crazy-internet.ch/)

## ⚙️ Installation

Um dieses Boilerplate auf dem eigenen Web-Server zu installieren, führe folgende Schritte aus:

### 1. Download

- [Klone das Repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) über GitHub oder [downloade das Repository als ZIP Datei](https://docs.github.com/en/repositories/working-with-files/using-files/downloading-source-code-archives) auf deinen eigenen Computer.

### 2. Datenbank

- Erstelle eine neue Datenbank bei deinem Hoster (z.B. [Infomaniak](https://www.infomaniak.com/de/support/faq/1981/mysqlmariadb-benutzer-und-datenbanken-verwalten)).

- Importiere die Datei `system/database.sql` in die neue Datenbank, um die `users` Tabelle zu erstellen.

### 3. Code

- Benenne die Datei `system/config.php.blank` in `system/config.php` um.

- Passe die Datenbankverbindungsdaten in der Datei `system/config.php` an.

### 4. FTP Connect

- Erstelle eine neue FTP Verbindung mit dem SFTP Plugin gemäss [Anleitung im MMP 101](https://github.com/Interaktive-Medien/101-MMP/blob/main/resources/sftp.md).

# 📁 Struktur

## 🎨 Frontend

### root (Basis-Verzeichnis)

- beinhaltet alle HTML-Dateien des Frontends.
- beinhaltet die `.gitignore` Datei, welche die Dateien und Verzeichnisse ausblendet, die nicht auf GitHub hochgeladen werden sollen.

### js

- beinhaltet alle JavaScript-Dateien des Frontends.

### css

- beinhaltet alle CSS-Dateien des Frontends.

## 🤖 Backend

### api

- Beinhaltet alle API-Endpunkte des Backends.
- Diese Dateien werden von `JavaScript` aufgerufen und geben eine Antwort an `JavaScript` zurück.

### system

- Beinhaltet die Konfigurationsdatei für die Datenbankverbindung.
- Beinhaltet die Datei `database.sql`, die die `users` Tabelle erstellt.
- Beinhaltet die Datei `config.php`, die die Konfiguration des Backends enthält.


//read me für Abgabe:

## Kurzbeschreibung des Projekts

* **Modul:** Interaktive Medien 4 an der Fachhochschule Graubünden (FS26)  
* **Themenfeld:** IoT-Applikation zum Thema Eltern mit kleinen Kindern  
* **Name des Projekts:** \[*Name*\]   
* **Team Physical Computing:** \[*Namen*\]   
* **Team WebApp:** \[*Namen*\]
 
 
* Welches Problem im Alltag von Eltern mit kleinen Kindern wird gelöst? 
* Was ist der „Sinn und Zweck“ des Systems?

\[*Bilder / GIFs (optional)*\]

### UX & Konzeption

*In diesem Teil werden die gemeinsamen Schritte aus der UX-Abgabe dokumentiert, damit sich hier alles vollständig an einem Ort befindet (betrifft WebApp und Physical Computing)*

* **Figma:** [Link zum Figma](http://link.zum.figma)
* **User Flow \+ Screen Flow** (Screenshot aus Figma)  
* ggf. weitere Ergänzungen
* *Welche Features waren angedacht?*
* *Welche Features wurden nicht umgesetzt? (Warum)*

### Setup

* **WebApp:** [Link zur Website](http://link.zur.website)  
* **Video-Dokumentation:** [Link zum Video auf Youtube](http://link.zum.video) 

#### Installationsanleitung WebApp

***verständliche** Schritt-für-Schritt-Anleitung für Aussenstehende, um das Projekt zu klonen und auf einem eigenen Server zu installieren*

1. *Was benötige ich an Infrastruktur?*  
2. *Was muss ich auf meinem Webserver installieren?*  
3. *Wie kann ich die Datenbank importieren?*  
4. *Wo muss ich die DB-Credentials eintragen?*  
5. *…*  
6. *Wie nehme ich das physische Artefakt in Betrieb?*

#### Bauanleitung Physical Computing

* ***Was muss ich wie bauen, verbinden, installieren?***  
* *ergänze: **Komponentenplan** (betrifft Physical Computing, vgl. Slides Kapitel 15): Schaubild enthält*  
  * *die eingesetzten Komponenten*  
  * *die verbundenen Sensoren und Aktoren*  
  * *die Programme (mit Dateinamen)*  
  * *die Kommunikationswege*  
* *ergänze: **Steckplan** (betrifft Physical Computing, vgl. Slides Kapitel 15): generiert z.B. mit Fritzing (empfohlen), Tinkercad, Wokwi*  
  * *beachtet die [Fritzing Parts](https://github.com/Interaktive-Medien/im_physical_computing/tree/main/15_Intro_Projektdoku) extra für euch*  
* *ggf. **Bildmaterial***

## technische Details

// Hier sollte das Verständnis ersichtlich sein / Wie stehen die Dateien in Beziehung zueinander, Wie reden Die Dateien miteinander, Wie ist der Weg der Daten

* **Projektstruktur / Code-Struktur:** \[*Hinweis: Der Code selbst muss im Repository liegen und im Kopfbereich jeder Datei eine kurze Zusammenfassung enthalten.*\]  
* **Datenschnittstelle: \[***zwischen WebApp und Physical Computing*\]  
* **ERM:** \[*Erklärung und Schaubild*\]  
* **Authentifizierung:** \[*Erklärung*\]

## Known bugs

* Was funktioniert noch nicht einwandfrei?  
* Was ist uns aufgefallen bei der Entwicklung?  
* Was könnte noch verbessert werden?

## Umsetzungsprozess

* **Reflexion / Erfahrung / Lernfortschritt:** *Was haben wir gelernt? Würden wir es nochmal genauso machen? Was war gut, was war schlecht?*  
* **Herausforderungen & Lösungen:** \[*Verworfene Ansätze, Fehler, Umplanungen*\]  
* **KI-Einsatz:** *Dokumentation der verwendeten KI-Tools und deren Nutzen (KI ist nicht verboten)*  
* **Fazit:** …
