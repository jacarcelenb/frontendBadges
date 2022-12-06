import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZipFilesComponent } from './zip-files.component';

describe('ZipFilesComponent', () => {
  let component: ZipFilesComponent;
  let fixture: ComponentFixture<ZipFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZipFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZipFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
