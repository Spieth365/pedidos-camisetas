const API_URL = "https://pedidos-camisetas.javigr77.workers.dev";

const precios = {
  "Fan Version": 11,
  "Women Version": 11,
  "Kid Kit": 13,
  "Player Version": 14,
  "Retro": 16
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

let carritoActual = [];

function contarParches(texto) {
  if (!texto) return 0;
  return texto
    .split(",")
    .map(p => p.trim())
    .filter(Boolean).length;
}

function actualizarTallas() {
  const tipo = document.getElementById("tipo").value;
  const selectTalla = document.getElementById("talla");
  const tallas = tallasPorTipo[tipo] || [];

  selectTalla.innerHTML = tallas
    .map((talla) => `<option value="${talla}">${talla}</option>`)
    .join("");
}

function actualizarCamposCondicionales() {
  const nombreNumero = document.getElementById("nombreNumero").checked;
  const patch = document.getElementById("patch").checked;

  document.getElementById("bloqueNombreNumero").classList.toggle("hidden", !nombreNumero);
  document.getElementById("bloqueParches").classList.toggle("hidden", !patch);

  if (!nombreNumero) {
    document.getElementById("personalizacion").value = "";
  }

  if (!patch) {
    document.getElementById("parchesTexto").value = "";
  }
}

function calcularPrecioCamiseta() {
  const tipo = document.getElementById("tipo").value;
  const cantidad = parseInt(document.getElementById("cantidad").value || "1", 10);
  const nombreNumero = document.getElementById("nombreNumero").checked;
  const patch = document.getElementById("patch").checked;
  const parchesTexto = document.getElementById("parchesTexto").value.trim();

  let precioUnitario = precios[tipo] || 0;

  if (nombreNumero) precioUnitario += 2;

  if (patch) {
    const numeroParches = contarParches(parchesTexto);
    precioUnitario += numeroParches > 0 ? numeroParches : 1;
  }

  return precioUnitario * cantidad;
}

function actualizarPreview() {
  document.getElementById("precioPreview").textContent = calcularPrecioCamiseta() + "€";
}

function obtenerCamisetaFormulario() {
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    urlProducto: document.getElementById("urlProducto").value.trim(),
    equipo: document.getElementById("equipo").value,
    equipacion: document.getElementById("equipacion").value,
    tipo: document.getElementById("tipo").value,
    talla: document.getElementById("talla").value,
    cantidad: parseInt(document.getElementById("cantidad").value || "1", 10),
    personalizacion: document.getElementById("personalizacion").value.trim(),
    nombreNumero: document.getElementById("nombreNumero").checked,
    patch: document.getElementById("patch").checked,
    parchesTexto: document.getElementById("parchesTexto").value.trim(),
    observaciones: document.getElementById("observaciones").value.trim(),
    precio: calcularPrecioCamiseta()
  };
}

function limpiarFormularioCamiseta() {
  document.getElementById("urlProducto").value = "";
  document.getElementById("equipo").value = "Real Madrid";
  document.getElementById("equipacion").value = "1ª equipación";
  document.getElementById("tipo").value = "Fan Version";
  actualizarTallas();
  document.getElementById("cantidad").value = 1;
  document.getElementById("personalizacion").value = "";
  document.getElementById("nombreNumero").checked = false;
  document.getElementById("patch").checked = false;
  document.getElementById("parchesTexto").value = "";
  document.getElementById("observaciones").value = "";
  actualizarCamposCondicionales();
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

      <div class="pedido-extra"><strong>URL del producto:</strong> ${item.urlProducto ? `<a href="${escapeAttribute(item.urlProducto)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.urlProducto)}</a>` : "—"}</div>
      <div class="pedido-extra"><strong>Name and number:</strong> ${item.nombreNumero ? (item.personalizacion ? escapeHtml(item.personalizacion) : "Sí") : "No"}</div>
      <div class="pedido-extra"><strong>Parches:</strong> ${item.patch ? (item.parchesTexto ? `${escapeHtml(item.parchesTexto)} (${contarParches(item.parchesTexto)} parche(s))` : "1 parche") : "No"}</div>
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

async function enviarPedidoCompleto() {
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

  try {
    for (const item of carritoActual) {
      const observacionesCompletas = [
        item.observaciones,
        item.parchesTexto ? `Parches: ${item.parchesTexto}` : "",
        item.urlProducto ? `URL producto: ${item.urlProducto}` : ""
      ].filter(Boolean).join(" | ");

      const res = await fetch(`${API_URL}/api/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          contacto,
          equipo: item.equipo,
          equipacion: item.equipacion,
          tipo: item.tipo,
          talla: item.talla,
          cantidad: item.cantidad,
          personalizacion: item.personalizacion,
          nombreNumero: item.nombreNumero,
          patch: item.patch,
          observaciones: observacionesCompletas,
          pagado: false,
          precioTotal: item.precio
        })
      });

      if (!res.ok) {
        throw new Error("No se pudo guardar una de las camisetas");
      }
    }

    alert("Pedido guardado correctamente.");
    carritoActual = [];
    renderCarritoActual();
    document.getElementById("nombreCliente").value = "";
    document.getElementById("contactoCliente").value = "";
  } catch (error) {
    console.error(error);
    alert("Error al guardar el pedido.");
  }
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
    "URL producto",
    "Equipo",
    "Equipación",
    "Tipo",
    "Talla",
    "Cantidad",
    "Name and number",
    "Texto personalización",
    "Patch",
    "Parches elegidos",
    "Número de parches",
    "Observaciones",
    "Precio"
  ];

  const filas = carritoActual.map((item) => [
    nombre,
    contacto,
    item.urlProducto,
    item.equipo,
    item.equipacion,
    item.tipo,
    item.talla,
    item.cantidad,
    item.nombreNumero ? "Sí" : "No",
    item.personalizacion,
    item.patch ? "Sí" : "No",
    item.parchesTexto,
    item.patch ? (contarParches(item.parchesTexto) || 1) : 0,
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
  ["tipo", "cantidad", "parchesTexto"].forEach((id) => {
    const elemento = document.getElementById(id);
    elemento.addEventListener("change", () => {
      if (id === "tipo") actualizarTallas();
      actualizarPreview();
    });
    elemento.addEventListener("input", actualizarPreview);
  });

  ["nombreNumero", "patch"].forEach((id) => {
    const elemento = document.getElementById(id);
    elemento.addEventListener("change", () => {
      actualizarCamposCondicionales();
      actualizarPreview();
    });
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

function escapeAttribute(texto) {
  return String(texto ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function iniciarApp() {
  actualizarTallas();
  actualizarCamposCondicionales();
  activarEventosFormulario();
  activarTabsGuia();
  mostrarGuia("fan");
  renderCarritoActual();
  actualizarPreview();
}

document.addEventListener("DOMContentLoaded", iniciarApp);
