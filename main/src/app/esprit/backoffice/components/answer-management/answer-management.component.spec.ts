import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerManagementComponent } from './answer-management.component';

describe('AnswerManagementComponent', () => {
  let component: AnswerManagementComponent;
  let fixture: ComponentFixture<AnswerManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnswerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
