import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { CategoryService } from 'src/app/services/category.service';
import { MainCategory } from 'src/app/models/main-category.model';
import { MainCategoryService } from 'src/app/services/main-category.service';
import { Category } from 'src/app/models/category.model';


@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent implements OnInit {

  editCategoryForm: FormGroup;
  categoryId: number;
  categoryData: any;
  event: EventEmitter<any> = new EventEmitter();

  @Input() currentCategory: Category = {
    category_id: null,
    main_category_id: null,
    shop_id: null,
    name: '',
    description: '',
  };
  mainCategories: MainCategory[] = [];
  message = '';

  constructor(
    private categoryService: CategoryService,
    private maincategoryService: MainCategoryService,
    private builder: FormBuilder,
    private bsModalRef: BsModalRef
  ) { }

  ngOnInit(): void {
    this.message = '';
    this.startModal();
    // this.getMainCategories();
  }

  startModal() {
    this.editCategoryForm = this.builder.group({
      main_category_id : new FormControl(null, []),
      shop_id: new FormControl(null, []),
      name: new FormControl('', []),
      description: new FormControl('', [])
    });


    this.getMainCategories();

    this.categoryService.categoryIdSource.subscribe(data => {
      this.categoryId = data;
      if (this.categoryId !== undefined) {
        this.categoryService.get(this.categoryId).subscribe(data => {
          this.categoryData = data;
          
          if (this.editCategoryForm!=null && this.categoryData!=null) {
            this.editCategoryForm.controls['main_category_id'].setValue(this.categoryData.main_category_id);
            this.editCategoryForm.controls['shop_id'].setValue(this.categoryData.shop_id);
            this.editCategoryForm.controls['name'].setValue(this.categoryData.name);
            this.editCategoryForm.controls['description'].setValue(this.categoryData.description);
          }
        }, error => { console.log("Error al obetener category details") });
      }
    });
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

  updateCategory(): void {
    console.log('cat send', this.currentCategory);
    this.categoryService.update(this.currentCategory.category_id, this.currentCategory)
      .subscribe(
        response => {
          
          this.message = 'Registro actualizado exitosamente';
        },
        error => {
          console.log(error);
        });
  }


}
