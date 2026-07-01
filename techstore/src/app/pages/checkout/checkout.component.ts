import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { HistorialService } from '../../services/historial.service';
import { AuthService } from '../../services/auth.service';
import { NotificacionService } from '../../shared/notificacion.service';
import { Orden } from '../../models/orden';
import { ItemCarrito } from '../../models/item-carrito';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, CurrencyPipe, DatePipe],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  private readonly fb = inject(FormBuilder);
  private readonly carrito = inject(CarritoService);
  private readonly historial = inject(HistorialService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificacion = inject(NotificacionService);

  readonly items$ = this.carrito.items$;
  ordenConfirmada?: Orden;
  fechaActual = new Date();

  readonly checkoutForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    direccion: ['', [Validators.required, Validators.minLength(5)]],
    telefono: ['', [Validators.required, Validators.pattern(/^[\d\s+\-()]{7,20}$/)]],
    tarjeta: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
  });

  get f() {
    return this.checkoutForm.controls;
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

  enviar(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const items = this.carrito.obtenerItems();
    if (items.length === 0) {
      this.notificacion.mostrar('Agrega productos antes de comprar');
      return;
    }

    const form = this.checkoutForm.getRawValue();
    const subtotal = this.subtotal(items);
    const iva = this.iva(items);

    this.ordenConfirmada = {
      id: `ORD-${Math.floor(Math.random() * 9000) + 1000}`,
      fecha: new Date(),
      cliente: {
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono,
        direccion: form.direccion,
      },
      items: [...items],
      subtotal,
      iva,
      total: subtotal + iva,
    };

    this.historial.agregarOrden(this.ordenConfirmada);
    this.carrito.vaciar();
    this.notificacion.mostrar('Compra realizada exitosamente');
  }

  volverInicio(): void {
    this.router.navigate(['/']);
  }
}
