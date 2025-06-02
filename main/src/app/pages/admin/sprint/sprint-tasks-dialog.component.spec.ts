import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintTasksDialogComponent } from './sprint-tasks-dialog.component';

describe('SprintTasksDialogComponent', () => {
  let component: SprintTasksDialogComponent;
  let fixture: ComponentFixture<SprintTasksDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SprintTasksDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SprintTasksDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
