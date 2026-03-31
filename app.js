const STORAGE_KEY = "pedidosCamisetasV2";

const precios = {
  "Fan Version": 10,
  "Women Version": 10,
  "Kid Kit": 12,
  "Player Version": 13,
  "Retro": 15
};

const tallasPorTipo = {
  "Fan Version": ["S", "M", "L", "XL", "XXL", "XXXL"],
  "Player Version": ["S", "M", "L", "XL", "XXL"],
  "Women Version": ["S", "M", "L", "XL"],
  "Kid Kit": ["16", "18", "20", "22", "24", "26", "28"],
  "Retro": ["S", "M", "L", "XL", "XXL"]
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
let carritoActual = [];

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

function actualizarTallas() {
  const tipo = document.getElementById("tipo").value;
  const selectTalla = document.getElementById("talla");
  const tallas = tallasPorTipo[tipo] || [];

  selectTalla.innerHTML = tallas
    .map((talla) => `<option value="${talla}">${talla}</option>`)
    .join("");
}

function calcularPrecioCamiseta() {
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
  document.getElementById("precioPreview").textContent = calcularPrecioCamiseta() + "€";
}

function obtenerCamisetaFormulario() {
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    equipo: document.getElementById("equipo").value,
    equipacion: document.getElementById("equipacion").value,
    tipo: document.getElementById("tipo").value,
    talla: document.getElementById("talla").value,
    cantidad: parseInt(document.getElementById("cantidad").value || "1", 10),
    personalizacion: document.getElementById("personalizacion").value.trim(),
    nombreNumero: document.getElementById("nombreNumero").checked,
    patch: document.getElementById("patch").checked,
    observaciones: document.getElementById("observaciones").value.trim(),
    precio: calcularPrecioCamiseta()
  };
}

function limpiarFormularioCamiseta() {
  document.getElementById("equipo").value = "Real Madrid";
  document.getElementById("equipacion").value = "1ª equipación";
  document.getElementById("tipo").value = "Fan Version";
  actualizarTallas();
  document.getElementById("cantidad").value = 1;
  document.getElementById("personalizacion").value = "";
  document.getElementById("nombreNumero").checked = false;
  document.getElementById("patch").checked = false;
  document.getElementById("observaciones").value = "";
  actualizarPreview();
}

function agregarAlCarrito() {
  const camiseta = obtenerCamisetaFormulario();
  carritoActual.unshift(camiseta);
  renderCarritoActual();
  limpiarFormularioCamiseta();
}

function eliminarDelCarrito(id) {
  carritoActual = carritoActual.filter((item) => item.id !== id);
  renderCarritoActual();
}

function totalCarrito() {
  return carritoActual.reduce((acc, item) => acc + item.precio, 0);
}

function renderCarritoActual() {
  const contenedor = document.getElementById("carritoActual");

  if (carritoActual.length === 0) {
    contenedor.innerHTML = `<div class="empty">Todavía no has añadido camisetas a este pedido.</div>`;
    document.getElementById("totalCarrito").textContent = "0€";
    return;
  }

  contenedor.innerHTML = carritoActual.map((item) => `
    <article class="cart-item">
      <div class="item-head">
        <div>
          <h4>${escapeHtml(item.equipo)} · ${escapeHtml(item.tipo)}</h4>
          <div class="muted">${escapeHtml(item.equipacion)} · Talla ${escapeHtml(item.talla)} · Cantidad ${item.cantidad}</div>
        </div>
        <div><strong>${item.precio}€</strong></div>
      </div>

      <div class="pedido-extra"><strong>Name and number:</strong> ${item.nombreNumero ? "Sí" : "No"}${item.personalizacion ? " - " + escapeHtml(item.personalizacion) : ""}</div>
      <div class="pedido-extra"><strong>Patch:</strong> ${item.patch ? "Sí" : "No"}</div>
      <div class="pedido-extra"><strong>Observaciones:</strong> ${item.observaciones ? escapeHtml(item.observaciones) : "—"}</div>

      <div class="item-actions">
        <button type="button" class="btn-danger" data-remove-cart="${item.id}">Quitar</button>
      </div>
    </article>
  `).join("");

  contenedor.querySelectorAll("[data-remove-cart]").forEach((btn) => {
    btn.addEventListener("click", () => eliminarDelCarrito(Number(btn.dataset.removeCart)));
  });

  document.getElementById("totalCarrito").textContent = totalCarrito() + "€";
}

function enviarPedidoCompleto() {
  const nombre = document.getElementById("nombreCliente").value.trim();
  const contacto = document.getElementById("contactoCliente").value.trim();

  if (!nombre || !contacto) {
    alert("Rellena nombre y contacto.");
    return;
  }

  if (carritoActual.length === 0) {
    alert("Añade al menos una camiseta al pedido.");
    return;
  }

  const pedido = {
    id: Date.now(),
    nombre,
    contacto,
    pagado: false,
    fecha: new Date().toLocaleString("es-ES"),
    total: totalCarrito(),
    items: [...carritoActual]
  };

  pedidos.unshift(pedido);
  guardarPedidos();
  carritoActual = [];
  renderCarritoActual();
  renderPedidos();
  actualizarTotales();

  document.getElementById("nombreCliente").value = "";
  document.getElementById("contactoCliente").value = "";

  alert("Pedido guardado correctamente.");
}

