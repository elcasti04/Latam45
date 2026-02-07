// ===============================
// CONFIGURACIÓN
// ===============================
const UPDATE_INTERVAL = 10000;
const CLOCK_INTERVAL = 1000;
let autoTimer = null;
let clockTimer = null;

// ===============================
// UTILIDAD: TIMESTAMP
// ===============================
function updateTimestamp() {
  const el = document.getElementById("last-update");
  if (!el) return;

  const now = new Date();
  const dateStr = now.toLocaleDateString("es-CO");
  const timeStr = now.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  });
  el.textContent = `Actualizado: ${dateStr} ${timeStr}`;
}

// ===============================
// DATOS MOCK
// ===============================
function generarDatosMock() {
  return Array.from({ length: 12 }, (_, i) => {
    const cambio = +(Math.random() * 14 - 7).toFixed(2);
    return {
      ticker: `UGPA${i + 1}`,
      exchange: "BMFBOVESPA",
      nombre: `Activo ${i + 1}`,
      cambio_pct: cambio,
      precio: +(Math.random() * 200 + 10).toFixed(2),
      pais: "LatAm"
    };
  });
}

// ===============================
// COLORES
// ===============================
function obtenerColor(cambio) {
  if (cambio > 3) return "#1b5e20";
  if (cambio > 0) return "#2e7d32";
  if (cambio > -3) return "#c62828";
  return "#8e0000";
}

// ===============================
// RENDER GRID
// ===============================
function renderGrid(data) {
  const grid = document.getElementById("grid");
  if (!grid) return;

  grid.innerHTML = ""; 

  data.forEach(row => {
    const color = obtenerColor(row.cambio_pct);

    const link = document.createElement("a");
    link.className = "card-link";
    link.href = `./site/detalle.html?ticker=${row.ticker}`;

    link.innerHTML = `
      <div class="card-stock" style="border-top:4px solid ${color}">
        <div class="card-header">
          <span class="badge-ticker">${row.ticker}</span>
          <span class="tv-indicator">LIVE</span>
        </div>

        <div class="name-company">${row.nombre}</div>

        <div class="box-price" style="background:${color};color:white">
          ${row.cambio_pct > 0 ? "+" : ""}${row.cambio_pct}%
        </div>

        <div class="meta-info">
          <span>${row.pais}</span>
          <span>$${row.precio}</span>
        </div>
      </div>
    `;

    grid.appendChild(link);
  });
}

// ===============================
// RENDER STATS
// ===============================
function renderStats(data) {
  const stats = document.getElementById("stats");
  if (!stats) return;

  const avg =
    data.reduce((a, b) => a + b.cambio_pct, 0) / data.length;

  stats.innerHTML = `
    <div class="stat-box">
      <div class="item">
        <div class="label">Activos</div>
        <div class="value">${data.length}</div>
      </div>
      <div class="item">
        <div class="label">Promedio</div>
        <div class="value ${avg >= 0 ? "positive" : "negative"}">
          ${avg >= 0 ? "+" : ""}${avg.toFixed(2)}%
        </div>
      </div>
    </div>
  `;
}

// ===============================
// CARGA GENERAL
// ===============================
function loadDataAndRender() {
  const data = generarDatosMock();
  renderStats(data);
  renderGrid(data);
  updateTimestamp();
}

// ===============================
// AUTO UPDATE (CONTROLADO)
// ===============================
function startAutoUpdate() {
  if (autoTimer) return; 

  loadDataAndRender();
  autoTimer = setInterval(loadDataAndRender, UPDATE_INTERVAL);
}

function stopAutoUpdate() {
  clearInterval(autoTimer);
  autoTimer = null;
}

// ===============================
// BOTONES
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // Botón de refresco manual
  document
    .getElementById("btn-refresh")
    ?.addEventListener("click", loadDataAndRender);

  // Toggle de auto-actualización
  const btnAuto = document.getElementById("btn-toggle-auto");
  if (btnAuto) {
    btnAuto.addEventListener("click", () => {
      if (autoTimer) {
        stopAutoUpdate();
        btnAuto.textContent = "Auto: OFF";
      } else {
        startAutoUpdate();
        btnAuto.textContent = "Auto: ON";
      }
    });
  }

  // Render inicial sin auto
  loadDataAndRender();

  // Inicia reloj en vivo de la hora (HH:MM:SS)
  if (!clockTimer) {
    updateTimestamp();
    clockTimer = setInterval(updateTimestamp, CLOCK_INTERVAL);
  }
});
