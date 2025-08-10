import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionsList } from './interventions-list';

describe('InterventionsList', () => {
  let component: InterventionsList;
  let fixture: ComponentFixture<InterventionsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterventionsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterventionsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