function descargarMiPedido() {
  const nombre = document.getElementById("nombreCliente").value.trim();
  const contacto = document.getElementById("contactoCliente").value.trim();

  if (!nombre || !contacto) {
    alert("Rellena nombre y contacto para descargar tu pedido.");
    return;
  }

  if (carritoActual.length === 0) {
    alert("No hay camisetas en el pedido actual.");
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
    "Precio"
  ];

  const filas = carritoActual.map((item) => [
    nombre,
    contacto,
    item.equipo,
    item.equipacion,
    item.tipo,
    item.talla,
    item.cantidad,
    item.nombreNumero ? "Sí" : "No",
    item.personalizacion,
    item.patch ? "Sí" : "No",
    item.observaciones,
    item.precio
  ]);

  const contenido = [cabeceras, ...filas]
    .map((fila) => fila.map((valor) => `"${String(valor ?? "").replace(/"/g, '""')}"`).join(";"))
    .join("\n");

  const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = `pedido-${normalizarNombreArchivo(nombre)}.csv`;
  enlace.click();
  URL.revokeObjectURL(url);
}

function renderPedidos() {
  const lista = document.getElementById("listaPedidos");

  if (pedidos.length === 0) {
    lista.innerHTML = `<div class="empty">Todavía no hay pedidos enviados.</div>`;
    return;
  }

  lista.innerHTML = pedidos.map((pedido) => `
    <article class="pedido-item">
      <div class="item-head">
        <div>
          <h4>${escapeHtml(pedido.nombre)} ${pedido.pagado ? '<span class="pill">Pagado</span>' : ''}</h4>
          <div class="muted">${escapeHtml(pedido.contacto)} · ${escapeHtml(pedido.fecha || "")}</div>
        </div>
        <div><strong>${pedido.total}€</strong></div>
      </div>

      <div class="pedido-extra"><strong>Número de camisetas distintas:</strong> ${pedido.items.length}</div>

      <div class="table-wrap" style="margin-top:12px;">
        <table>
          <thead>
            <tr>
              <th>Equipo</th>
              <th>Equipación</th>
              <th>Tipo</th>
              <th>Talla</th>
              <th>Cantidad</th>
              <th>Extras</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            ${pedido.items.map((item) => `
              <tr>
                <td>${escapeHtml(item.equipo)}</td>
                <td>${escapeHtml(item.equipacion)}</td>
                <td>${escapeHtml(item.tipo)}</td>
                <td>${escapeHtml(item.talla)}</td>
                <td>${item.cantidad}</td>
                <td>${formatearExtras(item)}</td>
                <td>${item.precio}€</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </article>
  `).join("");
}

function formatearExtras(item) {
  const extras = [];
  if (item.nombreNumero) {
    extras.push(item.personalizacion ? `Name and number (${escapeHtml(item.personalizacion)})` : "Name and number");
  }
  if (item.patch) extras.push("Patch");
  if (extras.length === 0) return "—";
  return extras.join(" · ");
}

function actualizarTotales() {
  const totalPedidos = pedidos.length;
  const totalCamisetas = pedidos.reduce(
    (acc, pedido) => acc + pedido.items.reduce((sum, item) => sum + item.cantidad, 0),
    0
  );
  const importeTotal = pedidos.reduce((acc, pedido) => acc + pedido.total, 0);

  document.getElementById("totalPedidos").textContent = totalPedidos;
  document.getElementById("totalCamisetas").textContent = totalCamisetas;
  document.getElementById("importeTotal").textContent = importeTotal + "€";
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
    elemento.addEventListener("change", () => {
      if (id === "tipo") actualizarTallas();
      actualizarPreview();
    });
    elemento.addEventListener("input", actualizarPreview);
  });

  document.getElementById("btnAgregarAlCarrito").addEventListener("click", agregarAlCarrito);
  document.getElementById("btnLimpiarCamiseta").addEventListener("click", limpiarFormularioCamiseta);
  document.getElementById("btnEnviarPedido").addEventListener("click", enviarPedidoCompleto);
  document.getElementById("btnDescargarMiPedido").addEventListener("click", descargarMiPedido);
}

function normalizarNombreArchivo(texto) {
  return String(texto)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHtml(texto) {
  return String(texto ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function iniciarApp() {
  actualizarTallas();
  activarEventosFormulario();
  activarTabsGuia();
  mostrarGuia("fan");
  renderCarritoActual();
  renderPedidos();
  actualizarPreview();
  actualizarTotales();
}

document.addEventListener("DOMContentLoaded", iniciarApp);
