import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { I18nService } from '@app/services/i18n.service';
import { Post } from '@app/models/post';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { ConfirmDialogComponent } from '@app/components/layout/dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { State } from '@store/reducers/app.reducer';
import { Store } from '@ngrx/store';
import { getSinglePost } from '@store/reducers/posts.reducer';
import { readPost, deletePost } from '@store/actions/post.actions';

@Component({
	selector: 'app-post-show',
	templateUrl: './post-show.component.html',
	styleUrls: ['./post-show.component.scss'],
})
export class PostShowComponent implements OnInit, OnDestroy {
	private destroy = new Subject<any>();

	locale: string;

	placeholderImg = "https://dummyimage.com/250/200/f00/fff";
	post$: Observable<Post>;
  post: Post;

  createdAt: any;

	constructor(
		private route: ActivatedRoute,
		public sanitizer: DomSanitizer,
		private i18n: I18nService,
		private dlg: MatDialog,
		private store: Store<State>
	) {
		const id = this.route.snapshot.params['id'];

		this.store.dispatch(readPost({ id }));

		this.locale = this.i18n.language;
	}

	ngOnInit(): void {
    this.post$ = this.store.select(getSinglePost)
    .pipe(filter(post => post!=null),tap( post => this.createdAt = post.created_at *1000));
	}

	private async delete(post: Post) {
		this.store.dispatch(deletePost({post}));
	}

	openDeletePostDlg(post: Post) {
		let dialogRef = this.dlg.open(ConfirmDialogComponent, {
			data: { confirm: false, title: "dialog.delete_post.title", subtitle: "dialog.delete_post.subtitle" }
		});

		dialogRef
			.afterClosed()
			.pipe(
				map(result => {
					if (!result) return false;  // si pulsó fuera del dialogo
					return result.confirm;
				}),
				takeUntil(this.destroy))
			.subscribe(result => result ? this.delete(post) : false);
	}

	ngOnDestroy(): void {
		this.destroy.next();
	}

}
