import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { httpErrorProps } from 'src/app/shared/functions/http-error-props';
import { TransportJob } from 'src/app/shared/interfaces/truck/transport-job.interface';
import { Vehicle } from 'src/app/shared/interfaces/truck/vehicle.interface';

export const TruckActions = createActionGroup({
  source: 'Truck',
  events: {
    StartShift: emptyProps(),
    StartShiftSuccess: emptyProps(),
    StartShiftError: httpErrorProps(),

    FinishShift: emptyProps(),
    FinishShiftSuccess: props<{ successMessage: string }>(),
    FinishShiftError: httpErrorProps(),

    LoadTransportJobs: props<{ vehicleId: string }>(),
    LoadTransportJobsSuccess: props<{ jobs: TransportJob[] }>(),
    LoadTransportJobsError: httpErrorProps(),

    StartJob: props<{ jobId: string; assignmentId: string }>(),
    StartJobSuccess: props<{ successMessage: string }>(),
    StartJobError: httpErrorProps(),

    LoadVehiclesByDriverId: props<{ driverId: string }>(),
    LoadVehiclesByDriverSuccess: props<{ vehicles: Vehicle[] }>(),
    LoadVehiclesByDriverError: httpErrorProps(),

    ChangeVisibilitySetVehicleRegistrationNumber: props<{ visible: boolean }>(),

    ConfirmCollection: props<{ cargoId: string }>(),
    ConfirmCollectionSuccess: props<{ successMessage: string }>(),
    ConfirmCollectionError: httpErrorProps(),

    ConfirmDelivery: props<{ jobId: string; cargoId: string }>(),
    ConfirmDeliverySuccess: props<{ successMessage: string }>(),
    ConfirmDeliveryError: httpErrorProps(),

    SetSearch: props<{ searchString: string }>(),

    vehicleSelected: props<{ driverId: string; vehicleId: string }>(),
  },
});
