import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';
import { Product } from 'src/app/models/product.model';
import { Category } from 'src/app/models/category.model';

@Component({
  selector: 'app-products-lists',
  templateUrl: './products-lists.component.html',
  styleUrls: ['./products-lists.component.scss']
})
export class ProductsListsComponent implements OnInit {

  products: Product[] = [];
  currentProduct: Product = {
    product_id: null,
    category_id: null,
    product_name: '',
    product_description: '',
    sku: 0,
    unit_price: 0,
    discount: 0,
  };
  currentIndex = -1;
  isAuth = true;
  currentCategory: Category;

  constructor(
    private productService: ProductService,
    private categorySerive: CategoryService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getCategory(this.route.snapshot.paramMap.get('id'))
    this.retrieveProducts(this.route.snapshot.paramMap.get('id'));
  }

  getCategory(id): void {
    this.categorySerive.get(id)
      .subscribe(
        data => {
          this.currentCategory = data.category;
        },
        error => {
          console.log(error);
        });
  }

  retrieveProducts(category_id): void {
    this.productService.getAll(category_id)
      .subscribe(
        data => {
          this.products = data.products;
          console.log("products", this.products);
        },
        error => {
          console.log(error);
        });
  }

  setActiveProduct(product, index): void {
    console.log(product)
    this.currentProduct = product;
    this.currentIndex = index;
  }

}
