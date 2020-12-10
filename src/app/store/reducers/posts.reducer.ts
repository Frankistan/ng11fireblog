import { Action, createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { Post } from '@app/models/post';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as PostActions from '@store/actions/post.actions';

export const postsFeatureKey = 'posts';

export interface State extends EntityState<Post> {
	// additional entities state properties
	error: any;
	loading: boolean;
	seletedPost: Post;
	saved: boolean;
}

export const adapter: EntityAdapter<Post> = createEntityAdapter<Post>();

export const initialState = adapter.getInitialState({
	// additional entity state properties 
	error: null,
	loading: false,
	seletedPost: null,
	saved: false
});

export const postReducer = createReducer(
	initialState,
	on(PostActions.loadPosts, (state, action) => {
		return { ...state, loading: true, error: null }
	}),
	on(PostActions.loadPostsSuccess, (state, action) =>
		{adapter.removeAll(state);return adapter.addMany(action.posts, { ...state, loading: false, error: null });}
	),
	on(PostActions.loadPostsFailure, (state, action) => {
		return { ...state, loading: false, error: action.error }
	}),

	on(PostActions.loadMorePosts, (state, action) => {
		return { ...state, loading: true, error: null }
	}),
	on(PostActions.loadMorePostsSuccess, (state, action) =>
		adapter.addMany(action.posts, { ...state, loading: false, error: null })
	),

	on(PostActions.createPost,
		(state, action) => { return { ...state, loading: true, saved: false } }
	),
	on(PostActions.createPostSuccess, (state, action) =>
		adapter.addOne(action.post, { ...state, loading: false, saved: true })
	),
	on(PostActions.createPostFailure, (state, action) => {
		return { ...state, loading: false, error: action.error, saved: false }
	}),
	on(PostActions.readPost, (state, action) => {
		return { ...state, loading: true, error: null }
	}),
	on(PostActions.readPostSuccess, (state, action) => {
		return { ...state, seletedPost: action.post, loading: false, error: null }
	}),
	on(PostActions.readPostFailure, (state, action) => {
		return { ...state, loading: false, error: action.error }
	}),
	on(PostActions.updatePost,
		(state, action) => { return { ...state, loading: true, saved: false } }
	),
	on(PostActions.updatePostSuccess,
		(state, action) => adapter.updateOne(action.post,  { ...state, loading: false, error: null, saved: true })
		// (state, action) => adapter.updateMany([action.post], { ...state, loading: false, error: null, saved: true })
	),
	on(PostActions.updatePostFailure, (state, action) => {
		return { ...state, loading: false, error: action.error, saved: false }
	}),
	on(PostActions.deletePost,(state, action) => {
		return { ...state, loading: true, error: null }
	}),
	on(PostActions.deletePostSuccess,
		(state, action) => adapter.removeOne(action.id, { ...state, loading: false, error: null})
		// (state, action) => adapter.removeMany(action.ids, state)
	),
	on(PostActions.deletePostFailure, (state, action) => {
		return { ...state, loading: false, error: action.error }
	}),
	on(PostActions.clearPosts,(state,action)=>adapter.removeAll(state))

);

export const {
	selectIds,
	selectEntities,
	selectAll,
	selectTotal,
} = adapter.getSelectors();

export function reducer(state: State | undefined, action: Action) {
	return postReducer(state, action);
}

export const getPostsState = createFeatureSelector<State>('posts');

export const getPosts =
	createSelector(getPostsState, selectAll);

export const getSinglePost =
	createSelector(getPostsState, (state: State) => state.seletedPost);

export const getPostsLoading =
	createSelector(getPostsState, (state: State) => state.loading);

export const getPostSavedState =
	createSelector(getPostsState, (state: State) => state.saved);