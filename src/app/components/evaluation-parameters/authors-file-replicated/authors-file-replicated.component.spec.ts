import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorsFileReplicatedComponent } from './authors-file-replicated.component';

describe('AuthorsFileReplicatedComponent', () => {
  let component: AuthorsFileReplicatedComponent;
  let fixture: ComponentFixture<AuthorsFileReplicatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorsFileReplicatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorsFileReplicatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
