import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { createEaseOut } from '../util/helpers';
import { AnimationEvent } from '@angular/animations';
import { slide } from './slide.animation';

@Component({
  selector: 'skm-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss', '../datepicker.shared.scss'],
  animations: [slide()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent {
  @Output() slideDone = new EventEmitter<number>();
  notPanning = true;

  slideTrigger: object;

  private easeOut = createEaseOut(1.3);
  private wrapperWidth = 1;
  private panOffset = 0;

  private lastDoneEventToState: string | number;

  constructor(private cd: ChangeDetectorRef) {
    this.changeSlideTrigger();
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
    this.changeSlideTrigger('panning', this.panOffset);
  }

  endPan(): void {
    if (Math.abs(this.panOffset) > 0.5) {
      this.changeSlideTrigger(-Math.sign(this.panOffset) as -1 | 1);
    } else {
      this.changeSlideTrigger();
    }
  }

  clickPagination(direction: number): void {
    this.changeSlideTrigger();
    setTimeout(() => {
      this.changeSlideTrigger(direction as -1 | 1);
      this.cd.markForCheck();
    });
  }

  swipe(direction: number): void {
    this.changeSlideTrigger(direction as -1 | 1);
  }

  done(event: AnimationEvent): void {
    if (event.toState === this.lastDoneEventToState) {
      // workaround for https://github.com/angular/angular/issues/24084
      return;
    }
    this.lastDoneEventToState = event.toState;
    if (typeof event.toState as string | number === 'number') {
      this.slideDone.emit(event.toState as any);
    }
  }

  private changeSlideTrigger(value: 'panning' | 'idle' | -1 | 1 = 'idle', offset = 0): void {
    this.slideTrigger = {
      value: value,
      params: {x: offset * 100},
    };
  }

}
