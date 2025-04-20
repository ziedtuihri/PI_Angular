import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetDetailUserComponent } from './projet-detail-user.component';

describe('ProjetDetailUserComponent', () => {
  let component: ProjetDetailUserComponent;
  let fixture: ComponentFixture<ProjetDetailUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjetDetailUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjetDetailUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
