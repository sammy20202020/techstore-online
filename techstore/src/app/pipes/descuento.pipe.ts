import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'descuento',
  standalone: true,
})
export class DescuentoPipe implements PipeTransform {
  transform(precio: number, porcentaje: number): number {
    if (!precio || !porcentaje) return precio;
    return precio - precio * (porcentaje / 100);
  }
}
