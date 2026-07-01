import { formatearPrecio, mostrarNotificacion } from "./utilidades.js";
import { obtenerCarrito } from "./carrito.js";

export function crearTarjeta(producto) {
  const article = document.createElement("article");
  const estado = producto.disponible ? "Disponible" : "Agotado";
  const oferta = producto.oferta ? "<mark>" + producto.oferta + "</mark> " : "";

  article.innerHTML =
    (producto.oferta ? "<p><strong>Oferta</strong></p>" : "") +
    '<img src="' + producto.imagen + '" alt="' + producto.nombre + '" width="400" height="300">' +
    "<h3>" + producto.nombre + "</h3>" +
    "<p>" + producto.categoria + " · " + producto.marca + "</p>" +
    "<p><strong>" + formatearPrecio(producto.precio) + "</strong> " + oferta + "— " + estado + "</p>" +
    '<p><a href="producto.html">Ver detalle</a> | ' +
    '<button type="button" data-id="' + producto.id + '"' +
    (producto.disponible ? "" : " disabled") + ">" +
    (producto.disponible ? "Comprar" : "Agotado") +
    "</button></p>";

  const btn = article.querySelector("button");
  if (btn && producto.disponible) {
    btn.addEventListener("click", function () {
      const carrito = obtenerCarrito();
      carrito.agregar(producto);
      mostrarNotificacion(producto.nombre + " agregado al carrito");
    });
  }

  return article;
}

export function renderizarProductos(lista, contenedor) {
  contenedor.innerHTML = "";
  if (lista.length === 0) {
    contenedor.innerHTML = "<p>No se encontraron productos.</p>";
    return;
  }
  for (const producto of lista) {
    contenedor.appendChild(crearTarjeta(producto));
  }
}

export function filtrarProductos(productos, filtros) {
  return productos.filter(function (p) {
    if (filtros.precioMin && p.precio < filtros.precioMin) return false;
    if (filtros.precioMax && p.precio > filtros.precioMax) return false;
    if (filtros.marca && p.marca !== filtros.marca) return false;
    if (filtros.categorias.length > 0 && !filtros.categorias.includes(p.categoria)) return false;
    if (filtros.soloDisponibles && !p.disponible) return false;
    if (filtros.busqueda) {
      const termino = filtros.busqueda.toLowerCase();
      const coincide =
        p.nombre.toLowerCase().includes(termino) ||
        p.categoria.toLowerCase().includes(termino) ||
        p.marca.toLowerCase().includes(termino);
      if (!coincide) return false;
    }
    return true;
  });
}
