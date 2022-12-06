import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";

import { CategoryEditComponent } from '../category-edit/category-edit.component';
import { CategoryService } from 'src/app/services/category.service';
import { ShopService } from 'src/app/services/shop.service';
import { Category } from 'src/app/models/category.model';
import { Shop } from 'src/app/models/shop.model';


@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  bsModalRef: BsModalRef;
  categories: Category[];
  currentShop: Shop;
  currentCategory: Category = {
    shop_id: null,
    main_category_id: null,
    name: '',
    description: '',
  };
  currentIndex = -1;

  constructor(
    private categoryService: CategoryService,
    private shopService: ShopService,
    private route: ActivatedRoute,
    private bsModalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.retrieveCategories(this.route.snapshot.paramMap.get('id'));
    this.getShop(this.route.snapshot.paramMap.get('id'))
  }

  retrieveCategories(shop_id): void {
    this.categoryService.getAll(shop_id)
      .subscribe(
        data => {
          this.categories = data.categories;
        },
        error => {
          console.log(error);
        });
  }

  getShop(id): void {
    this.shopService.get(id)
      .subscribe(
        data => {
          this.currentShop = data.shop;
          console.log({ "shop": data.shop });
        },
        error => {
          console.log(error);
        });
  }

  setActiveCategory(category, index): void {
    this.currentCategory = category;
    this.currentIndex = index;
  }

  editCategory(categoryId: number) {
    this.categoryService.changeCategoryId(categoryId);

    this.bsModalRef = this.bsModalService.show(CategoryEditComponent);
    this.bsModalRef.content.event.subscribe(result => {
      if (result == 'OK') {
        console.log("here")
        setTimeout(() => {
         // this.getPosts();
        }, 5000);
      }
    });
  }
}
