import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthConnectActions } from './store/actions/auth.actions';

export function appInitializer(): void {
  const store = inject(Store);
  const token = localStorage.getItem('access_token');
  let loggedIn = false;
  let tokenExpired = true;
  if (token) {
    try {
      const payload = JSON.parse(atob(token)) as { exp?: number };
      tokenExpired = !payload.exp || Date.now() > payload.exp;
      loggedIn = !tokenExpired;
    } catch {
      // invalid token — treat as not logged in
    }
  }
  store.dispatch(AuthConnectActions.setState({ loggedIn, tokenExpired }));
}
