import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { ProductoService } from '../../../services/producto.service';
import { Producto, FiltrosProducto } from '../../../models/producto';

@Component({
  selector: 'app-productos',
  standalone: false,
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css',
})
export class ProductosComponent implements OnInit {
  private readonly productoService = inject(ProductoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  productosFiltrados: Producto[] = [];
  busqueda = '';
  precioMin = 0;
  precioMax = 5000;
  marca = '';
  categorias: string[] = [];
  soloDisponibles = false;
  paginaActual = 1;
  readonly porPagina = 6;

  ngOnInit(): void {
    combineLatest([this.productoService.obtenerProductos(), this.route.queryParams])
      .pipe(
        map(([productos, params]) => {
          this.busqueda = (params['q'] as string) ?? '';
          return this.productoService.filtrarProductos(productos, this.obtenerFiltros());
        })
      )
      .subscribe((filtrados) => {
        this.productosFiltrados = filtrados;
        this.paginaActual = 1;
      });
  }

  aplicarFiltros(): void {
    this.productoService.obtenerProductos().subscribe((productos) => {
      this.productosFiltrados = this.productoService.filtrarProductos(
        productos,
        this.obtenerFiltros()
      );
      this.paginaActual = 1;
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { q: this.busqueda || null },
        queryParamsHandling: 'merge',
      });
    });
  }

  limpiarFiltros(): void {
    this.precioMin = 0;
    this.precioMax = 5000;
    this.marca = '';
    this.categorias = [];
    this.soloDisponibles = false;
    this.busqueda = '';
    this.aplicarFiltros();
  }

  onCategoriasChange(categorias: string[]): void {
    this.categorias = categorias;
    this.aplicarFiltros();
  }

  toggleCategoria(categoria: string): void {
    if (this.categorias.includes(categoria)) {
      this.categorias = this.categorias.filter((c) => c !== categoria);
    } else {
      this.categorias = [...this.categorias, categoria];
    }
    this.aplicarFiltros();
  }

  get productosPaginados(): Producto[] {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    return this.productosFiltrados.slice(inicio, inicio + this.porPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.productosFiltrados.length / this.porPagina) || 1;
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  private obtenerFiltros(): FiltrosProducto {
    return {
      precioMin: this.precioMin,
      precioMax: this.precioMax || Infinity,
      marca: this.marca,
      categorias: this.categorias,
      soloDisponibles: this.soloDisponibles,
      busqueda: this.busqueda.trim(),
    };
  }
}
