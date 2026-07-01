import { ItemCarrito } from './item-carrito';
import { Cliente } from './cliente';

export interface Orden {
  id: string;
  fecha: Date;
  cliente: Cliente;
  items: ItemCarrito[];
  subtotal: number;
  iva: number;
  total: number;
}
