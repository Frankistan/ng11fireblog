import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { AuthService } from '@app/services/auth.service';
import { NotificationService } from '@app/services/notification.service';
import { ProfileService } from '@app/services/profile.service';
import { FirebaseErrors } from '@app/models/firebase-errors';
import * as fromProfileActions from '../actions/profile.actions';
import { map, switchMap, mergeMap, tap, catchError } from 'rxjs/operators';
import { from, of } from 'rxjs';


@Injectable()
export class ProfileEffects {
	constructor(
		private actions$: Actions,
		private auth: AuthService,
		private router: Router,
		private notify: NotificationService,
		private profileService: ProfileService,
	) { }

	onUpdateUser = createEffect(() => this.actions$.pipe(
		ofType(fromProfileActions.ProfileActionType.UPDATE_USER),
		map(payload => payload['user']),
		switchMap(user => from(this.profileService.update(user))
			.pipe(
				map(_ => fromProfileActions.updateUserSuccess()),
				catchError(error => of(fromProfileActions.updateUserFailure({ error })))
			))
	));

	onUpdateUserSuccess = createEffect(() => this.actions$.pipe(
		ofType(fromProfileActions.ProfileActionType.UPDATE_USER_SUCCESS),
		tap(_ => {
			this.notify.open("toast.profile", "toast.close");
		})
	),
		{ dispatch: false }
	);

	onUpdateUserFailure = createEffect(() => this.actions$.pipe(
		ofType(fromProfileActions.ProfileActionType.UPDATE_USER_FAILURE),
		tap((error: any) => {
			console.log('error: ', error);
			const errorMessage = FirebaseErrors.Parse(error.error.code);
			this.notify.open(errorMessage, "close", 4000);
		})
	),
		{ dispatch: false }
	);
	
	//************************************************************************ */
	

}