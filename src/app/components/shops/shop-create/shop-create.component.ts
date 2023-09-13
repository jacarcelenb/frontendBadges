import { Component, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop.service';
import { Output, EventEmitter } from '@angular/core';
import { Shop } from '../../../models/shop.model';
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from "rxjs/operators";
@Component({
  selector: 'app-shop-create',
  templateUrl: './shop-create.component.html',
  styleUrls: ['./shop-create.component.scss']
})
export class ShopCreateComponent implements OnInit {
  @Output() updateShopsEvent = new EventEmitter<boolean>();

  shop: Shop = {
    shop_id: null,
    vendor_id: null,
    name: '',
    logo: '',
    banner: '',
    phone: ''
  };
  vendors: any;
  selectedVendor: any;
  submitted = false;

  selectedFileLogo: FileList
  selectedFileBanner: FileList
  file: File
  progressBarValueLogo = ""
  progressBarValueBanner = ""
  color: string = 'primary'
  mode: 'determiante'


  constructor(
    private shopService: ShopService,
    private afStorage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    //this.getVendors();
  }

  chooseFileLogo(event) {
    this.selectedFileLogo = event.target.files
    if (this.selectedFileLogo.item(0)) {
      this.uploadLogo()
    }
  }

  chooseFileBanner(event) {
    this.selectedFileBanner = event.target.files
    if (this.selectedFileBanner.item(0)) {
      this.uploadBanner()
    }
  }

  getVendors(): void {
    this.shopService.getVendors()
      .subscribe(
        data => {
          this.vendors = data.vendors;
          console.log("vendors: ", this.vendors)
        },
        error => {
          console.log(error);
        });
  }

  saveShop(): void {

    console.log(this.shop);
    if (this.selectedFileLogo.item(0)) {
      console.log("FILE LOGO SELECTED");
      if (this.selectedFileBanner.item(0)) {

        this.createShop() // store shop backend rest service

      } else {

        console.log("FILE BANNER NOT SELECTED");
      }
    } else {
      console.log("FILE LOGO NOT SELECTED");
    }
  }

  uploadLogo() {
    var filePath = `encuba-logos/${this.selectedFileLogo.item(0).name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
    const fileRef = this.afStorage.ref(filePath);
    const uploadTask = this.afStorage.upload(filePath, this.selectedFileLogo.item(0))

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          console.log(url);
          this.shop.logo = url
        })
      })
    ).subscribe()
    uploadTask.percentageChanges().subscribe((value) => {
      this.progressBarValueLogo = value.toFixed(0)
    })
  }

  uploadBanner() {
    var filePath = `encuba-banners/${this.selectedFileBanner.item(0).name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
    const fileRef = this.afStorage.ref(filePath);
    const uploadTask = this.afStorage.upload(filePath, this.selectedFileBanner.item(0))

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          console.log(url);
          this.shop.banner = url
        })
      })
    ).subscribe()
    uploadTask.percentageChanges().subscribe((value) => {
      this.progressBarValueBanner = value.toFixed(0)
    })
  }

  createShop() {
    this.shopService.create(this.shop)
      .subscribe(
        response => {
          
          this.submitted = true;
          this.updateShopsEvent.emit(true);
        },
        error => {
          console.log(error);
        });
  }

  newShop(): void {
    this.submitted = false;
    this.shop = {
      shop_id: null,
      vendor_id: null,
      name: '',
      logo: '',
      banner: '',
      phone: ''
    };
  }


}
