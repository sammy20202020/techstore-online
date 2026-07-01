import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private readonly mensajeSubject = new BehaviorSubject<string | null>(null);
  readonly mensaje$ = this.mensajeSubject.asObservable();

  mostrar(mensaje: string, duracion = 3000): void {
    this.mensajeSubject.next(mensaje);
    setTimeout(() => this.mensajeSubject.next(null), duracion);
  }
}
