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

async function loadRooms() {
  try {
    const response = await fetch("api/room.php", {
      credentials: "include",
    });

    if (response.status === 401) {
      window.location.href = "login.html";
      return;
    }

    const result = await response.json();

    if (result.status === "success") {
      renderRooms(result.rooms || []);
    } else {
      alert(result.message || "Räume konnten nicht geladen werden.");
    }
  } catch (error) {
    console.error("Rooms loading failed:", error);
    alert("Beim Laden der Räume ist etwas schiefgelaufen.");
  }
}

function renderRooms(rooms) {
  const roomsList = document.getElementById("roomsList");
  roomsList.innerHTML = "";

  if (rooms.length === 0) {
    roomsList.innerHTML = `
      <p class="rooms-empty">Noch keine Zimmer vorhanden.</p>
    `;
    return;
  }

  rooms.forEach((room, index) => {
    const card = document.createElement("article");
    card.className = `room-card ${index % 2 === 0 ? "room-card-pink" : "room-card-blue"}`;

    card.innerHTML = `
      <h2>Zimmer ${index + 1}</h2>

      <label>Zimmername</label>
      <div class="room-field">${room.room_name || "-"}</div>

      <label>Gerätenummer</label>
      <div class="room-field">${room.serien_nr || "-"}</div>
    `;

    roomsList.appendChild(card);
  });
}

async function addRoom() {
  const roomName = prompt("Zimmername eingeben:");
  if (!roomName || !roomName.trim()) return;

  const serialNumber = prompt("Gerätenummer eingeben:");
  if (!serialNumber || !serialNumber.trim()) return;

  try {
    const response = await fetch("api/room.php", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        roomName: roomName.trim(),
        serialNumber: serialNumber.trim(),
      }),
    });

    const result = await response.json();

    if (result.status === "success") {
      await loadRooms();
    } else {
      alert(result.message || "Zimmer konnte nicht hinzugefügt werden.");
    }
  } catch (error) {
    console.error("Room creation failed:", error);
    alert("Beim Hinzufügen ist etwas schiefgelaufen.");
  }
}

window.addEventListener("load", async () => {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) return;

  await loadRooms();

  document.getElementById("addRoomBtn").addEventListener("click", addRoom);
});