import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferManagementComponent } from './offer-management.component';

describe('OfferManagementComponent', () => {
  let component: OfferManagementComponent;
  let fixture: ComponentFixture<OfferManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
