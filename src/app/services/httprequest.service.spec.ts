import { TestBed, inject } from '@angular/core/testing';

import { HttprequestService } from './httprequest.service';

describe('HttprequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttprequestService]
    });
  });

  it('should be created', inject([HttprequestService], (service: HttprequestService) => {
    expect(service).toBeTruthy();
  }));
});
