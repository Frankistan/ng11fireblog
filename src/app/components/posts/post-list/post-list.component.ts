import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Post } from '@app/models/post';
import { MatSidenavContent } from '@angular/material/sidenav';
import { PaginatorService, PageInit } from '@app/services/paginator.service';
import { CoreService } from '@app/services/core.service';
import { takeUntil, map, tap } from 'rxjs/operators';
import { State } from '@store/reducers/app.reducer';
import { Store } from '@ngrx/store';
import { loadPosts, loadMorePosts } from '@store/actions/post.actions';
import { getPosts, getPostsLoading } from '@store/reducers/posts.reducer';

@Component({
	selector: 'app-post-list',
	templateUrl: './post-list.component.html',
})
export class PostListComponent implements OnInit, OnDestroy {
	private destroy = new Subject<any>();

	sidenavContent: MatSidenavContent;
	scrollPosition: number = 0;
	mode$: Observable<boolean>;
	loading$: Observable<boolean>;
	posts$: Observable<Post[]>;
	posts: Post[];
	lastPostId: string;

	constructor(
		public page: PaginatorService,
		private core: CoreService,
		private store: Store<State>,
	) {
		this.mode$ = this.core.viewMode;
	}

	ngOnInit(): void {

		const init: PageInit = {
			collection: 'posts', orderBy: 'created_at', opts: { reverse: true, prepend: false }
		};

		this.store.dispatch(loadPosts({ init }));

		this.loading$ = this.store.select(getPostsLoading);

		this.posts$ = this.store.select(getPosts)
			.pipe(tap(posts => {
				this.posts = posts;
			}));

		this.core.setSidenavContent
			.pipe(takeUntil(this.destroy))
			.subscribe(sidenavContent => {
				this.sidenavContent = sidenavContent;
				this.sidenavContent.elementScrolled()
					.pipe(map(e => e.srcElement), takeUntil(this.destroy))
					.subscribe((el: any) => {
						const cheight = el.clientHeight;
						const height = el.scrollHeight;
						let scroll = el.scrollTop;
						const offSet = 0;

						// console.log(`scroll: ${scroll}|cheight: ${cheight} | heigth: ${height}`);

						this.scrollPosition = scroll;

						// if (scroll + cheight >= height - offSet) this.page.more();
						if (scroll + cheight >= height - offSet) {
							let Post: Post = this.posts[this.posts.length - 1];
							console.log('LAST POST ID:', Post?.id);
							if (Post) this.lastPostId = Post.id;
							this.store.dispatch(loadMorePosts({ id: this.lastPostId }));
						}

					});
			});
	}

	ngOnDestroy(): void {
		this.destroy.next();
	}

}