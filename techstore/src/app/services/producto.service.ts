import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { FiltrosProducto, Producto } from '../models/producto';

const FAKE_STORE_URL = 'https://fakestoreapi.com/products';
const LOCAL_URL = 'assets/data/productos.json';
const ADMIN_KEY = 'techstore_admin_productos';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly http = inject(HttpClient);
  private readonly productosSubject = new BehaviorSubject<Producto[]>([]);
  readonly productos$ = this.productosSubject.asObservable();

  constructor() {
    this.cargarProductos().subscribe();
  }

  obtenerProductos(): Observable<Producto[]> {
    if (this.productosSubject.value.length === 0) {
      return this.cargarProductos();
    }
    return this.productos$;
  }

  obtenerProducto(id: number): Observable<Producto | undefined> {
    return this.productos$.pipe(
      map((productos) => productos.find((p) => p.id === id)),
      switchMap((producto) => {
        if (producto) return of(producto);
        return this.http.get<ProductoApi>(`${FAKE_STORE_URL}/${id}`).pipe(
          map((item) => this.mapApiProducto(item)),
          catchError(() => of(undefined))
        );
      })
    );
  }

  buscarProducto(termino: string): Observable<Producto[]> {
    return this.productos$.pipe(
      map((productos) => this.filtrarProductos(productos, {
        precioMin: 0,
        precioMax: Infinity,
        marca: '',
        categorias: [],
        soloDisponibles: false,
        busqueda: termino,
      }))
    );
  }

  filtrarProductos(productos: Producto[], filtros: FiltrosProducto): Producto[] {
    return productos.filter((p) => {
      if (filtros.precioMin && p.precio < filtros.precioMin) return false;
      if (filtros.precioMax && p.precio > filtros.precioMax) return false;
      if (filtros.marca && p.marca !== filtros.marca) return false;
      if (filtros.categorias.length > 0 && !filtros.categorias.includes(p.categoria)) {
        return false;
      }
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

  agregarProducto(producto: Producto): void {
    const productos = [...this.productosSubject.value, producto];
    this.guardarAdmin(productos);
  }

  editarProducto(producto: Producto): void {
    const productos = this.productosSubject.value.map((p) =>
      p.id === producto.id ? producto : p
    );
    this.guardarAdmin(productos);
  }

  eliminarProducto(id: number): void {
    const productos = this.productosSubject.value.filter((p) => p.id !== id);
    this.guardarAdmin(productos);
  }

  private cargarProductos(): Observable<Producto[]> {
    const adminGuardados = this.leerAdmin();
    if (adminGuardados.length > 0) {
      this.productosSubject.next(adminGuardados);
      return of(adminGuardados);
    }

    return this.http.get<ProductoApi[]>(FAKE_STORE_URL).pipe(
      map((items) => items.map((item) => this.mapApiProducto(item))),
      catchError(() =>
        this.http.get<Producto[]>(LOCAL_URL).pipe(
          map((items) =>
            items.map((p) => ({ ...p, inventario: p.inventario ?? 10 }))
          )
        )
      ),
      tap((productos) => this.productosSubject.next(productos)),
      catchError(() => {
        this.productosSubject.next([]);
        return of([]);
      })
    );
  }

  private mapApiProducto(item: ProductoApi): Producto {
    const marcas = ['dell', 'hp', 'apple', 'samsung', 'sony', 'logitech'];
    const categoriasMap: Record<string, string> = {
      electronics: 'accesorios',
      jewelery: 'accesorios',
      "men's clothing": 'gaming',
      "women's clothing": 'smartphones',
    };
    return {
      id: item.id,
      nombre: item.title,
      precio: Math.round(item.price * 100) / 100,
      categoria: categoriasMap[item.category] ?? item.category,
      marca: marcas[item.id % marcas.length],
      imagen: item.image,
      disponible: true,
      oferta: (item.rating?.rate ?? 0) >= 4 ? '10% OFF' : null,
      descripcion: item.description,
      rating: item.rating?.rate,
      inventario: 20,
    };
  }

  private leerAdmin(): Producto[] {
    const raw = localStorage.getItem(ADMIN_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  private guardarAdmin(productos: Producto[]): void {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(productos));
    this.productosSubject.next(productos);
  }
}

interface ProductoApi {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: { rate: number; count: number };
}
