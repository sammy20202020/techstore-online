import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { NotificacionService } from '../../shared/notificacion.service';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css',
})
export class ContactoComponent {
  private readonly fb = inject(FormBuilder);
  private readonly notificacion = inject(NotificacionService);

  enviado = false;
  errores: string[] = [];

  readonly contactoForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    telefono: ['', Validators.pattern(/^[\d\s+\-()]{7,20}$/)],
    mensaje: ['', [Validators.required, Validators.minLength(10)]],
    presupuesto: [500],
    newsletter: [false],
  });

  enviar(): void {
    this.errores = [];
    if (this.contactoForm.invalid) {
      this.contactoForm.markAllAsTouched();
      if (this.contactoForm.controls.nombre.errors) this.errores.push('El nombre es obligatorio.');
      if (this.contactoForm.controls.email.errors) this.errores.push('Ingresa un correo válido.');
      if (this.contactoForm.controls.password.errors) this.errores.push('La contraseña debe tener al menos 8 caracteres.');
      if (this.contactoForm.controls.mensaje.errors) this.errores.push('El mensaje debe tener al menos 10 caracteres.');
      return;
    }
    this.enviado = true;
    this.notificacion.mostrar('Formulario enviado correctamente');
  }
}
