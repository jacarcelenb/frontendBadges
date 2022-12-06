import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopCProductsComponent } from './shop-c-products.component';

describe('ShopCProductsComponent', () => {
  let component: ShopCProductsComponent;
  let fixture: ComponentFixture<ShopCProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopCProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopCProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
