import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintEtudiantsComponent } from './sprint-etudiants.component';

describe('SprintEtudiantsComponent', () => {
  let component: SprintEtudiantsComponent;
  let fixture: ComponentFixture<SprintEtudiantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SprintEtudiantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SprintEtudiantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
