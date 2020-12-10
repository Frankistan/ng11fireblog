import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { AuthService } from '@app/services/auth.service';
import { NotificationService } from '@app/services/notification.service';
import { ProfileService } from '@app/services/profile.service';
import { FirebaseErrors } from '@app/models/firebase-errors';
import * as fromAuthActions from '../actions/auth.actions';
import * as fromProfileActions from '../actions/profile.actions';
import { from, of } from 'rxjs';
import { map, switchMap, mergeMap, tap, catchError } from 'rxjs/operators';


@Injectable()
export class AuthEffects {
	constructor(
		private actions$: Actions,
		private auth: AuthService,
		private router: Router,
		private notify: NotificationService,
		private profileService: ProfileService,
	) { }

	onLogin = createEffect(() => this.actions$.pipe(
		ofType(fromAuthActions.AuthActionType.LOGIN),
		switchMap(credentials => from(this.auth.login(credentials))
			.pipe(
				map(_ => fromAuthActions.loginSuccess()),
				catchError(error => of(fromAuthActions.loginFailure({ error })))
			))
	));

	onLoginSuccess = createEffect(() => this.actions$.pipe(
		ofType(fromAuthActions.AuthActionType.LOGIN_SUCCESS),
		map(_ => fromAuthActions.getUser()),
		tap(_ => {
			this.notify.open("toast.auth.login");
			this.router.navigate(['/posts']);
		})
	));

	onLoginFailure = createEffect(() => this.actions$.pipe(
		ofType(fromAuthActions.AuthActionType.LOGIN_FAILURE),
		tap((error: any) => {
			const errorMessage = FirebaseErrors.Parse(error.error.code);
			this.notify.open(errorMessage, "close", 4000);
		})
	),
		{ dispatch: false }
	);
	//************************************************************************ */
	onLogout = createEffect(() => this.actions$.pipe(
		ofType(fromAuthActions.AuthActionType.LOGOUT),
		switchMap(_ => from(this.auth.logout()).pipe(
			map(_ => fromAuthActions.logoutSuccess()),
			catchError(error => of(fromAuthActions.logoutFailure({ error })))
		))
	));

	onLogoutSuccess = createEffect(() => this.actions$.pipe(
		ofType(fromAuthActions.AuthActionType.LOGOUT_SUCCESS),
		tap(_ => this.router.navigate(["/auth/login"]))
	),
		{ dispatch: false }
	);

	onLogoutFailure = createEffect(() => this.actions$.pipe(
		ofType(fromAuthActions.AuthActionType.LOGOUT_FAILURE),
		tap((error: any) => {
			const errorMessage = FirebaseErrors.Parse(error.error.code);
			this.notify.open(errorMessage, "close", 4000);
		})
	),
		{ dispatch: false }
	);
	//************************************************************************ */
	onSetUser = createEffect(() => this.actions$.pipe(
		ofType(fromAuthActions.AuthActionType.GET_USER),
		switchMap(_ => this.auth.user
			.pipe(
				map(user => fromAuthActions.setUser({ user }))
			))
	));
	//************************************************************************ */
	onRegister = createEffect(() => this.actions$.pipe(
		ofType(fromAuthActions.AuthActionType.SIGNUP),
		map(payload => payload['user']),
		switchMap(user => from(this.auth.signup(user))
			.pipe(
				map(_ => fromAuthActions.registerSuccess()),
				catchError(error => of(fromAuthActions.registerFailure({ error })))
			))
	));

	onRegisterSuccess = createEffect(() => this.actions$.pipe(
		ofType(fromAuthActions.AuthActionType.SIGNUP_SUCCESS),
		tap(_ => {
			this.notify.open("toast.auth.signup", "", 2000);
			this.router.navigate(["/auth/login"]);
		})
	),
		{ dispatch: false }
	);

