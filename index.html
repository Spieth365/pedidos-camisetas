const STORAGE_KEY = "pedidosCamisetas";

const precios = {
  "Fan Version": 11,
  "Women Version": 11,
  "Kid Kit": 13,
  "Player Version": 14,
  "Retro": 16
};

const guias = {
  fan: {
    columnas: ["Talla", "Largo", "Ancho", "Altura", "Peso"],
    filas: [
      ["S", "69-71", "53-55", "162-170", "50-62"],
      ["M", "71-73", "55-57", "170-176", "62-78"],
      ["L", "73-75", "57-58", "176-182", "78-83"],
      ["XL", "75-78", "58-60", "182-190", "83-90"],
      ["XXL", "78-81", "60-62", "190-195", "90-97"],
      ["XXXL", "81-83", "62-64", "192-197", "97-104"]
    ]
  },
  player: {
    columnas: ["Talla", "Largo", "Ancho", "Altura", "Peso"],
    filas: [
      ["S", "69", "49-51", "162-170", "50-62"],
      ["M", "69-71", "51-53", "170-176", "62-78"],
      ["L", "71-73", "53-55", "176-182", "78-83"],
      ["XL", "73-75", "55-57", "182-190", "83-90"],
      ["XXL", "75-77", "57-59", "190-195", "90-97"]
    ]
  },
  women: {
    columnas: ["Talla", "Largo", "Ancho", "Altura"],
    filas: [
      ["S", "61-63", "40-41", "150-160"],
      ["M", "63-66", "41-44", "160-165"],
      ["L", "66-69", "44-47", "165-170"],
      ["XL", "69-71", "47-50", "170-175"]
    ]
  },
  kids: {
    columnas: ["Talla", "Altura", "Edad", "Largo", "Ancho", "Cintura"],
    filas: [
      ["16", "95-105", "3-4", "44", "35", "20-37"],
      ["18", "105-115", "4-5", "47", "37", "21-39"],
      ["20", "115-125", "5-6", "50", "39", "22-41"],
      ["22", "125-135", "6-7", "53", "41", "23-42"],
      ["24", "135-145", "8-9", "56", "43", "24-44"],
      ["26", "145-155", "10-11", "59", "45", "25-47"],
      ["28", "155-165", "12-13", "62", "47", "26-50"]
    ]
  }
};

let pedidos = cargarPedidos();

function cargarPedidos() {
  try {
    const guardados = localStorage.getItem(STORAGE_KEY);
    return guardados ? JSON.parse(guardados) : [];
  } catch (error) {
    console.error("Error cargando pedidos:", error);
    return [];
  }
}

function guardarPedidos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pedidos));
}

function calcularPrecioActual() {
  const tipo = document.getElementById("tipo").value;
  const cantidad = parseInt(document.getElementById("cantidad").value || "1", 10);
  const nombreNumero = document.getElementById("nombreNumero").checked;
  const patch = document.getElementById("patch").checked;

  let precioUnitario = precios[tipo] || 0;

  if (nombreNumero) precioUnitario += 2;
  if (patch) precioUnitario += 1;

  return precioUnitario * cantidad;
}

function actualizarPreview() {
  document.getElementById("precioPreview").textContent = calcularPrecioActual() + "€";
}

function obtenerPedidoFormulario() {
  return {
    id: Date.now(),
    nombre: document.getElementById("nombre").value.trim(),
    contacto: document.getElementById("contacto").value.trim(),
    equipo: document.getElementById("equipo").value,
    equipacion: document.getElementById("equipacion").value,
    tipo: document.getElementById("tipo").value,
    talla: document.getElementById("talla").value,
    cantidad: parseInt(document.getElementById("cantidad").value || "1", 10),
    personalizacion: document.getElementById("personalizacion").value.trim(),
    nombreNumero: document.getElementById("nombreNumero").checked,
    patch: document.getElementById("patch").checked,
    observaciones: document.getElementById("observaciones").value.trim(),
    pagado: document.getElementById("pagado").checked,
    precio: calcularPrecioActual()
  };
}

function agregarPedido() {
  const pedido = obtenerPedidoFormulario();

  if (!pedido.nombre || !pedido.contacto) {
    alert("Rellena al menos nombre y contacto.");
    return;
  }

  pedidos.unshift(pedido);
  guardarPedidos();
  renderPedidos();
  actualizarTotales();
  limpiarFormulario();
}

function limpiarFormulario() {
  document.getElementById("nombre").value = "";
  document.getElementById("contacto").value = "";
  document.getElementById("equipo").value = "Real Madrid";
  document.getElementById("equipacion").value = "1ª equipación";
  document.getElementById("tipo").value = "Fan Version";
  document.getElementById("talla").value = "M";
  document.getElementById("cantidad").value = 1;
  document.getElementById("personalizacion").value = "";
  document.getElementById("nombreNumero").checked = false;
  document.getElementById("patch").checked = false;
  document.getElementById("observaciones").value = "";
  document.getElementById("pagado").checked = false;
  actualizarPreview();
}

