import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactFileComponent } from './contact-file.component';

describe('ContactFileComponent', () => {
  let component: ContactFileComponent;
  let fixture: ComponentFixture<ContactFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
