/* BESCHREIBUNG: Prüft den Authentifizierungsstatus des Benutzers für geschützte Seiten, also Bereiche, für die man ein Login braucht.
Sendet beim Laden eine Anfrage an protected.php, um zu überprüfen, ob eine gültige Session besteht. 
Falls es keine gültige Session gibt (Status 401), wird der Benutzer zur Login-Seite weitergeleitet.
Zusätzlich wird die vom Server zurückgegebenen Benutzerdaten (z. B. Name und User-ID), die für die Anzeige und Nutzung der geschützten Seite benötigt werden, verarbeitet. */

async function checkAuth() {
  try {
    const response = await fetch("/api/protected.php", {
      credentials: "include",
    });

    if (response.status === 401) {
      window.location.href = "/login.html";
      return false;
    }

    const result = await response.json();

    // Display user data in the protected content div
    const protectedContent = document.getElementById("protectedContent");
    protectedContent.innerHTML = `
      <h2>Welcome, ${result.name}!</h2>
      <p>Your user ID is: ${result.user_id}</p>
    `;

    return true;
  } catch (error) {
    console.error("Auth check failed:", error);
    window.location.href = "/login.html";
    return false;
  }
}

// Check auth when page loads
window.addEventListener("load", checkAuth);
