import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageDisplayComponent } from './message-display.component';

describe('MessageDisplayComponent', () => {
  let component: MessageDisplayComponent;
  let fixture: ComponentFixture<MessageDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
