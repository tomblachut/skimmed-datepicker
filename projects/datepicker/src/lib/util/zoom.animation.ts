import { animate, AnimationTriggerMetadata, style, transition, trigger } from '@angular/animations';

export type ZoomDirection = 'in' | 'out';

const biggerStyle = style({
  transform: 'scale(0.8)',
  opacity: 0,
});

const smallerStyle = style({
  transform: 'scale(1.3)',
  opacity: 0,
});

export function zoom(timing: number | string = 175): AnimationTriggerMetadata {
  return trigger('zoom', [
    transition('void => in', [
      biggerStyle,
      animate(timing),
    ]),
    transition('void => out', [
      smallerStyle,
      animate(timing),
    ]),
    transition('in => void', [
      animate(timing, smallerStyle),
    ]),
    transition('out => void', [
      animate(timing, biggerStyle),
    ]),
  ]);
}
