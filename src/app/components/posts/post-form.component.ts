import { Component, OnInit, NgZone, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { I18nService } from '@app/services/i18n.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, tap, takeUntil } from 'rxjs/operators';
import { PostsService } from '@app/services/posts.service';
import { Post } from '@app/models/post';
import { Observable, Subject } from 'rxjs';
import { ConfirmDialogComponent } from '@app/components/layout/dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@app/services/auth.service';
import { User } from '@app/models/user';
import { NotificationService } from '@app/services/notification.service';
import { State } from '@store/reducers/app.reducer';
import { Store } from '@ngrx/store';
import { createPost } from '@store/actions/post.actions';
import { getPostSavedState } from '@app/store/reducers/posts.reducer';

@Component({
    template: ''
})
export abstract class PostFormComponent implements OnInit, OnDestroy, AfterViewInit {
	destroy = new Subject<any>();

	form: FormGroup;
	changed: boolean = false;
	saved: boolean = false;
	disabled$: Observable<boolean>;

	// tinyMCE editor
	options: any = {
		'language': this.i18n.language
	};

	//chips
	selectable = true;
	removable = true;
	addOnBlur = true;

	constructor(
		public i18n: I18nService,
		private postsService: PostsService,
		private dlg: MatDialog,
		public zone: NgZone,
		public store: Store<State>,
	) {
		this.form = this.postsService.form;
		this.store.select(getPostSavedState)
			.pipe(
				tap(state => console.log('SAVED: ?', state)),
				takeUntil(this.destroy))
			.subscribe(state => this.saved = state);
	}

	ngOnInit(): void {


	}

	get tags(): FormArray {
		return <FormArray>this.form.get('tags');
	}

	addTag(event: MatChipInputEvent): void {
		const input = event.input;
		const value = event.value;

		// Add our requirement
		if ((value || '').trim()) {
			this.tags.push(new FormControl(value.trim()));
		}

		// Reset the input value
		if (input) {
			input.value = '';
		}
	}

	removeTag(index: number): void {

		if (index >= 0) {
			this.tags.removeAt(index);
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
				})
			);
	}

	canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
		if (this.changed && !this.saved) {
			return this.opendDiscardDlg();
		} else {
			// this._core.isLoading.next(true);
			return true;
		}
	}

	ngOnDestroy(): void {
		this.destroy.next();
	}

	ngAfterViewInit(): void {
		this.disabled$ = this.form.valueChanges
			.pipe(
				tap(_ => this.changed = true),
				map(changes => this.zone.run(() =>
					changes.content == "" || this.form.status == "INVALID" ? true : false)));
	}
}
