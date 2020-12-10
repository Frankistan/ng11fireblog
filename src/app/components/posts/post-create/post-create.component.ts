import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
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
import { PostFormComponent } from '../post-form.component';

@Component({
	selector: 'app-post-create',
	templateUrl: './post-create.component.html',
	styleUrls: ['./post-create.component.scss'],
})
export class PostCreateComponent extends PostFormComponent {

	user$: Observable<User>;

	constructor(
		i18n: I18nService,
		postsService: PostsService,
		dlg: MatDialog,
		zone: NgZone,
		store: Store<State>,
		private notify: NotificationService,
		private auth: AuthService,
	) {
		super(i18n, postsService, dlg, zone, store);
		
		this.user$ = this.auth.user;
	}

	ngOnInit(): void {

		this.disabled$ = this.form.valueChanges
			.pipe(
				tap(changes => console.log('CHANGES: ', changes)),
				tap(changes => this.changed = changes.id == "" ? false : true),
				map(changes => this.zone.run(() =>
					changes.content == "" || this.form.status == "INVALID" ? true : false)));

		this.store.select(getPostSavedState)
			.pipe(takeUntil(this.destroy))
			.subscribe(state => this.saved = state);
	}

	save(user: User) {

		if (this.form.get('content').value == "") {
			this.notify.open("toast.post.empty", "toast.close");
			return;
		}

		const post: Post = {
			...this.form.value,
			uid: user.uid,
			author: {
				uid: user.uid,
				displayName: user.displayName
			},
			authorName: user.displayName,
			createdAt: null
		};

		this.store.dispatch(createPost({ post }));
	}

}