function renderPedidos() {
  const lista = document.getElementById("listaPedidos");

  if (pedidos.length === 0) {
    lista.innerHTML = '<p class="muted">Todavía no hay pedidos añadidos.</p>';
    return;
  }

  lista.innerHTML = pedidos.map((p) => `
    <div class="pedido-item">
      <h4>
        ${escapeHtml(p.nombre)}
        ${p.pagado ? '<span class="pill">Pagado</span>' : ""}
      </h4>
      <div class="muted">${escapeHtml(p.contacto)}</div>
      <p><strong>Equipo:</strong> ${escapeHtml(p.equipo)} | <strong>Equipación:</strong> ${escapeHtml(p.equipacion)}</p>
      <p><strong>Tipo:</strong> ${escapeHtml(p.tipo)} | <strong>Talla:</strong> ${escapeHtml(p.talla)} | <strong>Cantidad:</strong> ${p.cantidad}</p>
      <p><strong>Name and number:</strong> ${p.nombreNumero ? "Sí" : "No"}${p.personalizacion ? " - " + escapeHtml(p.personalizacion) : ""}</p>
      <p><strong>Patch:</strong> ${p.patch ? "Sí" : "No"}</p>
      <p><strong>Observaciones:</strong> ${p.observaciones ? escapeHtml(p.observaciones) : "—"}</p>
      <p><strong>Total:</strong> ${p.precio}€</p>
      <button type="button" class="btn-secondary" data-id="${p.id}">Eliminar</button>
    </div>
  `).join("");

  lista.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      eliminarPedido(Number(btn.dataset.id));
    });
  });
}

function eliminarPedido(id) {
  pedidos = pedidos.filter((p) => p.id !== id);
  guardarPedidos();
  renderPedidos();
  actualizarTotales();
}

function vaciarPedidos() {
  const confirmado = confirm("¿Seguro que quieres borrar todos los pedidos?");
  if (!confirmado) return;

  pedidos = [];
  guardarPedidos();
  renderPedidos();
  actualizarTotales();
}

function actualizarTotales() {
  const participantes = pedidos.length;
  const camisetas = pedidos.reduce((acc, p) => acc + p.cantidad, 0);
  const importe = pedidos.reduce((acc, p) => acc + p.precio, 0);
  const beneficio = pedidos.reduce((acc, p) => acc + p.cantidad, 0); // 1€ por camiseta

  document.getElementById("totalParticipantes").textContent = participantes;
  document.getElementById("totalCamisetas").textContent = camisetas;
  document.getElementById("importeTotal").textContent = importe + "€";
  document.getElementById("beneficioTotal").textContent = beneficio + "€";
}

function descargarCSV() {
  if (pedidos.length === 0) {
    alert("No hay pedidos para descargar.");
    return;
  }

  const cabeceras = [
    "Nombre",
    "Contacto",
    "Equipo",
    "Equipación",
    "Tipo",
    "Talla",
    "Cantidad",
    "Name and number",
    "Texto personalización",
    "Patch",
    "Observaciones",
    "Pagado",
    "Precio"
  ];

  const filas = pedidos.map((p) => [
    p.nombre,
    p.contacto,
    p.equipo,
    p.equipacion,
    p.tipo,
    p.talla,
    p.cantidad,
    p.nombreNumero ? "Sí" : "No",
    p.personalizacion,
    p.patch ? "Sí" : "No",
    p.observaciones,
    p.pagado ? "Sí" : "No",
    p.precio
  ]);

  const contenido = [cabeceras, ...filas]
    .map((fila) =>
      fila.map((valor) => `"${String(valor ?? "").replace(/"/g, '""')}"`).join(";")
    )
    .join("\n");

  const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = "pedidos-camisetas.csv";
  enlace.click();
  URL.revokeObjectURL(url);
}

function mostrarGuia(tipo) {
  const guia = guias[tipo];
  let html = "<table><thead><tr>";
  html += guia.columnas.map((c) => `<th>${c}</th>`).join("");
  html += "</tr></thead><tbody>";
  html += guia.filas.map((fila) => `<tr>${fila.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("");
  html += "</tbody></table>";

  document.getElementById("guiaTallas").innerHTML = html;
}

function activarTabsGuia() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      mostrarGuia(btn.dataset.guia);
    });
  });
}

function activarEventosFormulario() {
  ["tipo", "cantidad", "nombreNumero", "patch"].forEach((id) => {
    const elemento = document.getElementById(id);
    elemento.addEventListener("change", actualizarPreview);
    elemento.addEventListener("input", actualizarPreview);
  });

  document.getElementById("btnAgregar").addEventListener("click", agregarPedido);
  document.getElementById("btnDescargar").addEventListener("click", descargarCSV);
  document.getElementById("btnVaciar").addEventListener("click", vaciarPedidos);
}

function escapeHtml(texto) {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function iniciarApp() {
  activarEventosFormulario();
  activarTabsGuia();
  mostrarGuia("fan");
  renderPedidos();
  actualizarPreview();
  actualizarTotales();
}

document.addEventListener("DOMContentLoaded", iniciarApp);
