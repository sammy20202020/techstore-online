import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent {
  readonly auth = inject(AuthService);
  readonly usuario = this.auth.getUsuario();

  logout(): void {
    this.auth.logout();
  }
}
