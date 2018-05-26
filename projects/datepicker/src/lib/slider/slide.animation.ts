import { animate, state, style, transition, trigger } from '@angular/animations';

export const slide = (timing: number | string) => trigger('slide', [
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
