import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Subscription, combineLatest } from 'rxjs';
import { ProductoService } from '../../services/producto.service';
import { CarritoService } from '../../services/carrito.service';
import { Producto } from '../../models/producto';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CategoryMenuComponent } from '../../components/category-menu/category-menu.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe, ProductCardComponent, CategoryMenuComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly productoService = inject(ProductoService);
  private readonly carrito = inject(CarritoService);

  destacados: Producto[] = [];
  statCarrito = 0;
  statTotal = 0;
  statCategorias = 0;
  statCaro = '-';
  horaActual = new Date();
  mostrarOferta = true;

  private subs = new Subscription();
  private timer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.subs.add(
      this.productoService.obtenerProductos().subscribe((productos) => {
        this.destacados = productos.slice(0, 8);
        this.calcularEstadisticas(productos);
      })
    );

    this.subs.add(
      combineLatest([this.carrito.items$, this.carrito.total$]).subscribe(([items, total]) => {
        this.statCarrito = items.reduce((s, i) => s + i.cantidad, 0);
        this.statTotal = total;
      })
    );

    this.timer = setInterval(() => {
      this.horaActual = new Date();
    }, 1000);

    setTimeout(() => {
      this.mostrarOferta = false;
    }, 5000);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    if (this.timer) clearInterval(this.timer);
  }

  private calcularEstadisticas(productos: Producto[]): void {
    const categorias = [...new Set(productos.map((p) => p.categoria))];
    this.statCategorias = categorias.length;

    const masCaro = productos.reduce<Producto | null>((max, p) => {
      if (!max || p.precio > max.precio) return p;
      return max;
    }, null);

    this.statCaro = masCaro ? `${masCaro.nombre} ($${masCaro.precio.toFixed(2)})` : '-';
  }
}
