import { TestBed } from '@angular/core/testing';

import { InputtimeService } from './inputtime.service';

describe('InputtimeService', () => {
  let service: InputtimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InputtimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
