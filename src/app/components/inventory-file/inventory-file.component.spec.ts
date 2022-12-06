import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryFileComponent } from './inventory-file.component';

describe('InventoryFileComponent', () => {
  let component: InventoryFileComponent;
  let fixture: ComponentFixture<InventoryFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
