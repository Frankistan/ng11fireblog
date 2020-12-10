import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CoreService } from '@app/services/core.service';

export interface CanComponentDeactivate {
	canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
	providedIn: 'root'
})
export class DiscardChangesGuard implements CanDeactivate<CanComponentDeactivate> {

	constructor(
		private _core: CoreService
	) { }

	canDeactivate(
		component: CanComponentDeactivate,
		currentRoute: ActivatedRouteSnapshot,
		currentState: RouterStateSnapshot,
		nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

		// TODO: quita el loading cuando salta el dialog
		// this._core.isLoading.next(false);
		return component.canDeactivate();
	}

}
