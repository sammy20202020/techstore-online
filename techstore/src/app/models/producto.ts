export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  marca: string;
  imagen: string;
  disponible: boolean;
  oferta?: string | null;
  descripcion?: string;
  rating?: number;
  inventario?: number;
}

export interface FiltrosProducto {
  precioMin: number;
  precioMax: number;
  marca: string;
  categorias: string[];
  soloDisponibles: boolean;
  busqueda: string;
}
