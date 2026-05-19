let airChart = null;

function renderAirChart(history) {
  const canvas = document.getElementById("airChart");
  if (!canvas) return;

  const labels = history.map((item) => item.time);
  const values = history.map((item) => Number(item.co2));

  if (airChart) {
    airChart.destroy();
  }

  airChart = new Chart(canvas, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          data: values,
          borderColor: "#282828",
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: "#FFFFFF",
          pointBorderColor: "#282828",
          tension: 0.25,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: 7,
            },
          },
          grid: {
            display: false,
          },
        },
        y: {
          min: 0,
          max: 1600,
          ticks: {
            stepSize: 400,
            font: {
              size: 7,
            },
          },
          grid: {
            color: "rgba(40, 40, 40, 0.12)",
          },
        },
      },
    },
  });
}