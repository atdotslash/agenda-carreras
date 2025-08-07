
const sheetID = "1YGjPbjPf5jR_EXMGCMUn-n_TimPrCxjDXAWr8iAhwgY";
const sheetName = "Hoja1";
const apiKey = "AIzaSyAQVJ6bxEfixj00Y6k5H7xQpqVHs5VzFVc";
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?key=${apiKey}`;

const hoy = new Date();
const hoyISO = hoy.toISOString().split("T")[0];

document.getElementById("fecha-hoy").textContent = hoy.toLocaleDateString("es-AR", {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

fetch(url)
  .then(res => res.json())
  .then(data => {
    if (!data.values || !Array.isArray(data.values)) throw new Error("No se pudieron cargar los datos.");
    
    const headers = data.values[0];
    const rows = data.values.slice(1).map(row => Object.fromEntries(headers.map((h, i) => [h, row[i]])));
    
    const agendaHoy = rows.filter(row => row.fecha === hoyISO);
    const agendaContainer = document.getElementById("agenda-hoy");
    const proximaContainer = document.getElementById("proxima-clase");

    if (agendaHoy.length === 0) {
      agendaContainer.innerHTML = "<p>No hay clases programadas para hoy.</p>";
    } else {
      agendaHoy.forEach(row => agendaContainer.appendChild(crearCard(row)));
    }

    // Buscar próxima clase futura
    const ahora = new Date();
    const proximas = rows
      .filter(row => row.fecha && row.hora && new Date(`${row.fecha}T${row.hora}`) > ahora)
      .sort((a, b) => new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`));

    // Excluir clases que ya se están mostrando hoy
    const idsHoy = agendaHoy.map(r => r.materia + r.hora);
    const siguiente = proximas.find(r => !idsHoy.includes(r.materia + r.hora));

    if (siguiente) proximaContainer.appendChild(crearCard(siguiente));
    else proximaContainer.innerHTML = "<p>No hay próximas clases programadas.</p>";
  })
  .catch(err => {
    document.getElementById("agenda-hoy").innerHTML = "<p>Error al cargar los datos.</p>";
    console.error(err);
  });

function crearCard(row) {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="card-body">
      <h5 class="card-title">📘 ${row.materia}</h5>
      <p class="card-text">🕐 ${row.hora || "Sin hora"}<br/>
      🏫 ${row.institucion || "Sin institución"}<br/>
      📌 ${row.modalidad || "Sin modalidad"}<br/>
      🔗 <a href="${row.enlace || "#"}" target="_blank">Ir a la clase</a></p>
    </div>
  `;
  return card;
}
