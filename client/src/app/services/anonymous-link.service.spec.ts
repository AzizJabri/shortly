import { TestBed } from '@angular/core/testing';

import { AnonymousLinkService } from './anonymous-link.service';

describe('AnonymousLinkService', () => {
  let service: AnonymousLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnonymousLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
