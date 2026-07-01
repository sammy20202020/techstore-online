import { cargarProductos } from "./api.js";
import { obtenerCarrito } from "./carrito.js";
import { renderizarProductos, filtrarProductos } from "./productos.js";
import { validarFormularioContacto } from "./validaciones.js";
import { formatearPrecio, mostrarNotificacion } from "./utilidades.js";

let todosProductos = [];

document.addEventListener("DOMContentLoaded", async function () {
  try {
    todosProductos = await cargarProductos();
    initComun();
    initPorPagina();
  } catch (error) {
    console.error(error);
  }
});

function initComun() {
  actualizarContadorCarrito();
  initBusquedaHeader();

  const modal = document.getElementById("modal-oferta");
  if (modal && modal.hasAttribute("open")) {
    setTimeout(function () {
      modal.close();
    }, 5000);
  }

  const reloj = document.getElementById("reloj");
  if (reloj) {
    setInterval(function () {
      reloj.textContent = "Hora: " + new Date().toLocaleTimeString("es-MX");
    }, 1000);
  }
}

function initPorPagina() {
  const pagina = document.body.dataset.page || detectarPagina();

  if (pagina === "index") initIndex();
  if (pagina === "productos") initProductos();
  if (pagina === "carrito") initCarrito();
  if (pagina === "contacto") initContacto();
}

function detectarPagina() {
  const path = window.location.pathname;
  if (path.includes("productos")) return "productos";
  if (path.includes("carrito")) return "carrito";
  if (path.includes("contacto")) return "contacto";
  if (path.includes("index") || path.endsWith("/")) return "index";
  return "";
}

function initBusquedaHeader() {
  const forms = document.querySelectorAll('form[role="search"], header form');
  forms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const input = form.querySelector('input[type="search"]');
      const q = input ? input.value.trim() : "";
      window.location.href = "productos.html?q=" + encodeURIComponent(q);
    });
  });
}

function initIndex() {
  initDashboard();
  initBotonesDestacados();
}

function initDashboard() {
  const carrito = obtenerCarrito();
  const statCarrito = document.getElementById("stat-carrito");
  const statTotal = document.getElementById("stat-total");
  const statCategorias = document.getElementById("stat-categorias");
  const statCaro = document.getElementById("stat-caro");

  if (!statCarrito) return;

  statCarrito.textContent = carrito.cantidadItems();
  statTotal.textContent = formatearPrecio(carrito.calcularTotal());

  const categorias = [];
  for (const p of todosProductos) {
    if (!categorias.includes(p.categoria)) categorias.push(p.categoria);
  }
  statCategorias.textContent = categorias.length;

  let masCaro = null;
  for (const p of todosProductos) {
    if (!masCaro || p.precio > masCaro.precio) masCaro = p;
  }
  statCaro.textContent = masCaro
    ? masCaro.nombre + " (" + formatearPrecio(masCaro.precio) + ")"
    : "-";
}

function initBotonesDestacados() {
  const botones = document.querySelectorAll("#destacados button[data-id]");
  botones.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const id = parseInt(btn.dataset.id, 10);
      const producto = todosProductos.find(function (p) {
        return p.id === id;
      });
      if (producto && obtenerCarrito().agregar(producto)) {
        mostrarNotificacion(producto.nombre + " agregado al carrito");
        actualizarContadorCarrito();
        initDashboard();
      }
    });
    btn.addEventListener("mouseover", function () {
      btn.style.cursor = "pointer";
    });
    btn.addEventListener("mouseout", function () {
      btn.style.cursor = "";
    });
  });
}




function initProductos() {
  const contenedor = document.getElementById("lista-productos");
  const formFiltros = document.getElementById("form-filtros");
  const inputBusqueda = document.getElementById("q");

  if (!contenedor) return;

  const params = new URLSearchParams(window.location.search);
  const qInicial = params.get("q") || "";
  if (inputBusqueda && qInicial) inputBusqueda.value = qInicial;

  function aplicarFiltros() {
    const categorias = [];
    document
      .querySelectorAll('input[name="categoria"]:checked')
      .forEach(function (cb) {
        categorias.push(cb.value);
      });

    const filtros = {
      precioMin: parseFloat(document.getElementById("precio-min")?.value) || 0,
      precioMax:
        parseFloat(document.getElementById("precio-max")?.value) || Infinity,
      marca: document.getElementById("marca")?.value || "",
      categorias: categorias,
      soloDisponibles:
        document.getElementById("solo-disponibles")?.checked || false,
      busqueda: (inputBusqueda?.value || qInicial).trim(),
    };

    const filtrados = filtrarProductos(todosProductos, filtros);
    renderizarProductos(filtrados, contenedor);
    actualizarContadorCarrito();
  }

  aplicarFiltros();

  if (formFiltros) {
    formFiltros.addEventListener("submit", function (e) {
      e.preventDefault();
      aplicarFiltros();
    });
    formFiltros.addEventListener("change", aplicarFiltros);
    formFiltros.addEventListener("reset", function () {
      setTimeout(aplicarFiltros, 0);
    });
  }

  if (inputBusqueda) {
    inputBusqueda.addEventListener("input", aplicarFiltros);
  }
}

