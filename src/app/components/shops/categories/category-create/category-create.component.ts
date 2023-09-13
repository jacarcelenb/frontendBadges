import { Component, OnInit, Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/models/category.model';
import { Shop } from 'src/app/models/shop.model';
import { MainCategoryService } from 'src/app/services/main-category.service';
import { MainCategory } from 'src/app/models/main-category.model';
/* import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap'; */

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.scss']
})
export class CategoryCreateComponent implements OnInit {
  @Input() currentShop: Shop;

  category: Category = {
    category_id: null,
    shop_id: null,
    main_category_id: null,
    name: '',
    description: '',
  };
  submitted = false;
  mainCategories: MainCategory[] = [];

  constructor(
    private categoryService: CategoryService,
    private maincategoryService: MainCategoryService
  ) { }

  ngOnInit(): void {
    // this.getMainCategories();
  }

  getMainCategories(): void {
    this.maincategoryService.getAll()
      .subscribe(
        data => {
          this.mainCategories = data.main_categories;
          console.log({ "mainCategories ": this.mainCategories });
        },
        error => {
          console.log(error);
        });
  }

  saveCategory(): void {
    //this.shop.vendor_id = this.selectedVendor
    // console.log(this.shop);
    this.category.shop_id = this.currentShop.shop_id;
    console.log(this.category);
    /* const data = {
      title: this.tutorial.title,
      description: this.tutorial.description
    }; */

    this.categoryService.create(this.category)
      .subscribe(
        response => {
          
          this.submitted = true;
          //  this.updateShopsEvent.emit(true);
        },
        error => {
          console.log(error);
        });
  }

  newCategory(): void {
    this.submitted = false;
    this.category = {
      category_id: null,
      main_category_id: null,
      shop_id: null,
      name: '',
      description: '',
    };
  }

}
