import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '@app/models/user';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { scaleAnimation } from '@app/animations/scale.animation';
import { Store } from '@ngrx/store';
import { State } from '@store/reducers/app.reducer';
import { getAuthUser } from '@store/reducers/auth.reducer';

@Component({
	selector: 'app-sidenav-toolbar',
	templateUrl: './sidenav-toolbar.component.html',
	styleUrls: ['./sidenav-toolbar.component.scss'],
	animations: [
		[
			trigger('fadeInOut', [
				state('in', style({ opacity: 1, transform: 'translateY(0)' })),
				transition('void => *', [
					style({ opacity: 0, transform: 'translateY(100%)' }),
					animate(200)
				]),
				transition('* => void', [
					animate(200, style({ opacity: 0, transform: 'translateY(100%)' }))
				])
			])
		]
		, scaleAnimation]
})
export class SidenavToolbarComponent {

	user$: Observable<User>;

	constructor(private store: Store<State>) {
		this.user$ = this.store.select(getAuthUser);
	}
}
