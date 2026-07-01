import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { ItemCarrito } from '../models/item-carrito';
import { Producto } from '../models/producto';

const CLAVE_CARRITO = 'techstore_carrito';
const IVA = 0.16;

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private readonly itemsSubject = new BehaviorSubject<ItemCarrito[]>(this.cargarDesdeStorage());
  readonly items$ = this.itemsSubject.asObservable();

  readonly cantidadItems$ = this.items$.pipe(
    map((items) => items.reduce((suma, item) => suma + item.cantidad, 0))
  );

  readonly total$ = this.items$.pipe(map((items) => this.calcularTotalItems(items)));

  agregar(producto: Producto): boolean {
    if (!producto.disponible) return false;

    const items = [...this.itemsSubject.value];
    const existente = items.find((item) => item.id === producto.id);

    if (existente) {
      existente.cantidad += 1;
    } else {
      items.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: 1,
      });
    }

    this.actualizar(items);
    return true;
  }

  eliminar(id: number): void {
    const items = this.itemsSubject.value.filter((item) => item.id !== id);
    this.actualizar(items);
  }

  vaciar(): void {
    this.actualizar([]);
  }

  actualizarCantidad(id: number, cantidad: number): void {
    const items = this.itemsSubject.value.map((item) =>
      item.id === id ? { ...item, cantidad: cantidad > 0 ? cantidad : 1 } : item
    );
    this.actualizar(items);
  }

  calcularSubtotal(): number {
    return this.calcularSubtotalItems(this.itemsSubject.value);
  }

  calcularIVA(): number {
    return this.calcularSubtotal() * IVA;
  }

  calcularTotal(): number {
    return this.calcularTotalItems(this.itemsSubject.value);
  }

  cantidadItems(): number {
    return this.itemsSubject.value.reduce((suma, item) => suma + item.cantidad, 0);
  }

  obtenerItems(): ItemCarrito[] {
    return this.itemsSubject.value;
  }

  private calcularSubtotalItems(items: ItemCarrito[]): number {
    return items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
  }

  private calcularTotalItems(items: ItemCarrito[]): number {
    const subtotal = this.calcularSubtotalItems(items);
    return subtotal + subtotal * 0.16;
  }

  private actualizar(items: ItemCarrito[]): void {
    this.itemsSubject.next(items);
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
  }

  private cargarDesdeStorage(): ItemCarrito[] {
    const raw = localStorage.getItem(CLAVE_CARRITO);
    return raw ? JSON.parse(raw) : [];
  }
}
