import { TransportJobCargoStatus } from '../../enums/transport-job-cargo-status.enum';

export interface VoyageCargo {
  cargoId: string;
  description: string;
  quantity: number;
  date: string;
  status: TransportJobCargoStatus;
  from: string;
  to: string;
}
