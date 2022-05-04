import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PistaComponent } from './pista.component';

describe('PistaComponent', () => {
  let component: PistaComponent;
  let fixture: ComponentFixture<PistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PistaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
