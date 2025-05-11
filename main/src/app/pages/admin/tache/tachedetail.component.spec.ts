import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TacheDetailsComponent } from './tachedetail.component';

describe('TachedetailComponent', () => {
  let component: TacheDetailsComponent;
  let fixture: ComponentFixture<TacheDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TacheDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TacheDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
