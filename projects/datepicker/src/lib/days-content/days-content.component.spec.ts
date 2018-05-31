import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DaysContentComponent } from './days-content.component';

describe('DaysContentComponent', () => {
  let component: DaysContentComponent;
  let fixture: ComponentFixture<DaysContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DaysContentComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DaysContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
