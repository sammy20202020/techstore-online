import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Usuario } from '../models/cliente';

const CLAVE_USUARIO = 'techstore_usuario';
const CLAVE_TOKEN = 'techstore_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly usuarioSubject = new BehaviorSubject<Usuario | null>(this.cargarUsuario());
  readonly usuario$ = this.usuarioSubject.asObservable();
  readonly isAuthenticated$ = this.usuario$.pipe(
    tap(() => undefined)
  );

  login(email: string, password: string): Observable<Usuario> {
    const usuario: Usuario = {
      id: 1,
      nombre: email.split('@')[0],
      email,
      token: this.generarToken(email),
    };
    this.guardarSesion(usuario);
    return of(usuario).pipe(tap((u) => this.usuarioSubject.next(u)));
  }

  registro(nombre: string, email: string, password: string): Observable<Usuario> {
    const usuario: Usuario = {
      id: Date.now(),
      nombre,
      email,
      token: this.generarToken(email),
    };
    this.guardarSesion(usuario);
    return of(usuario).pipe(tap((u) => this.usuarioSubject.next(u)));
  }

  logout(): void {
    localStorage.removeItem(CLAVE_USUARIO);
    localStorage.removeItem(CLAVE_TOKEN);
    this.usuarioSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(CLAVE_TOKEN);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUsuario(): Usuario | null {
    return this.usuarioSubject.value;
  }

  private generarToken(email: string): string {
    const payload = btoa(JSON.stringify({ email, exp: Date.now() + 86400000 }));
    return `jwt.${payload}.techstore`;
  }

  private guardarSesion(usuario: Usuario): void {
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
    localStorage.setItem(CLAVE_TOKEN, usuario.token);
    this.usuarioSubject.next(usuario);
  }

  private cargarUsuario(): Usuario | null {
    const raw = localStorage.getItem(CLAVE_USUARIO);
    const token = localStorage.getItem(CLAVE_TOKEN);
    if (!raw || !token) return null;
    return JSON.parse(raw);
  }
}
