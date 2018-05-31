import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearsContentComponent } from './years-content.component';

describe('YearsContentComponent', () => {
  let component: YearsContentComponent;
  let fixture: ComponentFixture<YearsContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [YearsContentComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearsContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
