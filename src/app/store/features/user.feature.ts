import { createFeature, createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { initialUserState } from '../states/user.state.';
import { Features } from '../features.enum';
import { UserActions } from '../actions/user.actions';

export const userReducer = createReducer(
  initialUserState,
  immerOn(UserActions.getCurrentUserSuccess, (state, payload) => {
    state.currentUser = payload.user;
  }),
);

export const userFeature = createFeature({
  name: Features.User,
  reducer: userReducer,
});
