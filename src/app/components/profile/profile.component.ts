import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../layout/dialogs/confirm-dialog/confirm-dialog.component';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { UploadDialogComponent } from '../layout/dialogs/upload-dialog/upload-dialog.component';
import { User } from '@app/models/user';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Store } from '@ngrx/store';
import { State } from '@store/reducers/app.reducer';
import { getAuthUser } from '@store/reducers/auth.reducer';
import { ProfileService } from '@app/services/profile.service';
import { updateUser } from '@store/actions/profile.actions';


@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnDestroy {
	private destroy = new Subject<any>();

	changed: boolean = false; //TODO: CAMBIAR A FALSE TRAS LAS PRUEBAS
	saved: boolean = false;
	user$: Observable<User>;

	constructor(
		private dlg: MatDialog,
		private breakpointObserver: BreakpointObserver,
		private profileService: ProfileService,
		private store: Store<State>,
	) {
		this.user$ = this.store.select(getAuthUser);
	}

	get isMobile$(): Observable<boolean> {
		return this.breakpointObserver.observe(Breakpoints.XSmall)
			.pipe(map(result => result.matches));
	}


	openUploadDlg(user: User): void {
		let dialogRef = this.dlg.open(UploadDialogComponent, {
			data: {
				confirm: false,
				title: "dialog.avatar.title",
				url: ''
			}
		});

		dialogRef
			.afterClosed()
			.pipe(
				map(result => {
					if (!result) return false;  // si pulsó fuera del dialogo
					return result;
				}),
				takeUntil(this.destroy)
			)
			.subscribe(result => {
				if (result) {

					const data:User = {
						...user,
						photoURL: result.url
					};
					
					this.store.dispatch(updateUser({user:data}));

				}
			});
	}

	canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
		if (this.changed && !this.saved) {
			return this.opendDiscardDlg();
		} else {
			//TODO: ACTIVAR EL LOADING.
			// this._core.isLoading.next(true);
			return true;
		}
	}

	private opendDiscardDlg(): Observable<boolean> {
		let dialogRef = this.dlg.open(ConfirmDialogComponent, {
			data: { confirm: false, title: "dialog.discard_changes" }
		});

		return dialogRef
			.afterClosed()
			.pipe(
				map(result => {
					if (!result) return false;  // si pulsó fuera del dialogo
					return result.confirm;
				}),
				takeUntil(this.destroy)
			);
	}

	ngOnDestroy(): void {
		this.destroy.next();
	}
}
