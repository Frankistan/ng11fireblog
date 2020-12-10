import { createAction, props } from '@ngrx/store';
import { Post } from '@app/models/post';
import { Update } from '@ngrx/entity';
import { PageInit } from '@app/services/posts.service';

export enum PostActionType {
	LOAD_POSTS = '[Post] Load Posts',
	LOAD_POSTS_SUCCESS = '[Post] Load Posts Success',
	LOAD_POSTS_FAILURE = '[Post] Load Posts Failure',
	LOAD_MORE_POSTS = '[Post] Load MORE Posts ',
	LOAD_MORE_POSTS_SUCCESS = '[Post] Load MORE Posts Success',
	CREATE_POST = '[Post] Create Post',
	CREATE_POST_SUCCESS = '[Post] Create Post Success',
	CREATE_POST_FAILURE = '[Post] Create Post Failure',
	READ_POST = '[Post] Read Post',
	READ_POST_SUCCESS = '[Post] Read Post Success',
	READ_POST_FAILURE = '[Post] Read Post Failure',
	UPDATE_POST = '[Post] Update Post',
	UPDATE_POST_SUCCESS = '[Post] Update Post Success',
	UPDATE_POST_FAILURE = '[Post] Update Post Failure',
	DELETE_POST = '[Post] Delete Post',
	DELETE_POST_SUCCESS = '[Post] Delete Post Success',
	DELETE_POST_FAILURE = '[Post] Delete Post Failure',
	CLEAR_POSTS = "[Post] Clear all posts",
};

// LOAD POSTS
export const loadPosts = createAction(
	PostActionType.LOAD_POSTS,
	props<{init:PageInit }>()
);

export const loadPostsSuccess = createAction(
	PostActionType.LOAD_POSTS_SUCCESS,
	props<{ posts: Post[] }>()
);

export const loadPostsFailure = createAction(
	PostActionType.LOAD_POSTS_FAILURE,
	props<{ error: any }>()
);

// LOAD MORE POSTS
export const loadMorePosts = createAction(
	PostActionType.LOAD_MORE_POSTS,
	props<{ id: string }>()
);

export const loadMorePostsSuccess = createAction(
	PostActionType.LOAD_MORE_POSTS_SUCCESS,
	props<{ posts: Post[] }>()
);

// CREATE POST
export const createPost = createAction(
	PostActionType.CREATE_POST,
	props<{ post: Post }>()
);
export const createPostSuccess = createAction(
	PostActionType.CREATE_POST_SUCCESS,
	props<{ post: Post }>()
);
export const createPostFailure = createAction(
	PostActionType.CREATE_POST_FAILURE,
	props<{ error: any }>()
);
// READ POST
export const readPost = createAction(
	PostActionType.READ_POST,
	props<{ id: string }>()
);

export const readPostSuccess = createAction(
	PostActionType.READ_POST_SUCCESS,
	props<{ post: Post }>()
);

export const readPostFailure = createAction(
	PostActionType.READ_POST_FAILURE,
	props<{ error: any }>()
);
// UPDATE POST
export const updatePost = createAction(
	PostActionType.UPDATE_POST,
	props<{ post: Post }>()
);

export const updatePostSuccess = createAction(
	PostActionType.UPDATE_POST_SUCCESS,
	props<{ post: Update<Post> }>()
);

export const updatePostFailure = createAction(
	PostActionType.UPDATE_POST_FAILURE,
	props<{ error: any }>()
);
// DELETE POST
export const deletePost = createAction(
	PostActionType.DELETE_POST,
	props<{ post: Post }>()
);

export const deletePostSuccess = createAction(
	PostActionType.DELETE_POST_SUCCESS,
	props<{ id:string }>()
);

export const deletePostFailure = createAction(
	PostActionType.DELETE_POST_FAILURE,
	props<{ error: any }>()
);

// CLEAR POSTS
export const clearPosts = createAction(
	PostActionType.CLEAR_POSTS
);