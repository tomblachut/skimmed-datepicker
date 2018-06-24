import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  LOCALE_ID,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormStyle, getLocaleDayNames, TranslationWidth, WeekDay } from '@angular/common';
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
  @Input() set date(dirtyDate: Date | number) {
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

  @Input() set min(dirtyDate: Date | number) {
    const date = startOfDay(dirtyDate);
    this.minTimestamp = isValidDate(date) ? date.valueOf() : undefined;
  }

  @Input() set max(dirtyDate: Date | number) {
    const date = startOfDay(dirtyDate);
    this.maxTimestamp = isValidDate(date) ? date.valueOf() : undefined;
  }

  @Input() deselectEnabled: boolean;

  @Input() dayFormat = 'd';
  @Input() monthFormat = 'MMM';
  @Input() yearFormat = 'y';
  @Input() headingFormat = 'MMMM y';
  @Input() weekStart = WeekDay.Monday;

  @Input() dayLabels: string[];
  @Input() weekDayLabels: string[];
  @Input() monthLabels: string[];

  initialTimestamp: number;
  currentTimestamp: number;
  selectedTimestamp: number;
  minTimestamp: number;
  maxTimestamp: number;

  zoomDirection: ZoomDirection;
  view = ViewMode.Days;
  readonly ViewMode = ViewMode;

  private onChange: (date: Date) => void = noop;
  private onTouched: () => void = noop;

  constructor(private cd: ChangeDetectorRef, @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('weekDayLabels' in changes) {
      this.weekDayLabels = this.weekDayLabels || getLocaleDayNames(this.locale, FormStyle.Standalone, TranslationWidth.Abbreviated);
    }
  }

  ngOnInit(): void {
    this.currentTimestamp = startOfDay(new Date()).getTime();
    this.initialTimestamp = this.selectedTimestamp || this.currentTimestamp;
    this.weekDayLabels = this.weekDayLabels || getLocaleDayNames(this.locale, FormStyle.Standalone, TranslationWidth.Abbreviated);
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
