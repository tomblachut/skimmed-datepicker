import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearsViewComponent } from './years-view.component';

describe('YearsViewComponent', () => {
  let component: YearsViewComponent;
  let fixture: ComponentFixture<YearsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [YearsViewComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
