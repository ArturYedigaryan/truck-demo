import { TransportJobDriverStatus } from '../../enums/transport-job-driver-status.enum';

export interface TransportJobDriver {
  assignmentId: string;
  status: TransportJobDriverStatus;
}
