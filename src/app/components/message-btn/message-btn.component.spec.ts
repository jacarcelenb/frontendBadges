import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageBtnComponent } from './message-btn.component';

describe('MessageBtnComponent', () => {
  let component: MessageBtnComponent;
  let fixture: ComponentFixture<MessageBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageBtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
