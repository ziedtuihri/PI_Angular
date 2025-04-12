import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpritnComponent } from './spritn.component';

describe('SpritnComponent', () => {
  let component: SpritnComponent;
  let fixture: ComponentFixture<SpritnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpritnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpritnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
