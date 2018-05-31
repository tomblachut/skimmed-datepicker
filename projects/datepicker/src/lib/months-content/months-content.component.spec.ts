import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthsContentComponent } from './months-content.component';

describe('MonthsContentComponent', () => {
  let component: MonthsContentComponent;
  let fixture: ComponentFixture<MonthsContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MonthsContentComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthsContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
