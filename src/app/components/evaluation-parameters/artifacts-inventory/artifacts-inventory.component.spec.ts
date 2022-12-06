import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtifactsInventoryComponent } from './artifacts-inventory.component';

describe('ArtifactsInventoryComponent', () => {
  let component: ArtifactsInventoryComponent;
  let fixture: ComponentFixture<ArtifactsInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtifactsInventoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtifactsInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
