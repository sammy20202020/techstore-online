import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';

export interface CategoriaItem {
  id: string;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-category-menu',
  standalone: true,
  imports: [FormsModule, NgStyle],
  templateUrl: './category-menu.component.html',
  styleUrl: './category-menu.component.css',
})
export class CategoryMenuComponent {
  @Input() categoriasSeleccionadas: string[] = [];
  @Output() categoriasChange = new EventEmitter<string[]>();

  readonly categorias: CategoriaItem[] = [
    { id: 'laptops', nombre: 'Laptops', descripcion: 'Portátiles para trabajo y gaming.' },
    { id: 'smartphones', nombre: 'Smartphones', descripcion: 'Teléfonos de las mejores marcas.' },
    { id: 'accesorios', nombre: 'Accesorios', descripcion: 'Auriculares, cargadores y más.' },
    { id: 'gaming', nombre: 'Gaming', descripcion: 'Consolas y periféricos gamer.' },
  ];

  private readonly colores: Record<string, string> = {
    laptops: '#6366f1',
    smartphones: '#8b5cf6',
    accesorios: '#f97316',
    gaming: '#10b981',
  };

  private readonly iconos: Record<string, string> = {
    laptops: '💻',
    smartphones: '📱',
    accesorios: '🎧',
    gaming: '🎮',
  };

  onCategoriaChange(id: string, checked: boolean): void {
    let seleccionadas = [...this.categoriasSeleccionadas];
    if (checked) {
      seleccionadas.push(id);
    } else {
      seleccionadas = seleccionadas.filter((c) => c !== id);
    }
    this.categoriasChange.emit(seleccionadas);
  }

  estaSeleccionada(id: string): boolean {
    return this.categoriasSeleccionadas.includes(id);
  }

  getColor(id: string): string {
    return this.colores[id] ?? '#6366f1';
  }

  getIcon(id: string): string {
    return this.iconos[id] ?? '📦';
  }
}
