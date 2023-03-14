import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeNewpasswordComponent } from './change-newpassword.component';

describe('ChangeNewpasswordComponent', () => {
  let component: ChangeNewpasswordComponent;
  let fixture: ComponentFixture<ChangeNewpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeNewpasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeNewpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
