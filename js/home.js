/*BESCHREIBUNG: Steuert die Funktionen der Homeseite der Webapp.
Prüft, ob der User angemeldet ist, lädt dann die aktuellen Sensordaten sowie den Messwerteverlauf vom Server und aktualisiert die Anzeige
der Temperatur, Luftqualität und Luftfeuchtigkeit.
Zusätzlich wird die Luftqualität wie definiert bewertet, ob sie gut, mittel oder schlecht ist, damit das mit CSS und HTML entsprechend grafisch dargestellt werden kann.*/

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

async function loadHomeData() {
  try {
    const response = await fetch("api/home.php", {
      credentials: "include",
    });

    if (response.status === 401) {
      window.location.href = "login.html";
      return;
    }

    const data = await response.json();

    if (data.status !== "success") {
      showNoData();
      return;
    }

    const roomNameDisplay = document.getElementById("roomNameDisplay");

    if (roomNameDisplay) {
      roomNameDisplay.textContent = data.room?.room_name || "Kinderzimmer";
    }

    const latest = data.latest;

    if (!latest) {
      showNoData();
      return;
    }

    const co2 = Number(latest.co2);
    const temp = Number(latest.temp);
    const hum = Number(latest.hum);

    if (Number.isNaN(co2)) {
      showNoData();
      return;
    }

    updateAirQuality(co2);
    updateTemperature(temp);
    updateHumidity(hum);

    await loadChart();
  } catch (error) {
    console.error("Fehler beim Laden der Home-Daten:", error);
    showNoData();
  }
}

async function loadChart() {
  try {
    const response = await fetch("api/chart.php", {
      credentials: "include",
    });

    if (response.status === 401) {
      window.location.href = "login.html";
      return;
    }

    const data = await response.json();

    if (data.status === "success") {
      renderAirChart(data.history || []);
    } else {
      renderAirChart([]);
    }
  } catch (error) {
    console.error("Chart loading failed:", error);
    renderAirChart([]);
  }
}

function updateAirQuality(value) {
  const airValue = document.getElementById("airValue");
  const statusCloud = document.getElementById("statusCloud");
  const statusLabel = document.getElementById("statusLabel");
  const statusMessage = document.getElementById("statusMessage");

  airValue.textContent = Math.round(value);

  airValue.classList.remove("air-good", "air-medium", "air-bad");
  statusLabel.classList.remove("status-good", "status-medium", "status-bad");

  if (value < 1000) {
    statusCloud.src = "./resources/assets/Wolken_gut.png";
    statusLabel.textContent = "Alles gut!";
    statusLabel.classList.add("status-good");
    airValue.classList.add("air-good");
    statusMessage.textContent = "Lüften nicht nötig.";
  } else if (value <= 1400) {
    statusCloud.src = "./resources/assets/Wolken_mittel.png";
    statusLabel.textContent = "Eher kritisch!";
    statusLabel.classList.add("status-medium");
    airValue.classList.add("air-medium");
    statusMessage.textContent = "Lüften empfohlen.";
  } else {
    statusCloud.src = "./resources/assets/Wolken_schlecht.png";
    statusLabel.textContent = "Nicht gut!";
    statusLabel.classList.add("status-bad");
    airValue.classList.add("air-bad");
    statusMessage.textContent = "Bitte schnell lüften.";
  }
}

function updateTemperature(value) {
  const temperatureValue = document.getElementById("temperatureValue");

  if (!temperatureValue) return;

  temperatureValue.textContent = Number.isNaN(value)
    ? "--°"
    : `${Math.round(value)}°`;
}

function updateHumidity(value) {
  const humidityValue = document.getElementById("humidityValue");

  if (!humidityValue) return;

  humidityValue.textContent = Number.isNaN(value)
    ? "--%"
    : `${Math.round(value)}%`;
}

function showNoData() {
  const airValue = document.getElementById("airValue");
  const statusCloud = document.getElementById("statusCloud");
  const statusLabel = document.getElementById("statusLabel");
  const statusMessage = document.getElementById("statusMessage");

  airValue.textContent = "--";
  airValue.classList.remove("air-good", "air-medium", "air-bad");
  airValue.classList.add("air-medium");

  statusCloud.src = "./resources/assets/Wolken_mittel.png";

  statusLabel.classList.remove("status-good", "status-medium", "status-bad");
  statusLabel.classList.add("status-medium");

  statusLabel.textContent = "Keine Daten";
  statusMessage.textContent = "Noch keine Messung vorhanden.";

  updateTemperature(NaN);
  updateHumidity(NaN);
  renderAirChart([]);
}

window.addEventListener("load", async () => {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) return;

  await loadHomeData();
});