import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';
import { ProductoService } from '../../services/producto.service';
import { CarritoService } from '../../services/carrito.service';
import { NotificacionService } from '../../shared/notificacion.service';
import { Producto } from '../../models/producto';
import { DescuentoPipe } from '../../pipes/descuento.pipe';

@Component({
  selector: 'app-detalle-producto',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, UpperCasePipe, FormsModule, DescuentoPipe],
  templateUrl: './detalle-producto.component.html',
  styleUrl: './detalle-producto.component.css',
})
export class DetalleProductoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productoService = inject(ProductoService);
  private readonly carrito = inject(CarritoService);
  private readonly notificacion = inject(NotificacionService);

  producto?: Producto;
  cantidad = 1;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = Number(params.get('id'));
          return this.productoService.obtenerProducto(id);
        })
      )
      .subscribe((producto) => {
        this.producto = producto;
      });
  }

  agregarCarrito(): void {
    if (!this.producto) return;
    for (let i = 0; i < this.cantidad; i++) {
      this.carrito.agregar(this.producto);
    }
    this.notificacion.mostrar(`${this.producto.nombre} agregado al carrito`);
  }

  porcentajeOferta(): number {
    if (!this.producto?.oferta) return 0;
    const match = this.producto.oferta.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }
}
