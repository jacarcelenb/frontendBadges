import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjetosNavComponent } from './objetos-nav.component';

describe('ObjetosNavComponent', () => {
  let component: ObjetosNavComponent;
  let fixture: ComponentFixture<ObjetosNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjetosNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjetosNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
