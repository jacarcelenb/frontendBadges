import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupDetailsOutletComponentComponent } from './group-details-outlet-component.component';

describe('GroupDetailsOutletComponentComponent', () => {
  let component: GroupDetailsOutletComponentComponent;
  let fixture: ComponentFixture<GroupDetailsOutletComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupDetailsOutletComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDetailsOutletComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
