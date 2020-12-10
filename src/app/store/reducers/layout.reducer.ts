
import { Action, createReducer, on } from '@ngrx/store';
import * as layoutActions from '../actions/layout.actions';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';

export interface State {
	drawer: any;
	sidenavContent: MatSidenavContent;
	filterNavRef: any;
	loading: boolean;
}

export const initialState: State = {
	drawer: null,
	sidenavContent: null,
	filterNavRef: null,
	loading: false
};

const layoutReducer = createReducer(
	initialState,
	on(layoutActions.setDrawer, (state, drawer ) => {
		return { ...state, ...drawer };
	}),
	on(layoutActions.setSidenavContent, (state, { sidenavContent }) => {
		return { ...state, sidenavContent: sidenavContent };
	}),
	on(layoutActions.setFilterNav, (state, { filterNavRef }) => {
		return { ...state, filterNavRef: filterNavRef };
	}),

);

export function reducer(state: State | undefined, action: Action) {
	return layoutReducer(state, action);
}
