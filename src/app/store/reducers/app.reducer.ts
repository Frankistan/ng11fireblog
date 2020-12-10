import {
	ActionReducer,
	ActionReducerMap,
	createFeatureSelector,
	createSelector,
	MetaReducer
} from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from '@env/environment';
import { RouterStateUrl } from '@store/utils/custom-route-serializer';
import * as fromRouter from '@ngrx/router-store';
import * as fromAuth from './auth.reducer';
import * as fromPost from './posts.reducer';
import * as fromLayout from './layout.reducer';
import { routerReducer } from '@ngrx/router-store';

export interface State {
	layout: fromLayout.State,
	auth: fromAuth.State;
	router: fromRouter.RouterReducerState<RouterStateUrl>;
	posts: fromPost.State;
}

export const reducers: ActionReducerMap<State | any> = {
	layout: fromLayout.reducer,
	auth: fromAuth.reducer,
	posts: fromPost.reducer,
	router: routerReducer,
}

// SOLO EN DESAROLLO - quitar en produccion
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
	return function name(state: State, action: any): State {
		console.log('state: ', state);
		console.log('action: ', action);
		return reducer(state, action);
	}
}


export const metaReducers: MetaReducer<State>[] = !environment.production ? [logger, storeFreeze] : [];
// export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
