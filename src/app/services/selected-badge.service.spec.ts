import { TestBed } from '@angular/core/testing';

import { SelectedBadgeService } from './selected-badge.service';

describe('SelectedBadgeService', () => {
  let service: SelectedBadgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedBadgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
