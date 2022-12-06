import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorFileComponent } from './author-file.component';

describe('AuthorFileComponent', () => {
  let component: AuthorFileComponent;
  let fixture: ComponentFixture<AuthorFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorFileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
