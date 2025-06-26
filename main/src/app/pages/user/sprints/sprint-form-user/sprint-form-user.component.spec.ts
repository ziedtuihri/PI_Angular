import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintFormUserComponent } from './sprint-form-user.component';

describe('SprintFormUserComponent', () => {
  let component: SprintFormUserComponent;
  let fixture: ComponentFixture<SprintFormUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SprintFormUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SprintFormUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
