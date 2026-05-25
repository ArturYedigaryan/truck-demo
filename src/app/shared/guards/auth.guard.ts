import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { authFeature } from 'src/app/store/features/auth.feature';

export function authGuard() {
  const router = inject(Router);
  const store = inject(Store);
  const isAuth = store.selectSignal(authFeature.selectIsLoggedIn)();
  if (!isAuth) {
    router.navigate(['/login']);
  }
  return isAuth;
}
