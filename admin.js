const STORAGE_KEY = "pedidosCamisetasV2";

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

function actualizarStats(lista = pedidos) {
  const totalPedidos = lista.length;
  const totalCamisetas = lista.reduce(
    (acc, pedido) => acc + pedido.items.reduce((sum, item) => sum + item.cantidad, 0),
    0
  );
  const importe = lista.reduce((acc, pedido) => acc + pedido.total, 0);
  const pagados = lista.filter((pedido) => pedido.pagado).length;

  document.getElementById("statPedidos").textContent = totalPedidos;
  document.getElementById("statCamisetas").textContent = totalCamisetas;
  document.getElementById("statImporte").textContent = importe + "€";
  document.getElementById("statPagados").textContent = pagados;
}

function renderAdmin(lista = pedidos) {
  const contenedor = document.getElementById("listaAdmin");

  if (lista.length === 0) {
    contenedor.innerHTML = `<div class="empty">No hay pedidos guardados.</div>`;
    actualizarStats(lista);
    return;
  }

  contenedor.innerHTML = lista.map((pedido) => `
    <article class="pedido">
      <div class="pedido-head">
        <div>
          <h3 style="margin:0 0 8px;">
            ${escapeHtml(pedido.nombre)}
            ${pedido.pagado ? '<span class="pill">Pagado</span>' : ''}
          </h3>
          <div style="color:#64748b;">
            ${escapeHtml(pedido.contacto)} · ${escapeHtml(pedido.fecha || "")}
          </div>
        </div>

        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button class="btn-success" data-toggle="${pedido.id}">
            ${pedido.pagado ? "Marcar pendiente" : "Marcar pagado"}
          </button>
          <button class="btn-danger" data-delete="${pedido.id}">Eliminar</button>
        </div>
      </div>

      <p style="margin:12px 0 0;"><strong>Total:</strong> ${pedido.total}€</p>

      <div class="table-wrap">
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

  contenedor.querySelectorAll("[data-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => togglePagado(Number(btn.dataset.toggle)));
  });

  contenedor.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => eliminarPedido(Number(btn.dataset.delete)));
  });

  actualizarStats(lista);
}

function togglePagado(id) {
  pedidos = pedidos.map((pedido) =>
    pedido.id === id ? { ...pedido, pagado: !pedido.pagado } : pedido
  );
  guardarPedidos();
  aplicarFiltro();
}

function eliminarPedido(id) {
  pedidos = pedidos.filter((pedido) => pedido.id !== id);
  guardarPedidos();
  aplicarFiltro();
}

function vaciarTodo() {
  const confirmado = confirm("¿Seguro que quieres borrar todos los pedidos?");
  if (!confirmado) return;

  pedidos = [];
  guardarPedidos();
  aplicarFiltro();
}

function descargarTodoCSV() {
  if (pedidos.length === 0) {
    alert("No hay pedidos para descargar.");
    return;
  }

  const cabeceras = [
    "Pedido ID",
    "Nombre",
    "Contacto",
    "Fecha",
    "Pagado",
    "Equipo",
    "Equipación",
    "Tipo",
    "Talla",
    "Cantidad",
    "Name and number",
    "Texto personalización",
    "Patch",
    "Observaciones",
    "Precio línea",
    "Total pedido"
  ];

  const filas = [];

  pedidos.forEach((pedido) => {
    pedido.items.forEach((item) => {
      filas.push([
        pedido.id,
        pedido.nombre,
        pedido.contacto,
        pedido.fecha || "",
        pedido.pagado ? "Sí" : "No",
        item.equipo,
        item.equipacion,
        item.tipo,
        item.talla,
        item.cantidad,
        item.nombreNumero ? "Sí" : "No",
        item.personalizacion || "",
        item.patch ? "Sí" : "No",
        item.observaciones || "",
        item.precio,
        pedido.total
      ]);
    });
  });

  const contenido = [cabeceras, ...filas]
    .map((fila) => fila.map((valor) => `"${String(valor ?? "").replace(/"/g, '""')}"`).join(";"))
    .join("\n");

  const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = "todos-los-pedidos.csv";
  enlace.click();
  URL.revokeObjectURL(url);
}

function aplicarFiltro() {
  const filtro = document.getElementById("filtroNombre").value.trim().toLowerCase();

  if (!filtro) {
    renderAdmin(pedidos);
    return;
  }

  const filtrados = pedidos.filter((pedido) =>
    pedido.nombre.toLowerCase().includes(filtro) ||
    pedido.contacto.toLowerCase().includes(filtro)
  );

  renderAdmin(filtrados);
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

function escapeHtml(texto) {
  return String(texto ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function iniciarAdmin() {
  renderAdmin();
  document.getElementById("btnDescargarExcel").addEventListener("click", descargarTodoCSV);
  document.getElementById("btnVaciarTodo").addEventListener("click", vaciarTodo);
  document.getElementById("filtroNombre").addEventListener("input", aplicarFiltro);
}

document.addEventListener("DOMContentLoaded", iniciarAdmin);
