import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadstormAngularUiComponent } from './headstorm-angular-ui.component';

describe('HeadstormAngularUiComponent', () => {
  let component: HeadstormAngularUiComponent;
  let fixture: ComponentFixture<HeadstormAngularUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeadstormAngularUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeadstormAngularUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
