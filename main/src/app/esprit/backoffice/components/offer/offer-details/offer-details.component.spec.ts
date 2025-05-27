import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferDetailsComponent } from './offer-details.component';

describe('OfferDetailsComponent', () => {
  let component: OfferDetailsComponent;
  let fixture: ComponentFixture<OfferDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
