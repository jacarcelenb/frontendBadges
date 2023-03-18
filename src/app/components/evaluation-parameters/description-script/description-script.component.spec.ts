import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionScriptComponent } from './description-script.component';

describe('DescriptionScriptComponent', () => {
  let component: DescriptionScriptComponent;
  let fixture: ComponentFixture<DescriptionScriptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DescriptionScriptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionScriptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
