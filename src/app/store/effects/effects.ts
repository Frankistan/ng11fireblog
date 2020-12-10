
import { get } from 'lodash';
import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, switchMap, mergeMap } from 'rxjs/operators';

// import * as appActions from '../actions';
// import { AppManagementAPIService as DataService } from '../../../api';
// import { AppAdapter } from 'src/app/core/adapter';
// import { CommonService } from 'src/app/shared/services/common.service';
// import { DialogService } from 'src/app/shared/common/dialog/dialog.service';
// import { COMMON_ERRORS } from 'src/app/shared/services/error-handler.service';

@Injectable()
export class AppStoreEffects {
	constructor(
		// private dataService: DataService,
		// private actions$: Actions,
		// private commonService: CommonService,
		// private appAdapter: AppAdapter,
		// private dialogService: DialogService
	) { }

	// loadRequestEffect$ = createEffect(() =>
	// 	this.actions$.pipe(
	// 		ofType(appActions.load),
	// 		concatMap(() =>
	// 			this.dataService.searchApps()
	// 				.pipe(
	// 					map(items =>
	// 						appActions.loadSuccess({
	// 							apps: items.data.items.map(item => this.appAdapter.adapt(item))
	// 						})
	// 					),
	// 					catchError(error => of(appActions.actionFailure({ error })))
	// 				)
	// 		)
	// 	)
	// );

	// searchAppsEffect$ = createEffect(() => {
	// 	return this.actions$.pipe(
	// 		ofType(appActions.searchApps),
	// 		switchMap((action: any) => {
	// 			delete action.type;
	// 			return this.dataService.searchApps(action)
	// 				.pipe(
	// 					mergeMap(items => {
	// 						return [
	// 							appActions.loadSuccess({
	// 								apps: items ? items.data.items.map(item => this.appAdapter.adapt(item)) : []
	// 							}),
	// 							appActions.updateTotal({
	// 								total: items ? items.data.pagination.total : 0
	// 							})
	// 						];
	// 					}),
	// 					catchError(error => of(appActions.actionFailure({ error })))
	// 				);
	// 		})
	// 	);
	// });

	// createRequestEffect$ = createEffect(() =>
	// 	this.actions$.pipe(
	// 		ofType(appActions.createApp),
	// 		concatMap((action: any) =>
	// 			this.dataService.createApp(action.app)
	// 				.pipe(
	// 					map(response => {
	// 						action.ref.close();
	// 						this.commonService.formatDataResponse(response, true);
	// 						return appActions.actionSuccess({ msg: 'success' });
	// 					}),
	// 					catchError(error => of(appActions.actionFailure({ error })))
	// 				)
	// 		)
	// 	)
	// );

	// updateRequestEffect$ = createEffect(() =>
	// 	this.actions$.pipe(
	// 		ofType(appActions.updateApp),
	// 		concatMap((action: any) =>
	// 			this.dataService.updateApp(action.app)
	// 				.pipe(
	// 					map(response => {
	// 						action.ref.close();
	// 						this.commonService.formatDataResponse(response, true);
	// 						return appActions.actionSuccess({ msg: 'success' });
	// 					}),
	// 					catchError(error => {
	// 						return of(appActions.actionFailure({ error }));
	// 					})
	// 				)
	// 		)
	// 	)
	// );

	// actionFailureEffect$ = createEffect(() =>
	// 	this.actions$.pipe(
	// 		ofType(appActions.actionFailure),
	// 		map((action: any) => {
	// 			const errCode = get(action, 'error.status');
	// 			if (COMMON_ERRORS.indexOf(errCode) === -1) {
	// 				return this.dialogService.openWarningDialog(get(action, 'error.error.meta.message', 'Error Occurs!'));
	// 			}
	// 		})
	// 	),
	// 	{ dispatch: false }
	// );

	// refreshEffect$ = createEffect(() =>
	// 	this.actions$.pipe(
	// 		ofType(appActions.refresh),
	// 		map(_ => appActions.load())
	// 	)
	// );
}
