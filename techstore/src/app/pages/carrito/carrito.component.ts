import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../services/carrito.service';
import { NotificacionService } from '../../shared/notificacion.service';
import { ItemCarrito } from '../../models/item-carrito';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [RouterLink, AsyncPipe, CurrencyPipe, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css',
})
export class CarritoComponent {
  readonly carrito = inject(CarritoService);
  private readonly notificacion = inject(NotificacionService);

  eliminar(id: number): void {
    this.carrito.eliminar(id);
    this.notificacion.mostrar('Producto eliminado');
  }

  vaciar(): void {
    this.carrito.vaciar();
    this.notificacion.mostrar('Carrito vaciado');
  }

  actualizarCantidad(item: ItemCarrito, cantidad: number): void {
    this.carrito.actualizarCantidad(item.id, cantidad);
  }

  subtotal(items: ItemCarrito[]): number {
    return items.reduce((s, i) => s + i.precio * i.cantidad, 0);
  }

  iva(items: ItemCarrito[]): number {
    return this.subtotal(items) * 0.16;
  }

  total(items: ItemCarrito[]): number {
    return this.subtotal(items) + this.iva(items);
  }

  cantidadTotal(items: ItemCarrito[]): number {
    return items.reduce((s, i) => s + i.cantidad, 0);
  }
}
