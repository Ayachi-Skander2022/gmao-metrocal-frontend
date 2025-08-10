import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Etalons } from './etalons';

describe('Etalons', () => {
  let component: Etalons;
  let fixture: ComponentFixture<Etalons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Etalons]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Etalons);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
