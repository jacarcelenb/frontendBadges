import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypePackageComponent } from './type-package.component';

describe('TypePackageComponent', () => {
  let component: TypePackageComponent;
  let fixture: ComponentFixture<TypePackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypePackageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypePackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
