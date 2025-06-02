import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfficherNoteComponent } from './afficher-note.component';

describe('AfficherNoteComponent', () => {
  let component: AfficherNoteComponent;
  let fixture: ComponentFixture<AfficherNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfficherNoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfficherNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
