import { TestBed } from '@angular/core/testing';

import { TraductionServiceService } from './traduction-service.service';

describe('TraductionServiceService', () => {
  let service: TraductionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TraductionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
