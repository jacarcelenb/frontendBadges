import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from 'src/app/services/shop.service';
import { Shop } from '../../../models/shop.model';

@Component({
  selector: 'app-shop-details',
  templateUrl: './shop-details.component.html',
  styleUrls: ['./shop-details.component.scss']
})
export class ShopDetailsComponent implements OnInit {
  vendors = []
  currentShop: Shop;
  message = '';

  constructor(
    private shopService: ShopService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.message = '';
    this.getVendors()
    this.getShop(this.route.snapshot.paramMap.get('id'));
  }

  getVendors() {
    this.shopService.getVendors().subscribe((res: any) => {

      this.vendors = res.vendors
    })
  }

  getShop(id): void {
    this.shopService.get(id)
      .subscribe(
        data => {
          this.currentShop = data.shop;

        },
        error => {

        });
  }


  updateShop(): void {
    this.shopService.update(this.currentShop.shop_id, this.currentShop)
      .subscribe(
        response => {

          this.message = 'The tutorial was updated successfully!';
        },
        error => {

        });
  }

}
