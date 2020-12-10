import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@app/services/auth.service';
import { NotificationService } from '@app/services/notification.service';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
	constructor(
		private _auth: AuthService,
		private _rtr: Router,
		private _ntf: NotificationService,
	) { }

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this._auth.isAuthenticated.pipe(map<boolean, boolean>((isAuthenticated: boolean) => {
			if (isAuthenticated) {
				this._ntf.open('toast.logged_in', 'X', 1000);
				this._rtr.navigate(['/posts']);
			}
			return !isAuthenticated;
		}));
	}

}
