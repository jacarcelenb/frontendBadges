import { TestBed } from '@angular/core/testing';

import { InfocardsService } from './infocards.service';

describe('InfocardsService', () => {
  let service: InfocardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfocardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
