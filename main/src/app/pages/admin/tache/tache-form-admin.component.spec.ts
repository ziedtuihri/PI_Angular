import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TacheFormAdminComponent } from './tache-form-admin.component';

describe('TacheFormAdminComponent', () => {
  let component: TacheFormAdminComponent;
  let fixture: ComponentFixture<TacheFormAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TacheFormAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TacheFormAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
