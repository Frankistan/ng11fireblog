
import { Action, createReducer, on, createSelector, createFeatureSelector } from '@ngrx/store';
import * as authActions from './../actions/auth.actions';
import { User } from '@app/models/user';

export interface State {
	isAuthenticated: boolean;
	user: User | null;
	error: any;
	loading: boolean;
}

export const initialState: State = {
	isAuthenticated: false,
	user: null,
	error: null,
	loading: false
};

const authReducer = createReducer(
	initialState,
	on(authActions.login, state => ({

		...state,
		loading: true,
		error: null

	})),
	on(authActions.loginSuccess, state => ({

		...state,
		loading: false,
		error: null

	})),

	on(authActions.loginFailure, (state, { error }) => {
		return ({

			...state,
			isAuthenticated: false,
			user: null,
			error: { ...error },
			loading: false

		})
	}),
	on(authActions.setUser, (state, { user }) => ({

		...state,
		isAuthenticated:  user && user.emailVerified ? true : false,
		user: { ...user },
		loading: false

	})),
	// on(authActions.select, (state, { selectedAppId }) => {
	// 	return ({
	// 		...state,
	// 		selectedAppId
	// 	});
	// })
);

export function reducer(state: State | undefined, action: Action) {
	return authReducer(state, action);
}

export const getAuthState = createFeatureSelector<State>('auth');

export const getIsAuth =
	createSelector(getAuthState, (state: State) => state.isAuthenticated);

export const getAuthUser =
	createSelector(getAuthState, (state: State) => state.user);