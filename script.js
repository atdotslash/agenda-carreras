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

function obtenerColorCarrera(carrera) {
  switch ((carrera || "").trim()) {
    case "Profesor de Educación Secundaria Técnica en Electromecánica":
      return "#1e3a8a"; // azul
    case "Técnico Universitario en Desarrollo Web":
      return "#047857"; // verde
    case "Técnico Superior en Ciencia de Datos e Inteligencia Artificial":
      return "#b91c1c"; // rojo
    default:
      return "#333333";
  }
}

fetch(URL)
  .then((res) => res.json())
  .then((data) => {
    if (!data.values || !Array.isArray(data.values) || data.values.length < 2) {
      agendaHoy.innerHTML = "<p>Error al cargar los datos.</p>";
      return;
    }

    const encabezados = data.values[0].map(h => (h || "").trim().toUpperCase());
    const filas = data.values.slice(1);

    const idxFecha = encabezados.indexOf("FECHA");
    const idxTitulo = encabezados.indexOf("TITULO");
    const idxHora = encabezados.indexOf("HORA");
    const idxLugar = encabezados.indexOf("LUGAR");
    const idxDetalle = encabezados.indexOf("DETALLE");
    const idxLink = encabezados.indexOf("LINK");
    const idxCarrera = encabezados.indexOf("CARRERA");

    if (idxFecha === -1) {
      agendaHoy.innerHTML = "<p>No se encontró la columna FECHA en la hoja.</p>";
      return;
    }

    const eventosHoy = filas.filter(fila => (fila[idxFecha] || "").trim() === fechaHoyISO);

    if (eventosHoy.length === 0) {
      agendaHoy.innerHTML = "<p>No hay clases programadas para hoy.</p>";
    } else {
      const htmlEventos = eventosHoy.map(fila => {
        const titulo = idxTitulo !== -1 ? (fila[idxTitulo] || "") : "";
        const hora = idxHora !== -1 ? (fila[idxHora] || "") : "";
        const lugar = idxLugar !== -1 ? (fila[idxLugar] || "") : "";
        const detalle = idxDetalle !== -1 ? (fila[idxDetalle] || "") : "";
        const link = idxLink !== -1 ? (fila[idxLink] || "") : "";
        const carrera = idxCarrera !== -1 ? (fila[idxCarrera] || "") : "";

        const colorCarrera = obtenerColorCarrera(carrera);

        return `
          <div class="evento">
            ${carrera ? `<div style="font-weight: 700; color: ${colorCarrera}; margin-bottom: 8px;">${carrera}</div>` : ""}
            <h3><i class="fa-solid fa-book"></i> ${titulo}</h3>
            ${hora ? `<p><i class="fa-regular fa-clock"></i> ${hora}</p>` : ""}
            ${lugar ? `<p><i class="fa-solid fa-school"></i> ${lugar}</p>` : ""}
            ${detalle ? `<p><i class="fa-solid fa-thumbtack"></i> ${detalle}</p>` : ""}
            ${link ? `<p><i class="fa-solid fa-link"></i> <a href="${link}" target="_blank">Ir a la clase</a></p>` : ""}
          </div>
        `;
      }).join("");

      agendaHoy.innerHTML = htmlEventos;
    }
  })
  .catch((err) => {
    console.error(err);
    agendaHoy.innerHTML = "<p>Error al cargar los datos.</p>";
  });
