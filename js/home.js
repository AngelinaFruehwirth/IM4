async function checkAuth() {
  try {
    const response = await fetch("/api/protected.php", {
      credentials: "include",
    });

    if (response.status === 401) {
      window.location.href = "/login.html";
      return false;
    }

    return true;
  } catch (error) {
    console.error("Auth check failed:", error);
    window.location.href = "/login.html";
    return false;
  }
}

function updateAirQuality(value) {
  const airValue = document.getElementById("airValue");
  const statusCloud = document.getElementById("statusCloud");
  const statusLabel = document.getElementById("statusLabel");
  const statusMessage = document.getElementById("statusMessage");

  airValue.textContent = value;

  statusLabel.classList.remove("status-good", "status-medium", "status-bad");

  if (value < 1000) {
    statusCloud.src = "./resources/assets/Wolken_gut.png";
    statusLabel.textContent = "Alles gut!";
    statusLabel.classList.add("status-good");
    statusMessage.textContent = "Lüften nicht nötig.";
  } else if (value <= 1400) {
    statusCloud.src = "./resources/assets/Wolken_mittel.png";
    statusLabel.textContent = "Eher Kritisch!";
    statusLabel.classList.add("status-medium");
    statusMessage.textContent = "Lüften empfohlen.";
  } else {
    statusCloud.src = "./resources/assets/Wolken_schlecht.png";
    statusLabel.textContent = "Nicht gut!";
    statusLabel.classList.add("status-bad");
    statusMessage.textContent = "Bitte schnell Lüften.";
  }
}

function setupRoomDropdown() {
  const roomSelect = document.getElementById("roomSelect");

  roomSelect.addEventListener("change", () => {
    const selectedRoom = roomSelect.value;

    if (selectedRoom === "kinderzimmer") {
      updateAirQuality(879);
    }

    if (selectedRoom === "schlafzimmer") {
      updateAirQuality(1345);
    }

    if (selectedRoom === "wohnzimmer") {
      updateAirQuality(1567);
    }
  });
}

window.addEventListener("load", async () => {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) return;

  updateAirQuality(879);
  setupRoomDropdown();
});