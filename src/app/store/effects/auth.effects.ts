import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { AuthConnectActions } from '../actions/auth.actions';
import { UserActions } from '../actions/user.actions';
import { TruckActions } from '../actions/truck.actions';
import { User } from 'src/app/shared/interfaces/auth/user.interface';
import { environment } from 'src/environments/environment';

export const login = createEffect(
  (actions = inject(Actions), http = inject(HttpClient)) => {
    return actions.pipe(
      ofType(AuthConnectActions.login),
      switchMap(({ email, password }) =>
        http
          .post<{ token: string; user: User }>(`${environment.apiUrl}/auth/login`, { email, password })
          .pipe(
            tap(({ token }) => localStorage.setItem('access_token', token)),
            map(() => AuthConnectActions.loginSuccess()),
            catchError((error: HttpErrorResponse) =>
              of(AuthConnectActions.loginError({ error }))
            )
          )
      )
    );
  },
  { functional: true }
);

export const logout = createEffect(
  (actions = inject(Actions), http = inject(HttpClient)) => {
    return actions.pipe(
      ofType(AuthConnectActions.logout),
      switchMap(() =>
        http.post(`${environment.apiUrl}/auth/logout`, {}).pipe(
          catchError(() => of(null)),
          tap(() => localStorage.removeItem('access_token'))
        )
      )
    );
  },
  { functional: true, dispatch: false }
);

export const triggerLogoutOnShiftEndOrAuthFailure = createEffect(
  (actions = inject(Actions)) => {
    return actions.pipe(
      ofType(UserActions.getCurrentUserError, TruckActions.finishShiftSuccess),
      map(() => AuthConnectActions.logout())
    );
  },
  { functional: true }
);

export const redirectToLogin = createEffect(
  (actions = inject(Actions), router = inject(Router)) => {
    return actions.pipe(
      ofType(AuthConnectActions.logout),
      tap(() => {
        router.navigate(['/login']);
      })
    );
  },
  { functional: true, dispatch: false }
);

export const redirectToDashboard = createEffect(
  (actions = inject(Actions), router = inject(Router)) => {
    return actions.pipe(
      ofType(AuthConnectActions.loginSuccess),
      tap(() => {
        router.navigate(['/']);
      })
    );
  },
  { functional: true, dispatch: false }
);
