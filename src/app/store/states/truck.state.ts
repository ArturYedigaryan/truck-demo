import { TransportJob } from 'src/app/shared/interfaces/truck/transport-job.interface';
import { Vehicle } from 'src/app/shared/interfaces/truck/vehicle.interface';

export type TruckState = {
  isVisibleVehicleRegistrationDialog: boolean;
  jobs: TransportJob[];
  vehicles: Vehicle[];
  selectedVehicleId: string;
  searchString: string;
};

export const initialTruckState: TruckState = {
  isVisibleVehicleRegistrationDialog: false,
  jobs: [],
  vehicles: [],
  selectedVehicleId: '',
  searchString: '',
};
