export const IVA = 0.16;

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const telRegex = /^[\d\s+\-()]{7,20}$/;

export function formatearPrecio(numero) {
  return "$" + numero.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function guardarLS(clave, datos) {
  localStorage.setItem(clave, JSON.stringify(datos));
}

export function obtenerLS(clave) {
  const dato = localStorage.getItem(clave);
  return dato ? JSON.parse(dato) : null;
}

export function mostrarNotificacion(mensaje) {
  let aviso = document.getElementById("notificacion");
  if (!aviso) {
    aviso = document.createElement("div");
    aviso.id = "notificacion";
    aviso.setAttribute("role", "alert");
    document.body.appendChild(aviso);
  }
  aviso.textContent = mensaje;
  aviso.classList.add("visible");
  setTimeout(function () {
    aviso.classList.remove("visible");
  }, 3000);
}

export class Producto {
  constructor(id, nombre, precio, categoria, marca, imagen, disponible) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.marca = marca;
    this.imagen = imagen;
    this.disponible = disponible;
  }
}

export class Cliente {
  constructor(nombre, email, telefono) {
    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;
  }
}
