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
  private panOffset = 0;

  constructor() {
    this.changeSlideTrigger('rest');
  }

  startPress(): void {
    this.notPanning = true;
  }

  startPan(wrapperWidth: number): void {
    this.notPanning = false;
    this.wrapperWidth = wrapperWidth;
  }

  pan(event: any): void {
    const absOffset = Math.abs(event.deltaX / this.wrapperWidth);
    this.panOffset = Math.sign(event.deltaX) * this.easeOut(absOffset);
    this.changeSlideTrigger('pan', this.panOffset);
  }

  endPan(): void {
    if (Math.abs(this.panOffset) > 0.5) {
      this.scrollSlider(-Math.sign(this.panOffset));
    } else {
      this.changeSlideTrigger();
    }
  }

  clickPagination(direction: number): void {
    this.changeSlideTrigger();
    setTimeout(() => this.scrollSlider(direction));
  }

  scrollSlider(direction: number): void {
    this.changeSlideTrigger(direction > 0 ? 'tiltRight' : 'tiltLeft');
  }

  done(event: AnimationEvent): void {
    if (event.toState === 'tiltRight') {
      this.slideDone.emit(1);
      this.changeSlideTrigger();
    } else if (event.toState === 'tiltLeft') {
      this.slideDone.emit(-1);
      this.changeSlideTrigger();
    }
  }

  private changeSlideTrigger(value: 'pan' | 'rest' | 'tiltRight' | 'tiltLeft' = 'rest', offset = 0): void {
    this.slideTrigger = {
      value: value,
      params: {x: offset * 100},
    };
  }

}
