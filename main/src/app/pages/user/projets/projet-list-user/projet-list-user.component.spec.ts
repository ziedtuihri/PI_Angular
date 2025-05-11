import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjetListUserComponent } from './projet-list-user.component';

describe('ProjetListUserComponent', () => {
  let component: ProjetListUserComponent;
  let fixture: ComponentFixture<ProjetListUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjetListUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjetListUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
