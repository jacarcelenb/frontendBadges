import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsListsComponent } from './products-lists.component';

describe('ProductsListsComponent', () => {
  let component: ProductsListsComponent;
  let fixture: ComponentFixture<ProductsListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
