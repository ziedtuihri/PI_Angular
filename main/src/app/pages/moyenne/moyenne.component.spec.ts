import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoyenneComponent } from './moyenne.component';

describe('MoyenneComponent', () => {
  let component: MoyenneComponent;
  let fixture: ComponentFixture<MoyenneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoyenneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoyenneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