	onRegisterFailure = createEffect(() => this.actions$.pipe(
		ofType(fromAuthActions.AuthActionType.SIGNUP_FAILURE),
		tap((error: any) => {
			console.log('error: ', error);
			const errorMessage = FirebaseErrors.Parse(error.error.code);
			this.notify.open(errorMessage, "close", 4000);
		})
	),
		{ dispatch: false }
	);
	//************************************************************************ */
	onResetPassword = createEffect(() => this.actions$.pipe(
		ofType(fromAuthActions.AuthActionType.RESET_PASSWORD),
		map(payload => payload['email']),
		switchMap(email => from(this.auth.resetPassword(email))
			.pipe(
				map(_ => fromAuthActions.resetPasswordSuccess()),
				catchError(error => of(fromAuthActions.resetPasswordFailure({ error })))
			))
	));

	onResetPasswordSuccess = createEffect(() => this.actions$.pipe(
		ofType(fromAuthActions.AuthActionType.RESET_PASSWORD_SUCCESS),
		tap(_ => {
			this.notify.open("Te hemos enviado un email con instrucciones", "toast.close", 4000);
		})
	),
		{ dispatch: false }
	);

	onResetPasswordFailure = createEffect(() => this.actions$.pipe(
		ofType(fromAuthActions.AuthActionType.RESET_PASSWORD_FAILURE),
		tap((error: any) => {
			console.log('error: ', error);
			const errorMessage = FirebaseErrors.Parse(error.error.code);
			this.notify.open(errorMessage, "close", 4000);
		})
	),
		{ dispatch: false }
	);
	//************************************************************************ */
	onConfirmPasswordReset = createEffect(() => this.actions$.pipe(
		ofType(fromAuthActions.AuthActionType.CONFIRM_PASSWORD_RESET),
		switchMap(payload => from(this.auth.confirmPasswordReset(payload['code'], payload['password']))
			.pipe(
				map(_ => fromAuthActions.confirmPasswordResetSuccess()),
				catchError(error => of(fromAuthActions.confirmPasswordResetFailure({ error })))
			))
	));

	onConfirmPasswordResetSuccess = createEffect(() => this.actions$.pipe(
		ofType(fromAuthActions.AuthActionType.CONFIRM_PASSWORD_RESET_SUCCESS),
		tap(_ => {
			this.notify.open("toast.auth.password-changed", "", 2000);
			this.router.navigate(['auth/login']);
		})
	),
		{ dispatch: false }
	);

	onConfirmPasswordResetFailure = createEffect(() => this.actions$.pipe(
		ofType(fromAuthActions.AuthActionType.CONFIRM_PASSWORD_RESET_FAILURE),
		tap((error: any) => {
			console.log('error: ', error);
			const errorMessage = FirebaseErrors.Parse(error.error.code);
			this.notify.open(errorMessage, "close", 4000);
		})
	),
		{ dispatch: false }
	);
	//************************************************************************ */
	onConfirmEmail = createEffect(() => this.actions$.pipe(
		ofType(fromAuthActions.AuthActionType.CONFIRM_EMAIL),
		map(payload => payload['code']),
		switchMap(code => from(this.auth.confirmEmail(code))
			.pipe(
				map(_ => fromAuthActions.confirmEmailSuccess()),
				catchError(error => of(fromAuthActions.confirmEmailFailure({ error })))
			))
	));

	onConfirmEmailSuccess = createEffect(() => this.actions$.pipe(
		ofType(fromAuthActions.AuthActionType.CONFIRM_EMAIL_SUCCESS),
		tap(_ => {
			this.notify.open("toast.auth.email_confirmed", "close", 2000);
		})
	),
		{ dispatch: false }
	);

	onConfirmEmailFailure = createEffect(() => this.actions$.pipe(
		ofType(fromAuthActions.AuthActionType.CONFIRM_EMAIL_FAILURE),
		tap((error: any) => {
			console.log('error: ', error);
			const errorMessage = FirebaseErrors.Parse(error.error.code);
			this.notify.open(errorMessage, "close", 4000);
		})
	),
		{ dispatch: false }
	);

}