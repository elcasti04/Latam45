const canvas = document.getElementById("chart");
if (!canvas) throw new Error("Canvas no encontrado");

const ctx = canvas.getContext("2d");

const data = Array.from({ length: 140 }, (_, i) => ({
  x: i,
  y: 24 + Math.sin(i / 10) * 0.6 + Math.random() * 0.4 + i * 0.015
}));

new Chart(ctx, {
  type: "line",
  data: {
    labels: data.map(d => d.x),
    datasets: [
      {
        data: data.map(d => d.y),
        borderColor: "#14b8a6",
        backgroundColor: "rgba(20,184,166,0.2)",
        fill: true,
        tension: 0.35,
        pointRadius: 0
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { display: false },
      y: { display: false }
    }
  }
});
