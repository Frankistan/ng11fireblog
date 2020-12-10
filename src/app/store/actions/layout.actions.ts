
import { createAction, props } from '@ngrx/store';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';

export enum LayoutActionType {
	Init = '[Layout] Init',
	SetDrawer = '[Layout] Set Drawer',
	SetSidenavContent = '[Layout] Set SidenavContent',
	SetFilterNav = '[Layout] Set FilterNav',
}

export const init = createAction(
	LayoutActionType.Init,
	props<any>()
);

export const setDrawer = createAction(
	LayoutActionType.SetDrawer,
	props<{drawer:any}>()
);

export const setSidenavContent = createAction(
	LayoutActionType.SetSidenavContent,
	props<{ sidenavContent: any }>()
);

export const setFilterNav = createAction(
	LayoutActionType.SetFilterNav,
	props<{ filterNavRef: any }>()
);
