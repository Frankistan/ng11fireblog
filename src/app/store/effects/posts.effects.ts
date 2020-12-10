import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map, catchError, tap, mergeMap, filter, concatMap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import * as PostActions from '@store/actions/post.actions';
import { PostActionType } from '@store/actions/post.actions';
import { PostsService } from '@app/services/posts.service';
import { Router } from '@angular/router';
import { NotificationService } from '@app/services/notification.service';
import { FirebaseErrors } from '@app/models/firebase-errors';
import { PaginatorService, PageInit } from '@app/services/paginator.service';
import { Post } from '@app/models/post';
import { Update } from '@ngrx/entity';
import { QueryDocumentSnapshot } from '@angular/fire/firestore/interfaces';

@Injectable()
export class PostEffects {

	onLoadPosts = createEffect(() => this.actions$.pipe(
		ofType(PostActionType.LOAD_POSTS),
		map(payload => payload['init']),
		map(init => this.postService.init(init)),
		switchMap(col => this.postService.list(col)
			.pipe(
				mergeMap(posts => [
					// PostActions.clearPosts(),
					PostActions.loadPostsSuccess({ posts })
				]
				),
				catchError(error => of(PostActions.loadPostsFailure({ error })))
			))
	));

	onLoadPostsSuccess = createEffect(() => this.actions$.pipe(
		ofType(PostActionType.LOAD_POSTS_SUCCESS),
	), { dispatch: false });


	onLoadPostsFailure = createEffect(() => this.actions$.pipe(
		ofType(PostActionType.LOAD_POSTS_FAILURE),
		tap((error: any) => {
			const errorMessage = FirebaseErrors.Parse(error.error.code);
			this.notify.open(errorMessage, "close", 4000);
		})
	), { dispatch: false });

	onLoadMorePosts = createEffect(() => this.actions$.pipe(
		ofType(PostActionType.LOAD_MORE_POSTS),
		map(payload => payload['id']),
		switchMap(id => this.postService.getCursor(id)),
		switchMap( (cursor:QueryDocumentSnapshot<any>) => this.postService.list(this.postService.more(cursor))
			.pipe(
				map(posts => PostActions.loadPostsSuccess({ posts })),
				catchError(error => of(PostActions.loadPostsFailure({ error })))
			))
	));

	onCreatePost = createEffect(() => this.actions$.pipe(
		ofType(PostActionType.CREATE_POST),
		map(payload => payload['post']),
		switchMap(post => from(this.postService.create(post))
			.pipe(
				map(post => PostActions.createPostSuccess({ post })),
				catchError(error => of(PostActions.createPostFailure({ error })))
			))
	));

	onCreatePostSuccess = createEffect(() => this.actions$.pipe(
		ofType(PostActionType.CREATE_POST_SUCCESS),
		tap(_ => {
			this.notify.open("toast.post.created", "toast.close", 3000);
			this.router.navigate(['/posts']);
		})
	), { dispatch: false });

	onCreatePostFailure = createEffect(() => this.actions$.pipe(
		ofType(PostActionType.CREATE_POST_FAILURE),
		tap((error: any) => {
			const errorMessage = FirebaseErrors.Parse(error.error.code);
			this.notify.open(errorMessage, "close", 4000);
		})
	), { dispatch: false });

	onReadPost = createEffect(() => this.actions$.pipe(
		ofType(PostActionType.READ_POST),
		map(payload => payload['id']),
		switchMap(id => this.postService.read(id)
			.pipe(
				map(post => PostActions.readPostSuccess({ post })),
				catchError(error => of(PostActions.readPostFailure({ error })))
			))
	));

	onReadPostSuccess = createEffect(() => this.actions$.pipe(
		ofType(PostActionType.READ_POST_SUCCESS),
	), { dispatch: false });

	onReadPostFailure = createEffect(() => this.actions$.pipe(
		ofType(PostActionType.READ_POST_FAILURE),
		tap((error: any) => {
			const errorMessage = FirebaseErrors.Parse(error.error.code);
			this.notify.open(errorMessage, "close", 4000);
		})
	), { dispatch: false });

	onUpdatePost = createEffect(() => this.actions$.pipe(
		ofType(PostActionType.UPDATE_POST),
		map(payload => payload['post']),
		map( post => {
			const uPost:Update<Post> = {
				id: post['id'],
				changes: post
			};
			return uPost;
		}),
		switchMap(post => {
			
			return from(this.postService.update(post['changes']))
				.pipe(
					map(_ => PostActions.updatePostSuccess({ post })),
					catchError(error => of(PostActions.updatePostFailure({ error })))
				)
		})
	));

	onUpdatePostSuccess = createEffect(() => this.actions$.pipe(
		ofType(PostActionType.UPDATE_POST_SUCCESS),
		tap(_ => {
			this.notify.open("toast.post.updated", "toast.close");
		})
	), { dispatch: false });

	onUpdatePostFailure = createEffect(() => this.actions$.pipe(
		ofType(PostActionType.UPDATE_POST_FAILURE),
		tap((error: any) => {
			const errorMessage = FirebaseErrors.Parse(error.error.code);
			this.notify.open(errorMessage, "close", 4000);
		})
	), { dispatch: false });

	/****** */

	onDeletePost = createEffect(() => this.actions$.pipe(
		ofType(PostActionType.DELETE_POST),
		map(payload => payload['post']),
		switchMap(post => {
			const id = post['id'];
			return from(this.postService.delete(post))
			.pipe(
				map(_ => PostActions.deletePostSuccess({ id })),
				catchError(error => of(PostActions.deletePostFailure({ error })))
			)
		})
	));
	
	onDeletePostSuccess = createEffect(() => this.actions$.pipe(
		ofType(PostActionType.DELETE_POST_SUCCESS),
		tap(_ => {
			this.notify.open("toast.post.deleted", "toast.close");
			this.router.navigate(['/posts']);
		})
	), { dispatch: false });

	onDeletePostFailure = createEffect(() => this.actions$.pipe(
		ofType(PostActionType.DELETE_POST_FAILURE),
		tap((error: any) => {
			const errorMessage = FirebaseErrors.Parse(error.error.code);
			this.notify.open(errorMessage, "close", 4000);
		})
	), { dispatch: false });

	constructor(
		private actions$: Actions,
		private page: PaginatorService,
		private postService: PostsService,
		private router: Router,
		private notify: NotificationService,
	) { }
}
