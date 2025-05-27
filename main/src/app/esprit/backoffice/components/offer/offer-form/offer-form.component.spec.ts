import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferFormComponent } from './offer-form.component';

describe('OfferFormComponent', () => {
  let component: OfferFormComponent;
  let fixture: ComponentFixture<OfferFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
