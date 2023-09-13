import { TokenStorageService } from './../../../services/token-storage.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ShopService } from 'src/app/services/shop.service';
import { Shop } from '../../../models/shop.model';

@Component({
  selector: 'app-shops-list',
  templateUrl: './shops-list.component.html',
  styleUrls: ['./shops-list.component.scss']
})
export class ShopsListComponent implements OnInit {

  shops: Shop[];
  currentShop: Shop;
  currentIndex = -1;
  name = '';


  page = 1;
  count = 0;
  pageSize = 3;
  pageSizes = [3, 6, 9];
  user = {
    first_name: "",
    last_name: "",
  }
  constructor(
    private shopService: ShopService,
    private tokenStorageService: TokenStorageService
  ) { }

  ngOnInit(): void {
    // this.retrieveShops();
    this.getUser()
  }
  getUser() {
    this.user = this.tokenStorageService.getUser().user


  }

  handlePageChange(event) {
    this.page = event;
    // this.retrieveShops();
  }

  handlePageSizeChange(event) {
    this.pageSize = event.target.value;
    this.page = 1;
    // this.retrieveShops();
  }

  getRequestParams(page, pageSize) {
    // tslint:disable-next-line:prefer-const
    let params = {};

    if (page) {
      params[`page`] = page - 1;
    }

    if (pageSize) {
      params[`size`] = pageSize;
    }
    return params;
  }

  retrieveShops(): void {

    const params = this.getRequestParams(this.page, this.pageSize);

    this.shopService.getAll(params)
      .subscribe(
        data => {
          this.shops = data.shops.data;
          this.count = data.shops.total;

        },
        error => {
        });
  }

  refreshList(): void {
    // this.retrieveShops();
    this.currentShop = null;
    this.currentIndex = -1;
  }

  setActiveShop(shop, index): void {
    this.currentShop = shop;
    this.currentIndex = index;
  }

  removeAllShops(): void {
    this.shopService.deleteAll()
      .subscribe(
        response => {

          // this.retrieveShops();
        },
        error => {
        });
  }

  searchName(): void {
    this.shopService.findByTitle(this.name)
      .subscribe(
        data => {
          this.shops = data.shops;

        },
        error => {

        });
  }

}
