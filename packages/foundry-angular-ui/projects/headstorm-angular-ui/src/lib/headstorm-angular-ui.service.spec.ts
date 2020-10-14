import { TestBed } from '@angular/core/testing';

import { HeadstormAngularUiService } from './headstorm-angular-ui.service';

describe('HeadstormAngularUiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HeadstormAngularUiService = TestBed.get(HeadstormAngularUiService);
    expect(service).toBeTruthy();
  });
});
