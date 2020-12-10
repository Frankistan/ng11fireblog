import { trigger,  animate, transition, style, query, stagger } from '@angular/animations';

export const slideUpFadeIn =
    trigger('slideUpFadeIn', [
        transition(':enter', [
            query('span', style({ transform: 'translateY(50px)', opacity: 0 })),
            query('span', [
                stagger(100, [
                    animate('800ms cubic-bezier(.35,0,.25,1)', style({ transform: 'translateY(0px)', opacity: 1 }))
                ])
            ])
        ]),
    ]);
