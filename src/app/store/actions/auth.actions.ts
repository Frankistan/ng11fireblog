
import { createAction, props } from '@ngrx/store';
import { User } from '@app/models/user';

export enum AuthActionType {
	LOGIN = '[Auth] LOGIN',
	LOGIN_SUCCESS = '[Auth] LOGIN_SUCCESS',
	LOGIN_FAILURE = '[Auth] LOGIN_FAILURE',
	SIGNUP = '[Auth] SIGNUP',
	SIGNUP_SUCCESS = '[Auth] SIGNUP_SUCCESS',
	SIGNUP_FAILURE = '[Auth] SIGNUP_FAILURE',
	RESET_PASSWORD = '[Auth] RESET_PASSWORD',
	RESET_PASSWORD_SUCCESS = '[Auth] RESET_PASSWORD_SUCCESS',
	RESET_PASSWORD_FAILURE = '[Auth] RESET_PASSWORD_FAILURE',
	CONFIRM_PASSWORD_RESET = '[Auth] CONFIRM_PASSWORD_RESET',
	CONFIRM_PASSWORD_RESET_SUCCESS = '[Auth] CONFIRM_PASSWORD_RESET_SUCCESS',
	CONFIRM_PASSWORD_RESET_FAILURE = '[Auth] CONFIRM_PASSWORD_RESET_FAILURE',
	CONFIRM_EMAIL = '[Auth] CONFIRM_EMAIL',
	CONFIRM_EMAIL_SUCCESS = '[Auth] CONFIRM_EMAIL_SUCCESS',
	CONFIRM_EMAIL_FAILURE = '[Auth] CONFIRM_EMAIL_FAILURE',
	LOGOUT = '[Auth] LOGOUT',
	LOGOUT_SUCCESS = '[Auth] LOGOUT_SUCCESS',
	LOGOUT_FAILURE = '[Auth] LOGOUT_FAILURE',
	GET_USER = "[Auth] GET USER",
	SET_USER = "[Auth] SET USER",
};

export const setUser = createAction(
	AuthActionType.SET_USER,
	props<{ user: User }>()
);

export const getUser = createAction(
	AuthActionType.GET_USER
);
//**************************************************** */
export const login = createAction(
	AuthActionType.LOGIN,
	props<{ credentials: { email: string; password: string; } }>()
);

export const loginSuccess = createAction(
	AuthActionType.LOGIN_SUCCESS
);

export const loginFailure = createAction(
	AuthActionType.LOGIN_FAILURE,
	props<{ error: any }>()
);
//**************************************************** */
export const logout = createAction(
	AuthActionType.LOGOUT
);

export const logoutSuccess= createAction(
	AuthActionType.LOGOUT_SUCCESS,
	
);

export const logoutFailure = createAction(
	AuthActionType.LOGOUT_FAILURE,
	props<{ error: any }>()
);
//**************************************************** */
export const register = createAction(
	AuthActionType.SIGNUP,
	props<{ user:User }>()
);

export const registerSuccess = createAction(
	AuthActionType.SIGNUP_SUCCESS,
);

export const registerFailure = createAction(
	AuthActionType.SIGNUP_FAILURE,
	props<{ error: any }>()
);
//**************************************************** */
export const resetPassword = createAction(
	AuthActionType.RESET_PASSWORD,
	props<{ email:string }>()
);

export const resetPasswordSuccess = createAction(
	AuthActionType.RESET_PASSWORD_SUCCESS
);

export const resetPasswordFailure = createAction(
	AuthActionType.RESET_PASSWORD_FAILURE,
	props<{ error: any }>()
);
//**************************************************** */
export const confirmPasswordReset = createAction(
	AuthActionType.CONFIRM_PASSWORD_RESET,
	props<{ code:string, password:string }>()
);

export const confirmPasswordResetSuccess = createAction(
	AuthActionType.CONFIRM_PASSWORD_RESET_SUCCESS
);

export const confirmPasswordResetFailure = createAction(
	AuthActionType.CONFIRM_PASSWORD_RESET_FAILURE,
	props<{ error: any }>()
);
//**************************************************** */
export const confirmEmail = createAction(
	AuthActionType.CONFIRM_EMAIL,
	props<{ code:string }>()
);

export const confirmEmailSuccess = createAction(
	AuthActionType.CONFIRM_EMAIL_SUCCESS
);

export const confirmEmailFailure = createAction(
	AuthActionType.CONFIRM_EMAIL_FAILURE,
	props<{ error: any }>()
);

