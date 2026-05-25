import { createFeature, createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { initialAuthState } from '../states/auth.state';
import { AuthConnectActions } from '../actions/auth.actions';
import { Features } from '../features.enum';

export const authReducer = createReducer(
  initialAuthState,
  immerOn(AuthConnectActions.loginSuccess, (state) => {
    state.isLoggedIn = true;
  }),
  immerOn(AuthConnectActions.logout, (state) => {
    state.isLoggedIn = false;
  }),
  immerOn(AuthConnectActions.setState, (state, { loggedIn, tokenExpired }) => {
    state.isLoggedIn = loggedIn && !tokenExpired;
  }),
);

export const authFeature = createFeature({
  name: Features.Auth,
  reducer: authReducer,
});
