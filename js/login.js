document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Bitte E-Mail und Passwort eingeben.");
    return;
  }

  try {
    const response = await fetch("api/login.php", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email: email,
        password: password,
      }),
    });

    const result = await response.json();

    if (result.status === "success") {
      window.location.href = "profil.html";
    } else {
      alert(result.message || "Login fehlgeschlagen.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Beim Login ist etwas schiefgelaufen.");
  }
});