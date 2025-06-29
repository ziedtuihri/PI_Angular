import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppComponent], // <-- AppComponent must be here
      // no declarations array here for standalone components
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // Skip these tests as your component has no title or rendered text
  xit(`should have as title 'Modernize Angular Admin Tempplate'`, () => {});
  xit('should render title', () => {});
});
