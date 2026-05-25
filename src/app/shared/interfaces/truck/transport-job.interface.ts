import { TransportJobDriver } from './transport-job-driver.interface';
import { VoyageCargo } from './voyage-cargo.interface';

export interface TransportJob {
  jobId: string;
  date: string;
  notCollected: number;
  collected: number;
  delivered: number;
  started: boolean;
  drivers: TransportJobDriver[];
  cargos: VoyageCargo[];
}
