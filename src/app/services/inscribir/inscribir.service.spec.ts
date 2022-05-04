import { TestBed } from '@angular/core/testing';

import { InscribirService } from './inscribir.service';

describe('InscribirService', () => {
  let service: InscribirService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InscribirService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
