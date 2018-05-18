import { Component, Input, OnInit } from '@angular/core';
import { createEaseOut } from '../util/helpers';
import { Month } from '../util/month';
import { Weekday } from '../util/weekdays';
import { Pane } from '../datepicker.component';

@Component({
  selector: 'skm-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss', '../shared.scss'],
})
export class SliderComponent implements OnInit {
  @Input() firstWeekday: Weekday;

  @Input() panes: Array<Pane>;
  @Input() visiblePaneIndex: number;

  get sliderStyles() {
    return {
      transition: this.tilt || this.springingBack ? `transform ${this.transitionDuration}ms` : '',
      transform: `translateX(${(-this.tilt + this.panOffset) * 100}%)`,
    };
  }

  motionlessClick = true;

  private tilt = 0;

  private easeOut = createEaseOut(1.3);
  private transitionDuration = 150;
  private wrapperWidth = 1;

  private swipeAllowed = true;
  private panOffset = 0;
  private moving = false;
  private springingBack = false;

  constructor() {
  }

  ngOnInit() {
  }

  startPress() {
    this.motionlessClick = true;
  }

  startPan(wrapperWidth: number) {
    this.motionlessClick = false;
    this.swipeAllowed = true;
    this.springingBack = false;
    this.wrapperWidth = wrapperWidth;
  }

  pan(event: any) {
    const absOffset = Math.abs(event.deltaX / this.wrapperWidth);
    this.panOffset = Math.sign(event.deltaX) * this.easeOut(absOffset);
  }

  endPan() {
    if (Math.abs(this.panOffset) > 0.5) {
      this.scrollPanes(-Math.sign(this.panOffset));
      this.swipeAllowed = false;
    } else {
      this.springingBack = true;
      setTimeout(() => this.springingBack = false, this.transitionDuration);
    }
    this.panOffset = 0;
  }

  swipe(direction: number) {
    if (this.swipeAllowed) {
      this.scrollPanes(direction);
    }
  }

  scrollPanes(direction: number) {
    if (this.moving) {
      return;
    }
    this.moving = true;
    this.tilt = direction;

    setTimeout(() => {
      this.visiblePaneIndex = (3 + this.visiblePaneIndex + direction) % 3;
      const index = (3 + this.visiblePaneIndex + direction) % 3;
      const pane = this.panes[index];
      pane.month = Month.fromDate(pane.month.date, this.firstWeekday, 3 * direction);
      pane.order += 3 * direction;
      this.tilt = 0;
      this.moving = false;
    }, this.transitionDuration);
  }

}
