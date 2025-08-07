const ID_HOJA = "1YGjPbjPf5jR_EXMGCMUn-n_TimPrCxjDXAWr8iAhwgY";
const NOMBRE_HOJA = "Hoja1";
const API_KEY = "AIzaSyAQVJ6bxEfixj00Y6k5H7xQpqVHs5VzFVc";

const URL = `https://sheets.googleapis.com/v4/spreadsheets/${ID_HOJA}/values/${NOMBRE_HOJA}?alt=json&key=${API_KEY}`;

const agendaHoy = document.getElementById("agenda-hoy");
const spanFechaHoy = document.getElementById("fecha-hoy");

const diaSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const mesNombre = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const hoy = new Date();
const fechaHoyISO = hoy.toISOString().split("T")[0];
spanFechaHoy.textContent = `${diaSemana[hoy.getDay()]}, ${hoy.getDate()} de ${mesNombre[hoy.getMonth()]} de ${hoy.getFullYear()}`;

fetch(URL)
  .then((res) => res.json())
  .then((data) => {
    if (!data.values || !Array.isArray(data.values)) {
      agendaHoy.innerHTML = "<p>Error al cargar los datos.</p>";
      return;
    }

    const filas = data.values.slice(1);
    const eventosHoy = filas.filter(f => f[0] === fechaHoyISO);

    if (eventosHoy.length === 0) {
      agendaHoy.innerHTML = "<p>No hay clases programadas para hoy.</p>";
    } else {
      const htmlEventos = eventosHoy.map(fila => `
        <div class="evento">
          <h3><i class="fa-solid fa-book"></i> ${fila[1]}</h3>
          <p><i class="fa-regular fa-clock"></i> ${fila[2]}</p>
          <p><i class="fa-solid fa-school"></i> ${fila[3]}</p>
          <p><i class="fa-solid fa-thumbtack"></i> ${fila[4]}</p>
          ${fila[5] ? `<p><i class="fa-solid fa-link"></i> <a href="${fila[5]}" target="_blank">Ir a la clase</a></p>` : ""}
        </div>
      `).join("");
      agendaHoy.innerHTML = htmlEventos;
    }
  })
  .catch(err => {
    console.error(err);
    agendaHoy.innerHTML = "<p>Error al cargar los datos.</p>";
  });
