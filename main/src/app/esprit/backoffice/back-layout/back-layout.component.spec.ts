import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackLayoutComponent } from './back-layout.component';

describe('BackLayoutComponent', () => {
  let component: BackLayoutComponent;
  let fixture: ComponentFixture<BackLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
