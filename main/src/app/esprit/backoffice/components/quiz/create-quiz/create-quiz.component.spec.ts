import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuizComponent } from './create-quiz.component';

describe('CreateQuizComponent', () => {
  let component: CreateQuizComponent;
  let fixture: ComponentFixture<CreateQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateQuizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
