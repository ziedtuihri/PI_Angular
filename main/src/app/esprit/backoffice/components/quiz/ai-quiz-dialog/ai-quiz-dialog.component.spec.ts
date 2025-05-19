import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiQuizDialogComponent } from './ai-quiz-dialog.component';

describe('AiQuizDialogComponent', () => {
  let component: AiQuizDialogComponent;
  let fixture: ComponentFixture<AiQuizDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiQuizDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiQuizDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
