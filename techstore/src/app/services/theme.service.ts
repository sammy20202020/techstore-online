import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const CLAVE_TEMA = 'techstore_tema_oscuro';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly renderer: Renderer2;
  private readonly oscuroSubject = new BehaviorSubject<boolean>(this.leerPreferencia());
  readonly oscuro$ = this.oscuroSubject.asObservable();

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.aplicarTema(this.oscuroSubject.value);
  }

  toggle(): void {
    this.setOscuro(!this.oscuroSubject.value);
  }

  setOscuro(oscuro: boolean): void {
    this.oscuroSubject.next(oscuro);
    localStorage.setItem(CLAVE_TEMA, JSON.stringify(oscuro));
    this.aplicarTema(oscuro);
  }

  isOscuro(): boolean {
    return this.oscuroSubject.value;
  }

  private aplicarTema(oscuro: boolean): void {
    const body = document.body;
    if (oscuro) {
      this.renderer.addClass(body, 'tema-oscuro');
    } else {
      this.renderer.removeClass(body, 'tema-oscuro');
    }
  }

  private leerPreferencia(): boolean {
    const raw = localStorage.getItem(CLAVE_TEMA);
    return raw ? JSON.parse(raw) : false;
  }
}
