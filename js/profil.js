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

async function changeName() {
  const newName = prompt("Neuen Namen eingeben:");

  if (!newName || !newName.trim()) return;

  try {
    const response = await fetch("api/update-name.php", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        name: newName.trim(),
      }),
    });

    const result = await response.json();

    if (result.status === "success") {
      document.getElementById("profileName").textContent = result.name;
      alert("Name wurde geändert.");
    } else {
      alert(result.message || "Name konnte nicht geändert werden.");
    }
  } catch (error) {
    console.error("Name update failed:", error);
    alert("Beim Ändern des Namens ist etwas schiefgelaufen.");
  }
}

async function changePassword() {
  const currentPassword = prompt("Aktuelles Passwort eingeben:");
  if (!currentPassword) return;

  const newPassword = prompt("Neues Passwort eingeben:");
  if (!newPassword) return;

  try {
    const response = await fetch("api/update-password.php", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        currentPassword: currentPassword,
        newPassword: newPassword,
      }),
    });

    const result = await response.json();

    if (result.status === "success") {
      alert("Passwort wurde geändert.");
    } else {
      alert(result.message || "Passwort konnte nicht geändert werden.");
    }
  } catch (error) {
    console.error("Password update failed:", error);
    alert("Beim Ändern des Passworts ist etwas schiefgelaufen.");
  }
}

window.addEventListener("load", async () => {
  const user = await checkAuth();

  if (!user) return;

  document.getElementById("profileName").textContent =
    user.name || user.email || "du";

  document.getElementById("logoutBtn").addEventListener("click", logout);
  document.getElementById("changeNameBtn").addEventListener("click", changeName);
  document.getElementById("changePasswordBtn").addEventListener("click", changePassword);
});