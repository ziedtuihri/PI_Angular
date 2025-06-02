import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VelocityChartComponent } from './velocity-chart.component';

describe('VelocityChartComponent', () => {
  let component: VelocityChartComponent;
  let fixture: ComponentFixture<VelocityChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VelocityChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VelocityChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
