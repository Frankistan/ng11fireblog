import { createAction, props } from '@ngrx/store';
import { User } from '@app/models/user';


export enum ProfileActionType {
	UPDATE_USER = "[User] UPDATE USER",
	UPDATE_USER_SUCCESS = "[User] UPDATE USER SUCCESS",
	UPDATE_USER_FAILURE = "[User] UPDATE USER FAILURE",
	CREATE_USER = "[User] CREATE USER",
	CREATE_USER_SUCCESS = "[User] CREATE USER SUCCESS",
	CREATE_USER_FAILURE = "[User] CREATE USER FAILURE",
};

export const updateUser = createAction(
	ProfileActionType.UPDATE_USER,
	props<{ user: User }>()
);

export const updateUserSuccess = createAction(
	ProfileActionType.UPDATE_USER_SUCCESS,
);

export const updateUserFailure = createAction(
	ProfileActionType.UPDATE_USER_FAILURE,
	props<{ error: any }>()
);
//**************************************************** */
// export const createUser = createAction(
// 	ProfileActionType.CREATE_USER,
// 	props<{ user: User }>()
// );

// export const createUserSuccess = createAction(
// 	ProfileActionType.CREATE_USER_SUCCESS,
// );

// export const createUserFailure = createAction(
// 	ProfileActionType.CREATE_USER_FAILURE,
// 	props<{ error: any }>()
// );

//**************************************************** */