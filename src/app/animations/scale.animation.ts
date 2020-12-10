import { trigger, state, animate, transition, style, query, stagger } from '@angular/animations';

export const scaleAnimation =
    trigger('scaleAnimation', [

        transition('*=>*', [

            // styles at start of transition
            style({ opacity: 0, transform: 'scale(0.4)' }),

            // animation and styles at end of transition
            animate('0.8s cubic-bezier(.35,0,.25,1)', style({ opacity: 1, transform: 'scale(1.0)' }) )
        ]),
    ]);

// trigger('scaleAnimation', [
//     transition('* => *', [
//         query('img ,avatar', style({ opacity: 0, transform: 'scale(0.4)' })),
//         query('img, avatar', [
//             stagger(100, [
//                 animate('800ms cubic-bezier(.35,0,.25,1)', style({ opacity: 1, transform: 'scale(1.0)' }))
//             ])
//         ])
//     ]),
// ]);

export const scaleIn =
    trigger('scaleIn', [

        transition(':enter', [

            // styles at start of transition
            style({ opacity: 0, transform: 'scale(0.4)' }),

            // animation and styles at end of transition
            animate('0.3s cubic-bezier(.35,0,.25,1)', style({ opacity: 1, transform: 'scale(1.0)' }))
        ]),
    ]);

export const slideUp =
    trigger('slideUp', [

        transition(':enter', [

            // styles at start of transition
            style({ transform: 'translateY(100%)'}),

            // animation and styles at end of transition
            animate('0.3s cubic-bezier(.35,0,.25,1)', style({ transform: 'translateY(0%)' }))
        ]),
        transition(':leave', [
            animate('0.15s cubic-bezier(.35,0,.25,1)', style({ transform: 'translateY(100%)' }))
        ]),
    ]);
