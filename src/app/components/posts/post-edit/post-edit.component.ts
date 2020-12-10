import { Component, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { getSinglePost } from '@store/reducers/posts.reducer';
import { I18nService } from '@app/services/i18n.service';
import { NotificationService } from '@app/services/notification.service';
import { Observable } from 'rxjs';
import { Post } from '@app/models/post';
import { PostFormComponent } from '../post-form.component';
import { PostsService } from '@app/services/posts.service';
import { readPost, updatePost } from '@store/actions/post.actions';
import { State } from '@store/reducers/app.reducer';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';


// FUENTE: https://stackoverflow.com/questions/53483323/angular-2-material-mat-chip-list-formarray-validation/53850567
@Component({
	selector: 'app-post-edit',
	templateUrl: './post-edit.component.html',
	styleUrls: ['./post-edit.component.scss'],
})
export class PostEditComponent extends PostFormComponent {

	post$: Observable<Post>;

	constructor(
		i18n: I18nService,
		postsService: PostsService,
		dlg: MatDialog,
		zone: NgZone,
		store: Store<State>,
		private fb: FormBuilder,
		private notify: NotificationService,
		private route: ActivatedRoute,
	) {
		super(i18n, postsService, dlg, zone, store);

		const id = this.route.snapshot.params['id'];

		this.store.dispatch(readPost({ id }));
	}

	ngOnInit(): void {
		this.post$ = this.store.select(getSinglePost)
			.pipe(
				tap(post => {
					this.form.setControl('tags', this.fb.array(post?.tags || []));
					this.form.patchValue(
						post || {}
						, { emitEvent: false });

				})
			);
	}

	save(post: Post) {

		if (this.form.get('content').value == "") {
			this.notify.open("toast.post.empty", "toast.close");
			return;
		}

		post = {
			...post,
			...this.form.value
		};

		this.store.dispatch(updatePost({ post }));
	}
}
