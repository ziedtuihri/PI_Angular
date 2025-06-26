import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListtacheComponent } from './listtache.component';

describe('ListtacheComponent', () => {
  let component: ListtacheComponent;
  let fixture: ComponentFixture<ListtacheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListtacheComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListtacheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
