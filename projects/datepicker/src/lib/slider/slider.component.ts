import { Component, EventEmitter, Output } from '@angular/core';
import { createEaseOut } from '../util/helpers';
import { AnimationEvent } from '@angular/animations';
import { slide } from './slide.animation';

@Component({
  selector: 'skm-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  animations: [slide(150)],
})
export class SliderComponent {
  @Output() slideDone = new EventEmitter<number>();
  notPanning = true;

  slideTrigger;

  private easeOut = createEaseOut(1.3);
  private wrapperWidth = 1;
  private swipeAllowed = true;
  private panOffset = 0;

  constructor() {
    this.changeSlide('rest');
  }

  startPress(): void {
    this.notPanning = true;
  }

  startPan(wrapperWidth: number): void {
    this.notPanning = false;
    this.swipeAllowed = true;
    this.wrapperWidth = wrapperWidth;
  }

  pan(event: any): void {
    const absOffset = Math.abs(event.deltaX / this.wrapperWidth);
    this.panOffset = Math.sign(event.deltaX) * this.easeOut(absOffset);
    this.changeSlide('pan', this.panOffset);
  }

  endPan(): void {
    if (Math.abs(this.panOffset) > 0.5) {
      this.scrollPanes(-Math.sign(this.panOffset));
      this.swipeAllowed = false;
    } else {
      this.changeSlide('rest');
    }
  }

  swipe(direction: number): void {
    // if (this.swipeAllowed) {
    //   console.log('swipe');
    // }
    this.scrollPanes(direction);
  }

  scrollPanes(direction: number): void {
    this.changeSlide(direction > 0 ? 'tiltRight' : 'tiltLeft');
  }

  done(event: AnimationEvent): void {
    // console.log(event.fromState, '=>', event.toState);
    if (event.toState === 'tiltRight') {
      this.slideDone.emit(1);
      this.changeSlide('rest');
    } else if (event.toState === 'tiltLeft') {
      this.slideDone.emit(-1);
      this.changeSlide('rest');
    }
  }

  private changeSlide(value: 'pan' | 'rest' | 'tiltRight' | 'tiltLeft', offset = 0): void {
    this.slideTrigger = {
      value: value,
      params: {x: offset * 100},
    };
  }

}
