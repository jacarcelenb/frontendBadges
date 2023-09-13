import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.model';


@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {
  @Input() currentProduct: Product = {
    product_id: null,
    category_id: null,
    product_name: '',
    product_description: '',
    sku: 0,
    unit_price: 0,
    discount: 0,
  };

  message = '';
  constructor(
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.message = '';
  }

  updateProduct(): void {
    console.log(this.currentProduct);
    this.productService.update(this.currentProduct.product_id, this.currentProduct)
      .subscribe(
        response => {
          
          this.message = 'Registro actualizado exitosamente';
        },
        error => {
          console.log(error);
        });
  }
}
