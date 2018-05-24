import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthsViewComponent } from './months-view.component';

describe('MonthsViewComponent', () => {
  let component: MonthsViewComponent;
  let fixture: ComponentFixture<MonthsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MonthsViewComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
