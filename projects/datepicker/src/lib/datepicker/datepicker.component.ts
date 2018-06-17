import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { WeekDay } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isValidDate, noop, startOfDay } from '../util/helpers';
import { ViewMode } from './view-mode';
import { ZoomDirection } from '../util/zoom.animation';

@Component({
  selector: 'skm-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss', '../datepicker.shared.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: DatepickerComponent, multi: true},
  ],
})
export class DatepickerComponent implements ControlValueAccessor, OnChanges, OnInit {
  @Input()
  set date(dirtyDate: Date) {
    const date = startOfDay(dirtyDate);
    if (date.getTime() !== this.selectedTimestamp) {
      this.selectedTimestamp = isValidDate(date) ? date.getTime() : undefined;
      if (typeof this.selectedTimestamp !== 'undefined') {
        this.initialTimestamp = this.selectedTimestamp;
        this.view = ViewMode.Days;
      }
    }
  }

  @Output() dateChange = new EventEmitter<Date>();

  @Input() min: Date;
  @Input() max: Date;

  @Input() deselectEnabled: boolean;

  @Input() dayFormat = 'd';
  @Input() monthFormat = 'MMM';
  @Input() yearFormat = 'y';
  @Input() headingFormat = 'MMMM y';
  @Input() firstWeekDay = WeekDay.Monday;

  @Input() dayLabels: string[];
  @Input() weekDayLabels: string[];
  @Input() monthLabels: string[];

  initialTimestamp: number;
  currentTimestamp: number;
  selectedTimestamp: number;

  zoomDirection: ZoomDirection;
  view = ViewMode.Days;
  readonly ViewMode = ViewMode;

  private onChange: (date: Date) => void = noop;
  private onTouched: () => void = noop;

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('min' in changes) {
      const date = startOfDay(this.min);
      this.min = isValidDate(date) ? date : undefined;
    }
    if ('max' in changes) {
      const date = startOfDay(this.max);
      this.max = isValidDate(date) ? date : undefined;
    }
  }

  ngOnInit(): void {
    this.currentTimestamp = startOfDay(new Date()).getTime();
    this.initialTimestamp = this.selectedTimestamp || this.currentTimestamp;
  }

  selectDay(timestamp: number | undefined): void {
    this.selectedTimestamp = timestamp;
    const date = (typeof timestamp !== 'undefined') ? new Date(timestamp) : undefined;
    this.onChange(date);
    this.dateChange.emit(date);
  }

  switchView(timestamp: number, view: ViewMode, direction: ZoomDirection) {
    this.zoomDirection = direction;
    setTimeout(() => {
      this.initialTimestamp = timestamp;
      this.view = view;
      this.cd.markForCheck();
    });
  }

  // ControlValueAccessor implementation

  writeValue(obj: any): void {
    this.date = obj;
    this.cd.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
    // TODO implement
  }

  setDisabledState(isDisabled: boolean): void {
    // TODO implement
    this.cd.markForCheck();
  }

}
