import { Injectable } from '@angular/core';

import { BaseHttp } from '../api/base-http.service';
import { ShiftStatus } from '../enums/shift-status.enum';
import { TransportJob } from '../interfaces/truck/transport-job.interface';
import { Vehicle } from '../interfaces/truck/vehicle.interface';
import { TransportJobDriverStatus } from '../enums/transport-job-driver-status.enum';

@Injectable({
  providedIn: 'root',
})
export class TruckService extends BaseHttp {
  changeShiftStatus(status: ShiftStatus) {
    return this.http.put<boolean>('/api/drivershifts', status);
  }

  loadTransportJobs(driverId: string, vehicleId: string) {
    return this.http.get<TransportJob[]>(
      `/api/transportJob/byDriverAndVehicle/${driverId}/${vehicleId}`,
    );
  }

  loadVehiclesByDriverId(driverId: string) {
    return this.http.get<Vehicle[]>(`/api/vehicle/byDriver/${driverId}`);
  }

  startJob(jobId: string, assignmentId: string) {
    return this.http.put(
      `/api/transportJobDriver/status/${jobId}/${assignmentId}`,
      TransportJobDriverStatus.Started,
    );
  }

  confirmCollection(cargoId: string) {
    return this.http.put(`/api/transportJobCargo/collect/${cargoId}`, {});
  }

  confirmDelivery(jobId: string, cargoId: string) {
    return this.http.put(`/api/transportJobCargo/deliver/${jobId}/${cargoId}`, {});
  }
}
