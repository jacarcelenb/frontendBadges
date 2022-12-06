import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';

import { Product } from 'src/app/models/product.model';
import { Category } from 'src/app/models/category.model';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit {

  @Input() currentCategory: Category;
  /*   product: Product = {
      product_id: null,
      category_id: null,
      main_category_id: null,
      product_name: '',
      product_description: '',
      sku: null,
      unit_price: null,
      discount: null,
    }; */
  submitted = false;
  productForm: FormGroup;
  errors: any[] = [];

  constructor(
    private categorySerive: CategoryService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.getCategory(this.route.snapshot.paramMap.get('id'))
    this.createFormGroup();
  }

  createFormGroup() {
    this.productForm = this.formBuilder.group({
      category_id: [''],
      product_name: ['', Validators.required],
      product_description: ['', Validators.required],
      unit_price: ['', [Validators.required, Validators.maxLength(6)]],
      discount: ['', [Validators.nullValidator, Validators.maxLength(6)]],
      sku: ['', [Validators.required, Validators.maxLength(10)]],
    });
  }

  get f() { return this.productForm.controls; }

  getCategory(id): void {
    this.categorySerive.get(id)
      .subscribe(
        data => {
          this.currentCategory = data.category;
          console.log({ "category": this.currentCategory });
        },
        error => {
          console.log(error);
        });
  }




  saveProduct(): void {
    this.productForm.value.category_id = this.currentCategory.category_id;
    if (this.productForm.invalid) {
      return;
    }
    console.log('form', this.productForm.value);
    this.productService.create(this.productForm.value)
      .subscribe(
        response => {
          console.log('response:', response);
          this.submitted = true;

          this.router.navigate([`/categories/${this.currentCategory.category_id}/products`])
          //  this.updateShopsEvent.emit(true);
        },
        error => {
          for (const property in error.error.errors) {
            console.log(`${property}: ${error.error.errors[property]}`);
            this.errors.push(error.error.errors[property]);
          }
        });
  }

  /* newProduct(): void {
    this.submitted = false;
    this.product = {
      product_id: null,
      category_id: null,
      main_category_id: null,
      product_name: '',
      product_description: '',
      sku: null,
      unit_price: null,
      discount: null,
    };
  } */

}
