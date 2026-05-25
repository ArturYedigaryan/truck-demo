import { createFeature, createReducer } from '@ngrx/store';
import { immerOn } from 'ngrx-immer/store';

import { initialTruckState } from '../states/truck.state';
import { Features } from '../features.enum';
import { TruckActions } from '../actions/truck.actions';

export const truckReducer = createReducer(
  initialTruckState,
  immerOn(TruckActions.changeVisibilitySetVehicleRegistrationNumber, (state, payload) => {
    state.isVisibleVehicleRegistrationDialog = payload.visible;
  }),
  immerOn(TruckActions.loadTransportJobs, (state, payload) => {
    state.isVisibleVehicleRegistrationDialog = false;
    state.selectedVehicleId = payload.vehicleId;
  }),
  immerOn(TruckActions.loadTransportJobsSuccess, (state, payload) => {
    state.jobs = payload.jobs;
  }),
  immerOn(TruckActions.loadVehiclesByDriverSuccess, (state, payload) => {
    state.vehicles = payload.vehicles;
  }),
  immerOn(TruckActions.setSearch, (state, payload) => {
    state.searchString = payload.searchString;
  }),
);

export const truckFeature = createFeature({
  name: Features.Truck,
  reducer: truckReducer,
});
