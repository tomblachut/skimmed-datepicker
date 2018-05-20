import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { createEaseOut } from '../util/helpers';

@Component({
  selector: 'skm-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss', '../shared.scss'],
})
export class SliderComponent implements OnInit {
  @Output() slideDone = new EventEmitter<number>();

  notPanning = true;

  get sliderStyles() {
    return {
      transition: this.tilt || this.springingBack ? `transform ${this.transitionDuration}ms` : '',
      transform: `translateX(${(-this.tilt + this.panOffset) * 100}%)`,
    };
  }

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
    this.notPanning = true;
  }

  startPan(wrapperWidth: number) {
    this.notPanning = false;
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
      this.slideDone.emit(direction);
      this.tilt = 0;
      this.moving = false;
    }, this.transitionDuration);
  }

}
