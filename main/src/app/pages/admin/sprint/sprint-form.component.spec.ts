import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintFormComponent } from './sprint-form.component';

describe('SprintFormComponent', () => {
  let component: SprintFormComponent;
  let fixture: ComponentFixture<SprintFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SprintFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SprintFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
