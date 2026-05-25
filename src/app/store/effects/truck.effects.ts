import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { TruckService } from 'src/app/shared/services/truck.service';
import { TruckActions } from '../actions/truck.actions';
import { ShiftStatus } from 'src/app/shared/enums/shift-status.enum';
import { Store } from '@ngrx/store';
import { concatLatestFrom } from '@ngrx/operators';
import { userFeature } from '../features/user.feature';
import { truckFeature } from '../features/truck.feature';

export const startShiftStatus = createEffect(
  (actions = inject(Actions), service = inject(TruckService)) => {
    return actions.pipe(
      ofType(TruckActions.startShift),
      switchMap(() =>
        service.changeShiftStatus(ShiftStatus.start).pipe(
          map(() => TruckActions.startShiftSuccess()),
          catchError((error) => of(TruckActions.startShiftError({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const finishShift = createEffect(
  (actions = inject(Actions), service = inject(TruckService)) => {
    return actions.pipe(
      ofType(TruckActions.finishShift),
      switchMap(() =>
        service.changeShiftStatus(ShiftStatus.finish).pipe(
          map(() =>
            TruckActions.finishShiftSuccess({ successMessage: 'Shift finished successfully' }),
          ),
          catchError((error) => of(TruckActions.finishShiftError({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const loadTransportJobs = createEffect(
  (actions = inject(Actions), service = inject(TruckService), store = inject(Store)) => {
    return actions.pipe(
      ofType(TruckActions.loadTransportJobs),
      concatLatestFrom(() => store.select(userFeature.selectCurrentUser)),
      switchMap(([{ vehicleId }, currentUser]) => {
        return service.loadTransportJobs(currentUser?.driverId!, vehicleId).pipe(
          map((jobs) => TruckActions.loadTransportJobsSuccess({ jobs })),
          catchError((error) => of(TruckActions.loadTransportJobsError({ error }))),
        );
      }),
    );
  },
  { functional: true },
);

export const startJob = createEffect(
  (actions = inject(Actions), service = inject(TruckService)) => {
    return actions.pipe(
      ofType(TruckActions.startJob),
      switchMap(({ jobId, assignmentId }) =>
        service.startJob(jobId, assignmentId).pipe(
          map(() => TruckActions.startJobSuccess({ successMessage: 'Job started successfully' })),
          catchError((error) => of(TruckActions.startJobError({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const loadVehiclesByDriverId = createEffect(
  (actions = inject(Actions), service = inject(TruckService)) => {
    return actions.pipe(
      ofType(TruckActions.loadVehiclesByDriverId),
      switchMap(({ driverId }) =>
        service.loadVehiclesByDriverId(driverId).pipe(
          map((vehicles) => TruckActions.loadVehiclesByDriverSuccess({ vehicles })),
          catchError((error) => of(TruckActions.loadVehiclesByDriverError({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const confirmCollection = createEffect(
  (actions = inject(Actions), service = inject(TruckService)) => {
    return actions.pipe(
      ofType(TruckActions.confirmCollection),
      switchMap(({ cargoId }) =>
        service.confirmCollection(cargoId).pipe(
          map(() =>
            TruckActions.confirmCollectionSuccess({
              successMessage: 'Item collected successfully',
            }),
          ),
          catchError((error) => of(TruckActions.confirmCollectionError({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const confirmDelivery = createEffect(
  (actions = inject(Actions), service = inject(TruckService)) => {
    return actions.pipe(
      ofType(TruckActions.confirmDelivery),
      switchMap(({ jobId, cargoId }) =>
        service.confirmDelivery(jobId, cargoId).pipe(
          map(() =>
            TruckActions.confirmDeliverySuccess({ successMessage: 'Item delivered successfully' }),
          ),
          catchError((error) => of(TruckActions.confirmDeliveryError({ error }))),
        ),
      ),
    );
  },
  { functional: true },
);

export const updateTransportJobList = createEffect(
  (actions = inject(Actions), store = inject(Store)) => {
    return actions.pipe(
      ofType(
        TruckActions.startJobSuccess,
        TruckActions.confirmCollectionSuccess,
        TruckActions.confirmDeliverySuccess,
      ),
      concatLatestFrom(() => store.select(truckFeature.selectSelectedVehicleId)),
      switchMap(([, selectedVehicleId]) => {
        if (selectedVehicleId) {
          return of(TruckActions.loadTransportJobs({ vehicleId: selectedVehicleId }));
        } else {
          return of();
        }
      }),
    );
  },
  {
    functional: true,
  },
);

export const loadVehiclesByDriverSuccess = createEffect(
  (actions = inject(Actions), store = inject(Store)) => {
    return actions.pipe(
      ofType(TruckActions.loadVehiclesByDriverSuccess),
      concatLatestFrom(() => store.select(userFeature.selectCurrentUser)),
      switchMap(([{ vehicles }, currentUser]) => {
        if (currentUser && vehicles.length > 0) {
          return of(
            TruckActions.vehicleSelected({
              vehicleId: vehicles[0].vehicleId,
              driverId: currentUser.driverId,
            }),
          );
        } else {
          return of();
        }
      }),
    );
  },
  { functional: true },
);

export const onVehicleSelected = createEffect(
  (actions = inject(Actions)) => {
    return actions.pipe(
      ofType(TruckActions.vehicleSelected),
      map(({ vehicleId }) => TruckActions.loadTransportJobs({ vehicleId })),
    );
  },
  { functional: true },
);
