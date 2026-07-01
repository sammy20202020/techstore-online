import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificacionService } from '../../shared/notificacion.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notificacion = inject(NotificacionService);

  modoRegistro = false;

  readonly loginForm = this.fb.nonNullable.group({
    nombre: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  enviar(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { nombre, email, password } = this.loginForm.getRawValue();
    const obs = this.modoRegistro
      ? this.auth.registro(nombre || email.split('@')[0], email, password)
      : this.auth.login(email, password);

    obs.subscribe(() => {
      this.notificacion.mostrar(this.modoRegistro ? 'Registro exitoso' : 'Login exitoso');
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      this.router.navigateByUrl(returnUrl);
    });
  }

  toggleModo(): void {
    this.modoRegistro = !this.modoRegistro;
  }
}