function initCarrito() {
  const carrito = obtenerCarrito();
  const tbody = document.getElementById("carrito-body");
  const caption = document.getElementById("carrito-caption");
  const subtotalEl = document.getElementById("subtotal");
  const ivaEl = document.getElementById("iva");
  const totalEl = document.getElementById("total");
  const btnVaciar = document.getElementById("btn-vaciar");
  const btnFinalizar = document.getElementById("btn-finalizar");
  const dialogCompra = document.getElementById("dialog-compra");

  function renderCarrito() {
    if (!tbody) return;
    tbody.innerHTML = "";

    if (carrito.items.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">Tu carrito está vacío.</td></tr>';
    } else {
      carrito.items.forEach(function (item) {
        const tr = document.createElement("tr");
        const sub = item.precio * item.cantidad;
        tr.innerHTML =
          '<td><img src="' +
          item.imagen +
          '" alt="' +
          item.nombre +
          '" width="80" height="60"></td>' +
          "<td><strong>" +
          item.nombre +
          "</strong></td>" +
          "<td>" +
          formatearPrecio(item.precio) +
          "</td>" +
          '<td><input type="number" min="1" max="99" value="' +
          item.cantidad +
          '" data-id="' +
          item.id +
          '" aria-label="Cantidad"></td>' +
          "<td>" +
          formatearPrecio(sub) +
          "</td>" +
          '<td><button type="button" data-eliminar="' +
          item.id +
          '">Eliminar</button></td>';
        tbody.appendChild(tr);
      });
    }

    if (caption)
      caption.textContent =
        carrito.cantidadItems() + " productos en el carrito";
    if (subtotalEl)
      subtotalEl.textContent = formatearPrecio(carrito.calcularSubtotal());
    if (ivaEl) ivaEl.textContent = formatearPrecio(carrito.calcularIVA());
    if (totalEl) totalEl.textContent = formatearPrecio(carrito.calcularTotal());

    actualizarContadorCarrito();
  }

  renderCarrito();

  if (tbody) {
    tbody.addEventListener("click", function (e) {
      if (e.target.dataset.eliminar) {
        carrito.eliminar(parseInt(e.target.dataset.eliminar, 10));
        renderCarrito();
        mostrarNotificacion("Producto eliminado");
      }
    });

    tbody.addEventListener("change", function (e) {
      if (e.target.type === "number" && e.target.dataset.id) {
        carrito.actualizarCantidad(
          parseInt(e.target.dataset.id, 10),
          parseInt(e.target.value, 10),
        );
        renderCarrito();
      }
    });
  }

  if (btnVaciar) {
    btnVaciar.addEventListener("click", function () {
      carrito.vaciar();
      renderCarrito();
      mostrarNotificacion("Carrito vaciado");
    });
  }

  if (btnFinalizar) {
    btnFinalizar.addEventListener("click", function () {
      if (carrito.items.length === 0) {
        mostrarNotificacion("Agrega productos antes de comprar");
        return;
      }
      const orden = "ORD-" + String(Math.floor(Math.random() * 9000) + 1000);
      if (dialogCompra) {
        document.getElementById("orden-numero").textContent = orden;
        dialogCompra.showModal();
      } else {
        alert("Compra realizada exitosamente.\nNúmero de orden: " + orden);
      }
      carrito.vaciar();
      renderCarrito();
    });
  }
}

function initContacto() {
  const form = document.getElementById("form-contacto");
  const msgDiv = document.getElementById("mensajes-formulario");
  const presupuesto = document.getElementById("presupuesto");
  const presupuestoValor = document.getElementById("presupuesto-valor");

  if (presupuesto && presupuestoValor) {
    presupuesto.addEventListener("input", function () {
      presupuestoValor.textContent = presupuesto.value;
    });
  }

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const errores = validarFormularioContacto(form);

    if (msgDiv) {
      msgDiv.innerHTML = "";
      if (errores.length > 0) {
        msgDiv.innerHTML =
          "<ul>" +
          errores
            .map(function (err) {
              return "<li>" + err + "</li>";
            })
            .join("") +
          "</ul>";
        msgDiv.className = "error";
        return;
      }
      msgDiv.textContent =
        "Formulario enviado correctamente. Te contactaremos pronto.";
      msgDiv.className = "exito";
    }
  });
}

function actualizarContadorCarrito() {
  const badge = document.getElementById("contador-carrito");
  if (badge) {
    badge.textContent = obtenerCarrito().cantidadItems();
  }
}
