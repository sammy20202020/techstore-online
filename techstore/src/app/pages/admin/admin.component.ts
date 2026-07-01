import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto';
import { NotificacionService } from '../../shared/notificacion.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly productoService = inject(ProductoService);
  private readonly notificacion = inject(NotificacionService);

  productos: Producto[] = [];
  editando?: Producto;

  readonly productoForm = this.fb.nonNullable.group({
    id: [0],
    nombre: ['', Validators.required],
    precio: [0, [Validators.required, Validators.min(1)]],
    categoria: ['laptops', Validators.required],
    marca: ['dell', Validators.required],
    imagen: ['https://picsum.photos/seed/new/400/300', Validators.required],
    disponible: [true],
    inventario: [10, Validators.min(0)],
    oferta: [''],
  });

  ngOnInit(): void {
    this.productoService.obtenerProductos().subscribe((p) => (this.productos = p));
  }

  guardar(): void {
    if (this.productoForm.invalid) return;

    const data = this.productoForm.getRawValue();
    const producto: Producto = {
      ...data,
      oferta: data.oferta || null,
    };

    if (this.editando) {
      this.productoService.editarProducto(producto);
      this.notificacion.mostrar('Producto actualizado');
    } else {
      producto.id = Date.now();
      this.productoService.agregarProducto(producto);
      this.notificacion.mostrar('Producto agregado');
    }

    this.resetForm();
    this.productoService.obtenerProductos().subscribe((p) => (this.productos = p));
  }

  editar(producto: Producto): void {
    this.editando = producto;
    this.productoForm.patchValue({
      ...producto,
      oferta: producto.oferta ?? '',
    });
  }

  eliminar(id: number): void {
    this.productoService.eliminarProducto(id);
    this.notificacion.mostrar('Producto eliminado');
    this.productoService.obtenerProductos().subscribe((p) => (this.productos = p));
  }

  resetForm(): void {
    this.editando = undefined;
    this.productoForm.reset({
      id: 0,
      categoria: 'laptops',
      marca: 'dell',
      imagen: 'https://picsum.photos/seed/new/400/300',
      disponible: true,
      inventario: 10,
      oferta: '',
    });
  }
}
