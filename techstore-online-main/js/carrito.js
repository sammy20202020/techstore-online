import { guardarLS, obtenerLS, IVA } from "./utilidades.js";

const CLAVE_CARRITO = "techstore_carrito";

export class Carrito {
  constructor() {
    this.items = obtenerLS(CLAVE_CARRITO) || [];
  }

  agregar(producto) {
    if (!producto.disponible) return false;
    const existente = this.items.find(function (item) {
      return item.id === producto.id;
    });
    if (existente) {
      existente.cantidad += 1;
    } else {
      this.items.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: 1
      });
    }
    this.guardar();
    return true;
  }

  eliminar(id) {
    this.items = this.items.filter(function (item) {
      return item.id !== id;
    });
    this.guardar();
  }

  vaciar() {
    this.items = [];
    this.guardar();
  }

  actualizarCantidad(id, cantidad) {
    const item = this.items.find(function (i) {
      return i.id === id;
    });
    if (item) {
      item.cantidad = cantidad > 0 ? cantidad : 1;
      this.guardar();
    }
  }

  calcularSubtotal() {
    return this.items.reduce(function (suma, item) {
      return suma + item.precio * item.cantidad;
    }, 0);
  }

  calcularIVA() {
    return this.calcularSubtotal() * IVA;
  }

  calcularTotal() {
    return this.calcularSubtotal() + this.calcularIVA();
  }

  cantidadItems() {
    return this.items.reduce(function (suma, item) {
      return suma + item.cantidad;
    }, 0);
  }

  guardar() {
    guardarLS(CLAVE_CARRITO, this.items);
  }
}

let instancia = null;

export function obtenerCarrito() {
  if (!instancia) instancia = new Carrito();
  return instancia;
}
