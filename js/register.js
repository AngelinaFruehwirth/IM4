// register.js
document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault(); //nicht mit html sondern mit js senden

    const email = document.getElementById("email").value.trim(); //Daten werden als Variablen gespeichert
    const password = document.getElementById("password").value.trim();

    try { 
      const response = await fetch("api/register.php", { //warte auf Antwort und rufe URL auf
        method: "POST", //in welcher From werden Daten an php gesendet
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password }), //Daten können sicher versendet werden
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
