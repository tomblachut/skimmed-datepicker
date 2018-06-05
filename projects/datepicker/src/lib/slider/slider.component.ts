import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
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
export class SliderComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() prevDisabled = false;
  @Input() nextDisabled = false;

  @Output() slideDone = new EventEmitter<number>();
  notPanning = true;

  slideTrigger: AnimationTrigger;

  private wrapperWidth = 1;
  private panOffset = 0;
  private lastDoneEventToState: string | number;

  private readonly ngUnsubscribe$ = new Subject();
  private readonly easeOut = createEaseOut(1.3);

  constructor(private hostRef: ElementRef, private cd: ChangeDetectorRef, private zone: NgZone) {
    this.cd.detach();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changeSlideTrigger();
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      const host = this.hostRef.nativeElement;
      fromEvent(host, 'mousedown').pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => this.startPress());

      if ('Hammer' in window) {
        const hammer = new Hammer(host);

        fromEvent(hammer, 'panstart').pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => this.startPan());
        fromEvent(hammer, 'panmove').pipe(takeUntil(this.ngUnsubscribe$)).subscribe(e => this.pan(e));
        fromEvent(hammer, 'panend pancancel').pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => this.endPan());

        fromEvent(hammer, 'swiperight').pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => this.swipe(-1));
        fromEvent(hammer, 'swipeleft').pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => this.swipe(1));
      }
    });
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

  slide(direction: number): void {
    this.changeSlideTrigger();
    setTimeout(() => this.changeSlideTrigger(direction as -1 | 1));
  }

  private startPress(): void {
    this.notPanning = true;
  }

  private startPan(): void {
    this.notPanning = false;
    this.wrapperWidth = this.hostRef.nativeElement.offsetWidth;
  }

  private pan(event: any): void {
    const multiplier = (event.deltaX > 0 && this.prevDisabled || event.deltaX < 0 && this.nextDisabled) ? 0.1 : 1;
    const absOffset = Math.abs(event.deltaX / this.wrapperWidth);
    this.panOffset = Math.sign(event.deltaX) * this.easeOut(absOffset);
    this.changeSlideTrigger('panning', this.panOffset * multiplier);
  }

  private endPan(): void {
    if (Math.abs(this.panOffset) > 0.5) {
      this.changeSlideTrigger(-Math.sign(this.panOffset) as -1 | 1);
    } else if (this.slideTrigger.value === 'panning') {
      this.changeSlideTrigger();
    }
  }

  private swipe(direction: number): void {
    this.changeSlideTrigger(direction as -1 | 1);
  }

  private changeSlideTrigger(value: 'panning' | 'idle' | -1 | 1 = 'idle', offset = 0): void {
    this.slideTrigger = {
      value: (value === -1 && this.prevDisabled || value === 1 && this.nextDisabled) ? 'idle' : value,
      params: {x: offset * 100},
    };
    this.cd.detectChanges();
  }

}
