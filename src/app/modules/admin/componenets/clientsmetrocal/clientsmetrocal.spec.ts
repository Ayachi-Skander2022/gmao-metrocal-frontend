import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Clientsmetrocal } from './clientsmetrocal';

describe('Clientsmetrocal', () => {
  let component: Clientsmetrocal;
  let fixture: ComponentFixture<Clientsmetrocal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Clientsmetrocal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Clientsmetrocal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
