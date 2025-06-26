import { TestBed } from '@angular/core/testing';

import { MoyenneService } from './moyenne.service';

describe('MoyenneService', () => {
  let service: MoyenneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoyenneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
