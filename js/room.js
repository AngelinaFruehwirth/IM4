async function checkAuth() {
  try {
    const response = await fetch("api/protected.php", {
      credentials: "include",
    });

    if (response.status === 401) {
      window.location.href = "login.html";
      return false;
    }

    return response.ok;
  } catch (error) {
    console.error("Auth failed:", error);
    window.location.href = "login.html";
    return false;
  }
}

async function loadRoomName() {
  try {
    const response = await fetch("api/home.php", {
      credentials: "include",
    });

    if (response.status === 401) {
      window.location.href = "login.html";
      return;
    }

    const data = await response.json();

    if (data.status === "success") {
      const roomInput = document.getElementById("roomNameInput");
      roomInput.value = data.room?.room_name || "Kinderzimmer";
    }
  } catch (error) {
    console.error("Zimmername konnte nicht geladen werden:", error);
  }
}

async function saveRoomName() {
  const roomInput = document.getElementById("roomNameInput");
  const roomName = roomInput.value.trim();

  if (!roomName) {
    alert("Bitte gib einen Zimmernamen ein.");
    return;
  }

  try {
    const response = await fetch("api/update-room-name.php", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        roomName: roomName,
      }),
    });

    const result = await response.json();

    if (result.status === "success") {
      alert("Zimmername wurde gespeichert.");
    } else {
      alert(result.message || "Zimmername konnte nicht gespeichert werden.");
    }
  } catch (error) {
    console.error("Speichern fehlgeschlagen:", error);
    alert("Beim Speichern ist etwas schiefgelaufen.");
  }
}

window.addEventListener("load", async () => {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) return;

  await loadRoomName();

  const saveRoomBtn = document.getElementById("saveRoomBtn");

  saveRoomBtn.addEventListener("click", saveRoomName);

  const roomInput = document.getElementById("roomNameInput");

  roomInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      saveRoomName();
      roomInput.blur();
    }
  });
});