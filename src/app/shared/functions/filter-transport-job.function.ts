import { TransportJob } from '../interfaces/truck/transport-job.interface';

export function transportJobsFilter(searchString: string, jobs: TransportJob[]) {
  const search = searchString?.toLowerCase().trim();
  if (!search) return jobs;
  return jobs.filter((job) =>
    job.cargos.some((cargo) => cargo.description?.toLowerCase().includes(search)),
  );
}
