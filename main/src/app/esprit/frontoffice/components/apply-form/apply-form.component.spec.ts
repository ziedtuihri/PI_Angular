import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyFormComponent } from './apply-form.component';

describe('ApplyFormComponent', () => {
  let component: ApplyFormComponent;
  let fixture: ComponentFixture<ApplyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplyFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
