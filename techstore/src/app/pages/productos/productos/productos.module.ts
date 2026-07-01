import { NgModule } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosRoutingModule } from './productos-routing.module';
import { ProductosComponent } from './productos.component';
import { ProductCardComponent } from '../../../components/product-card/product-card.component';

@NgModule({
  declarations: [ProductosComponent],
  imports: [CommonModule, FormsModule, NgClass, ProductCardComponent, ProductosRoutingModule],
})
export class ProductosModule {}
