import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Affectation } from './affectation';

describe('Affectation', () => {
  let component: Affectation;
  let fixture: ComponentFixture<Affectation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Affectation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Affectation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
