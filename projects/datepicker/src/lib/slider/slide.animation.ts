import { animate, state, style, transition, trigger } from '@angular/animations';

// transition(':increment', animate(timing, style({
//   transform: 'translateX({{x}}%)',
// }))),

export const slide = (timing: number | string) => trigger('slide', [
  state('pan', style({
    transform: 'translateX({{x}}%)',
  }), {params: {x: 0}}),
  transition('* => tiltRight', animate(timing, style({
    transform: 'translateX(-100%)',
  }))),
  transition('* => tiltLeft', animate(timing, style({
    transform: 'translateX(100%)',
  }))),
  transition('pan => rest', animate(timing)),
]);
