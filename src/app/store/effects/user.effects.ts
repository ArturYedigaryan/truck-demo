import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { UserService } from '../../shared/services';
import { UserActions } from '../actions/user.actions';
import { TruckActions } from '../actions/truck.actions';

export const getCurrentUser = createEffect(
  (actions = inject(Actions), service = inject(UserService)) => {
    return actions.pipe(
      ofType(UserActions.getCurrentUser, TruckActions.startShiftSuccess),
      switchMap(() =>
        service.getCurrentUser().pipe(
          map((user) => UserActions.getCurrentUserSuccess({ user })),
          catchError((error) => of(UserActions.getCurrentUserError({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const getCurrentUserSuccess = createEffect(
  (actions = inject(Actions)) => {
    return actions.pipe(
      ofType(UserActions.getCurrentUserSuccess),
      map(({ user }) => TruckActions.loadVehiclesByDriverId({ driverId: user.driverId })),
    );
  },
  { functional: true },
);
