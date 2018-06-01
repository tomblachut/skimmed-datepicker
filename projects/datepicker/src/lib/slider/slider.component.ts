import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { createEaseOut } from '../util/helpers';
import { AnimationEvent } from '@angular/animations';
import { slide } from './slide.animation';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare class Hammer extends EventTarget {
  constructor(target: EventTarget);
}

export interface AnimationTrigger {
  value: string | number;
  params: { [p: string]: any };
}

@Component({
  selector: 'skm-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss', '../datepicker.shared.scss'],
  animations: [slide()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderComponent implements AfterViewInit, OnDestroy {
  @Output() slideDone = new EventEmitter<number>();
  notPanning = true;

  slideTrigger: AnimationTrigger;

  private wrapperWidth = 1;
  private panOffset = 0;
  private lastDoneEventToState: string | number;

  @ViewChild('wrapper') private wrapperRef: ElementRef;
  private readonly ngUnsubscribe$ = new Subject();
  private readonly easeOut = createEaseOut(1.3);

  constructor(private cd: ChangeDetectorRef) {
    this.changeSlideTrigger();
  }

  ngAfterViewInit(): void {
    if ('Hammer' in window) {
      const hammer = new Hammer(this.wrapperRef.nativeElement);

      fromEvent(hammer, 'panstart').pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => this.startPan());
      fromEvent(hammer, 'panmove').pipe(takeUntil(this.ngUnsubscribe$)).subscribe(e => this.pan(e));
      fromEvent(hammer, 'panend pancancel').pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => this.endPan());

      fromEvent(hammer, 'swiperight').pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => this.swipe(-1));
      fromEvent(hammer, 'swipeleft').pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => this.swipe(1));
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
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

  clickPagination(direction: number): void {
    this.changeSlideTrigger();
    setTimeout(() => {
      this.changeSlideTrigger(direction as -1 | 1);
      this.cd.detectChanges();
    });
  }

  startPress(): void {
    this.notPanning = true;
  }

  private startPan(): void {
    this.notPanning = false;
    this.wrapperWidth = this.wrapperRef.nativeElement.offsetWidth;
  }

  private pan(event: any): void {
    const absOffset = Math.abs(event.deltaX / this.wrapperWidth);
    this.panOffset = Math.sign(event.deltaX) * this.easeOut(absOffset);
    this.changeSlideTrigger('panning', this.panOffset);
    this.cd.detectChanges();
  }

  private endPan(): void {
    if (Math.abs(this.panOffset) > 0.5) {
      this.changeSlideTrigger(-Math.sign(this.panOffset) as -1 | 1);
      this.cd.detectChanges();
    } else if (this.slideTrigger.value === 'panning') {
      this.changeSlideTrigger();
      this.cd.detectChanges();
    }
  }

  private swipe(direction: number): void {
    this.changeSlideTrigger(direction as -1 | 1);
    this.cd.detectChanges();
  }

  private changeSlideTrigger(value: 'panning' | 'idle' | -1 | 1 = 'idle', offset = 0): void {
    this.slideTrigger = {
      value: value,
      params: {x: offset * 100},
    };
  }

}
