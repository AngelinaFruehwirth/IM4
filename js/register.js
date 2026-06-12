/* BESCHREIBUNG: Steuert die Registrierung auf der Webapp.
Die eingegebenen Daten (E-Mail, Name und Passwort) werden mit "fetch" an register.php gesendet. 
Die Antwort des Servers wird ausgewertet und entscheidet abhängig vom Status,
ob die Registrierung erfolgreich war oder eine Fehlermeldung angezeigt wird. 
Bei erfolgreicher Registrierung wird der User auf die Login-Seite weitergeleitet. */

// register.js
document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault(); //nicht mit html sondern mit js senden

    const email = document.getElementById("email").value.trim(); //Daten werden als Variablen gespeichert
    const name = document.getElementById("name").value.trim(); //Daten werden als Variablen gespeichert
    const password = document.getElementById("password").value.trim();

    try { 
      const response = await fetch("api/register.php", { //warte auf Antwort und rufe URL auf
        method: "POST", //in welcher From werden Daten an php gesendet
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, name, password }), //Daten können sicher versendet werden
      });
      const result = await response.json(); //Antowrt wird in result gespeichert

      if (result.status === "success") {
        alert("Registration successful! You can now log in.");
        window.location.href = "login.html";
      } else {
        alert(result.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  });
