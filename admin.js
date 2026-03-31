const API_URL = "https://pedidos-camisetas.javigr77.workers.dev";

let pedidos = [];

async function cargarPedidos() {
  const res = await fetch(`${API_URL}/api/pedidos`);
  if (!res.ok) {
    throw new Error("No se pudieron cargar los pedidos");
  }
  pedidos = await res.json();
  return pedidos;
}

function actualizarStats(lista = pedidos) {
  const totalPedidos = lista.length;
  const totalCamisetas = lista.reduce((acc, pedido) => acc + Number(pedido.cantidad || 0), 0);
  const importe = lista.reduce((acc, pedido) => acc + Number(pedido.precio_total || 0), 0);
  const pagados = lista.filter((pedido) => Number(pedido.pagado) === 1).length;

  document.getElementById("statPedidos").textContent = totalPedidos;
  document.getElementById("statCamisetas").textContent = totalCamisetas;
  document.getElementById("statImporte").textContent = importe + "€";
  document.getElementById("statPagados").textContent = pagados;
}

function agruparPedidos(lista) {
  const grupos = new Map();

  for (const item of lista) {
    const key = `${item.nombre}__${item.contacto}__${item.created_at}`;
    if (!grupos.has(key)) {
      grupos.set(key, {
        idVisual: key,
        nombre: item.nombre,
        contacto: item.contacto,
        created_at: item.created_at,
        pagado: Number(item.pagado) === 1,
        total: 0,
        items: []
      });
    }

    const grupo = grupos.get(key);
    grupo.total += Number(item.precio_total || 0);
    grupo.items.push(item);
  }

  return Array.from(grupos.values()).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function renderAdmin(lista = pedidos) {
  const contenedor = document.getElementById("listaAdmin");
  const grupos = agruparPedidos(lista);

  if (grupos.length === 0) {
    contenedor.innerHTML = `<div class="empty">No hay pedidos guardados.</div>`;
    actualizarStats(lista);
    return;
  }

  contenedor.innerHTML = grupos.map((pedido) => `
    <article class="pedido">
      <div class="pedido-head">
        <div>
          <h3 style="margin:0 0 8px;">
            ${escapeHtml(pedido.nombre)}
            ${pedido.pagado ? '<span class="pill">Pagado</span>' : ''}
          </h3>
          <div style="color:#64748b;">
            ${escapeHtml(pedido.contacto)} · ${escapeHtml(formatearFecha(pedido.created_at))}
          </div>
        </div>
        <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
          <strong>${pedido.total.toFixed(2)}€</strong>
          <button class="btn-danger" data-delete-group="${pedido.idVisual}">Eliminar pedido completo</button>
        </div>
      </div>

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
              <th>Observaciones</th>
              <th>Precio</th>
              <th>Acciones</th>
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
                <td>${item.observaciones ? escapeHtml(item.observaciones) : "—"}</td>
                <td>${Number(item.precio_total).toFixed(2)}€</td>
                <td style="display:flex;gap:8px;flex-wrap:wrap;">
                  <button class="btn-success" data-toggle="${item.id}">
                    ${Number(item.pagado) === 1 ? "Pendiente" : "Pagado"}
                  </button>
                  <button class="btn-danger" data-delete="${item.id}">Eliminar línea</button>
                </td>
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
    btn.addEventListener("click", () => eliminarLinea(Number(btn.dataset.delete)));
  });

  contenedor.querySelectorAll("[data-delete-group]").forEach((btn) => {
    btn.addEventListener("click", () => eliminarGrupo(btn.dataset.deleteGroup));
  });

  actualizarStats(lista);
}

async function togglePagado(id) {
  try {
    const res = await fetch(`${API_URL}/api/toggle-pagado/${id}`, {
      method: "POST"
    });

    if (!res.ok) {
      const texto = await res.text();
      alert(`No se pudo cambiar el estado.\n${texto}`);
      return;
    }

    await recargar();
  } catch (error) {
    console.error(error);
    alert("Error de conexión al cambiar el estado.");
  }
}

async function eliminarLinea(id) {
  const confirmar = confirm("¿Seguro que quieres eliminar esta línea?");
  if (!confirmar) return;

  try {
    const res = await fetch(`${API_URL}/api/pedidos/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      const texto = await res.text();
      alert(`No se pudo eliminar la línea.\n${texto}`);
      return;
    }

    await recargar();
  } catch (error) {
    console.error(error);
    alert("Error de conexión al eliminar la línea.");
  }
}

async function eliminarGrupo(idVisual) {
  const confirmar = confirm("¿Seguro que quieres eliminar el pedido completo?");
  if (!confirmar) return;

  const grupo = agruparPedidos(pedidos).find((g) => g.idVisual === idVisual);
  if (!grupo) return;

  try {
    for (const item of grupo.items) {
      const res = await fetch(`${API_URL}/api/pedidos/${item.id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        const texto = await res.text();
        alert(`No se pudo eliminar una de las líneas del pedido.\n${texto}`);
        return;
      }
    }

    await recargar();
  } catch (error) {
    console.error(error);
    alert("Error de conexión al eliminar el pedido completo.");
  }
}

function descargarTodoCSV() {
  if (!pedidos.length) {
    alert("No hay pedidos para descargar.");
    return;
  }

  const cabeceras = [
    "ID",
    "Fecha",
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

  const filas = pedidos.map((item) => [
    item.id,
    item.created_at,
    item.nombre,
    item.contacto,
    item.equipo,
    item.equipacion,
    item.tipo,
    item.talla,
    item.cantidad,
    Number(item.nombre_numero) === 1 ? "Sí" : "No",
    item.personalizacion || "",
    Number(item.patch) === 1 ? "Sí" : "No",
    item.observaciones || "",
    Number(item.pagado) === 1 ? "Sí" : "No",
    item.precio_total
  ]);

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

  const filtrados = pedidos.filter((item) =>
    String(item.nombre).toLowerCase().includes(filtro) ||
    String(item.contacto).toLowerCase().includes(filtro)
  );

  renderAdmin(filtrados);
}

function formatearExtras(item) {
  const extras = [];
  if (Number(item.nombre_numero) === 1) {
    extras.push(item.personalizacion ? `Name and number (${escapeHtml(item.personalizacion)})` : "Name and number");
  }
  if (Number(item.patch) === 1) extras.push("Patch");
  if (!extras.length) return "—";
  return extras.join(" · ");
}

function formatearFecha(texto) {
  try {
    return new Date(texto).toLocaleString("es-ES");
  } catch {
    return texto || "";
  }
}

function escapeHtml(texto) {
  return String(texto ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function recargar() {
  try {
    await cargarPedidos();
    aplicarFiltro();
  } catch (error) {
    console.error(error);
    document.getElementById("listaAdmin").innerHTML = `<div class="empty">Error al cargar pedidos.</div>`;
  }
}

function iniciarAdmin() {
  document.getElementById("btnDescargarExcel").addEventListener("click", descargarTodoCSV);
  document.getElementById("btnRecargar").addEventListener("click", recargar);
  document.getElementById("filtroNombre").addEventListener("input", aplicarFiltro);
  recargar();
}

document.addEventListener("DOMContentLoaded", iniciarAdmin);
