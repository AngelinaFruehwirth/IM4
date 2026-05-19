async function checkAuth() {
  try {
    const response = await fetch("api/protected.php", {
      credentials: "include",
    });

    if (response.status === 401) {
      window.location.href = "login.html";
      return null;
    }

    if (!response.ok) {
      throw new Error("Auth check failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Auth check failed:", error);
    window.location.href = "login.html";
    return null;
  }
}

async function logout() {
  try {
    await fetch("api/logout.php", {
      credentials: "include",
    });

    window.location.href = "login.html";
  } catch (error) {
    console.error("Logout failed:", error);
    window.location.href = "login.html";
  }
}

window.addEventListener("load", async () => {
  const user = await checkAuth();

  if (!user) return;

  const profileName = document.getElementById("profileName");

  profileName.textContent = user.name || user.email || "du";

  document.getElementById("logoutBtn").addEventListener("click", logout);

  document.getElementById("changeNameBtn").addEventListener("click", () => {
    alert("Name ändern bauen wir als nächsten Schritt.");
  });

  document.getElementById("changePasswordBtn").addEventListener("click", () => {
    alert("Passwort ändern bauen wir als nächsten Schritt.");
  });
});