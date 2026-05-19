let rooms = [];

async function checkAuth() {
  try {
    const response = await fetch("api/protected.php", {
      credentials: "include",
    });

    if (response.status === 401) {
      window.location.href = "login.html";
      return false;
    }

    if (!response.ok) {
      throw new Error("Auth check failed");
    }

    return true;
  } catch (error) {
    console.error("Auth check failed:", error);
    window.location.href = "login.html";
    return false;
  }
}

async function loadRooms() {
  try {
    const response = await fetch("api/home.php", {
      credentials: "include",
    });

    if (response.status === 401) {
      window.location.href = "login.html";
      return;
    }

    if (!response.ok) {
      throw new Error("Räume konnten nicht geladen werden.");
    }

    const data = await response.json();
    rooms = data.rooms || [];

    fillRoomDropdown();

    if (rooms.length > 0) {
      updateRoomDisplay(rooms[0].room_id);
    } else {
      showNoData();
    }
  } catch (error) {
    console.error("Fehler beim Laden der Räume:", error);
    showNoData();
  }
}

function fillRoomDropdown() {
  const roomSelect = document.getElementById("roomSelect");

  roomSelect.innerHTML = "";

  if (rooms.length === 0) {
    roomSelect.innerHTML = `<option value="">Keine Räume</option>`;
    return;
  }

  rooms.forEach((room) => {
    const option = document.createElement("option");
    option.value = room.room_id;
    option.textContent = room.room_name;
    roomSelect.appendChild(option);
  });

  roomSelect.onchange = () => {
    updateRoomDisplay(roomSelect.value);
  };
}

function updateRoomDisplay(roomId) {
  const selectedRoom = rooms.find(
    (room) => String(room.room_id) === String(roomId)
  );

  if (!selectedRoom || selectedRoom.ppm === null) {
    showNoData();
    return;
  }

  const ppm = Number(selectedRoom.ppm);

  if (Number.isNaN(ppm)) {
    showNoData();
    return;
  }

  updateAirQuality(ppm);
}

function updateAirQuality(value) {
  const airValue = document.getElementById("airValue");
  const statusCloud = document.getElementById("statusCloud");
  const statusLabel = document.getElementById("statusLabel");
  const statusMessage = document.getElementById("statusMessage");

  airValue.textContent = Math.round(value);

  statusLabel.classList.remove("status-good", "status-medium", "status-bad");

  if (value < 1000) {
    statusCloud.src = "./resources/assets/Wolken_gut.png";
    statusLabel.textContent = "Alles gut!";
    statusLabel.classList.add("status-good");
    statusMessage.textContent = "Lüften nicht nötig.";
  } else if (value <= 1400) {
    statusCloud.src = "./resources/assets/Wolken_mittel.png";
    statusLabel.textContent = "Eher kritisch!";
    statusLabel.classList.add("status-medium");
    statusMessage.textContent = "Lüften empfohlen.";
  } else {
    statusCloud.src = "./resources/assets/Wolken_schlecht.png";
    statusLabel.textContent = "Nicht gut!";
    statusLabel.classList.add("status-bad");
    statusMessage.textContent = "Bitte schnell lüften.";
  }
}

function showNoData() {
  const airValue = document.getElementById("airValue");
  const statusCloud = document.getElementById("statusCloud");
  const statusLabel = document.getElementById("statusLabel");
  const statusMessage = document.getElementById("statusMessage");

  airValue.textContent = "--";
  statusCloud.src = "./resources/assets/Wolken_mittel.png";

  statusLabel.classList.remove("status-good", "status-medium", "status-bad");
  statusLabel.classList.add("status-medium");

  statusLabel.textContent = "Keine Daten";
  statusMessage.textContent = "Noch keine Messung vorhanden.";
}

window.addEventListener("load", async () => {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) return;

  await loadRooms();
});