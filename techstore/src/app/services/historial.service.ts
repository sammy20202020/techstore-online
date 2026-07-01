import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Orden } from '../models/orden';

const CLAVE_HISTORIAL = 'techstore_historial';
const CLAVE_FAVORITOS = 'techstore_favoritos';

@Injectable({ providedIn: 'root' })
export class HistorialService {
  private readonly ordenesSubject = new BehaviorSubject<Orden[]>(this.cargarOrdenes());
  private readonly favoritosSubject = new BehaviorSubject<number[]>(this.cargarFavoritos());

  readonly ordenes$ = this.ordenesSubject.asObservable();
  readonly favoritos$ = this.favoritosSubject.asObservable();

  agregarOrden(orden: Orden): void {
    const ordenes = [orden, ...this.ordenesSubject.value];
    this.ordenesSubject.next(ordenes);
    localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(ordenes));
  }

  obtenerOrdenes(): Orden[] {
    return this.ordenesSubject.value;
  }

  toggleFavorito(id: number): void {
    let favoritos = [...this.favoritosSubject.value];
    if (favoritos.includes(id)) {
      favoritos = favoritos.filter((f) => f !== id);
    } else {
      favoritos.push(id);
    }
    this.favoritosSubject.next(favoritos);
    localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
  }

  esFavorito(id: number): boolean {
    return this.favoritosSubject.value.includes(id);
  }

  obtenerFavoritos(): number[] {
    return this.favoritosSubject.value;
  }

  private cargarOrdenes(): Orden[] {
    const raw = localStorage.getItem(CLAVE_HISTORIAL);
    if (!raw) return [];
    return JSON.parse(raw).map((o: Orden) => ({ ...o, fecha: new Date(o.fecha) }));
  }

  private cargarFavoritos(): number[] {
    const raw = localStorage.getItem(CLAVE_FAVORITOS);
    return raw ? JSON.parse(raw) : [];
  }
}
