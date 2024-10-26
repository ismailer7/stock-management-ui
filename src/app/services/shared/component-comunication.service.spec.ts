import { TestBed } from '@angular/core/testing';

import { ComponentComunicationService } from './component-comunication.service';

describe('ComponentComunicationService', () => {
  let service: ComponentComunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentComunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
