import { TestBed, inject } from '@angular/core/testing';

import { GamestatusService } from './gamestatus.service';

describe('GamestatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GamestatusService]
    });
  });

  it('should be created', inject([GamestatusService], (service: GamestatusService) => {
    expect(service).toBeTruthy();
  }));
});
