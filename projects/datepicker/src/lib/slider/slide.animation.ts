import { animate, AnimationTriggerMetadata, state, style, transition, trigger } from '@angular/animations';

export function slide(timing: number | string = 150): AnimationTriggerMetadata {
  return trigger('slide', [
    state('panning', style({
      transform: 'translateX({{x}}%)',
    }), {params: {x: 0}}),
    transition('* => 1', animate(timing, style({
      transform: 'translateX(-100%)',
    }))),
    transition('* => -1', animate(timing, style({
      transform: 'translateX(100%)',
    }))),
    transition('panning => idle', animate(timing)),
  ]);
}
