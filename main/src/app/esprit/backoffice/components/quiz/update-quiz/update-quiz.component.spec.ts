import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateQuizComponent } from './update-quiz.component';

describe('UpdateQuizComponent', () => {
  let component: UpdateQuizComponent;
  let fixture: ComponentFixture<UpdateQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateQuizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
