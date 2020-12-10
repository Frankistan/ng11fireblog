import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProfileService } from '@app/services/profile.service';
import { User } from '@app/models/user';
import { takeUntil, map, tap } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { FileService } from '@app/services/file.service';
import { ConfirmDialogComponent } from '@app/components/layout/dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@app/services/notification.service';
import { State, getAuthUser } from '@store/reducers/auth.reducer';
import { Store } from '@ngrx/store';
import { updateUser } from '@store/actions/profile.actions';

@Component({
	selector: 'app-profile-form',
	templateUrl: './profile-form.component.html',
	styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit {
	private destroy = new Subject<any>();

	form: FormGroup;
	user$: Observable<User>;
	showFields: boolean = false;
	hide: boolean = true;

	constructor(
		private profileService: ProfileService,
		private fileService: FileService,
		private dlg: MatDialog,
		private notify: NotificationService,
		private store: Store<State>
	) {
		this.form = profileService.form;
	}

	ngOnInit(): void {

		this.user$ = this.store.select(getAuthUser).pipe(
			tap(user =>{
				this.form.patchValue(user, { emitEvent: false });
			})
		);
		
	}

	togglePasswordFields() {
		this.showFields = !this.showFields;
	}

	save(user:User) {

		const data = {
			...user,
			...this.form.value,
		};

		this.store.dispatch(updateUser({user:data}));
	}

	openDeleteAvatarDlg(user,event) {
		event.preventDefault();

		let dialogRef = this.dlg.open(ConfirmDialogComponent, {
			data: { confirm: false, title: "dialog.delete_image.title", subtitle: "dialog.delete_image.subtitle" }
		});

		dialogRef
			.afterClosed()
			.pipe(
				map(result => {
					if (!result) return false;  // si pulsó fuera del dialogo
					return result.confirm;
				}),
				takeUntil(this.destroy))
			.subscribe(result => result ? this.deletePhotoURL(user) : false);
	}

	private async deletePhotoURL(user:User) {
		const photoURL = this.form.get('photoURL').value;

		if (photoURL.search("https://firebasestorage.googleapis.com") == 0) {
			await this.fileService.delete(photoURL);
			await this.profileService.update({ ...user, photoURL: "" });
			this.form.get('photoURL').setValue("");

		} else {
			await this.profileService.update({ ...user, photoURL: "" });
			this.form.get('photoURL').setValue("");
		}
	}

	ngOnDestroy(): void {
		this.destroy.next();
	}

}
