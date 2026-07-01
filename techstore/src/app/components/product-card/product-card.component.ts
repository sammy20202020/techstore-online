import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { Producto } from '../../models/producto';
import { CarritoService } from '../../services/carrito.service';
import { HistorialService } from '../../services/historial.service';
import { NotificacionService } from '../../shared/notificacion.service';
import { DescuentoPipe } from '../../pipes/descuento.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, UpperCasePipe, DescuentoPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  @Input({ required: true }) producto!: Producto;
  @Output() agregado = new EventEmitter<Producto>();

  private readonly carrito = inject(CarritoService);
  private readonly historial = inject(HistorialService);
  private readonly notificacion = inject(NotificacionService);

  agregarCarrito(): void {
    if (this.carrito.agregar(this.producto)) {
      this.notificacion.mostrar(`${this.producto.nombre} agregado al carrito`);
      this.agregado.emit(this.producto);
    }
  }

  toggleFavorito(): void {
    this.historial.toggleFavorito(this.producto.id);
    this.notificacion.mostrar(
      this.historial.esFavorito(this.producto.id)
        ? 'Agregado a favoritos'
        : 'Eliminado de favoritos'
    );
  }

  esFavorito(): boolean {
    return this.historial.esFavorito(this.producto.id);
  }

  porcentajeOferta(): number {
    if (!this.producto.oferta) return 0;
    const match = this.producto.oferta.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }
}
