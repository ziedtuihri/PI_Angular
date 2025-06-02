import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficherNotesComponent } from './afficher-notes.component';

describe('AfficherNotesComponent', () => {
  let component: AfficherNotesComponent;
  let fixture: ComponentFixture<AfficherNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfficherNotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfficherNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
