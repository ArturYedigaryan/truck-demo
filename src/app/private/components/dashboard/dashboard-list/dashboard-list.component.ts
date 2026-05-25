import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { Store } from '@ngrx/store';

import { DashboardListHeaderComponent } from '../dashboard-list-header/dashboard-list-header.component';
import { DashboardListFilterComponent } from '../dashboard-list-filter/dashboard-list-filter.component';
import { DashboardListCardComponent } from '../dashboard-list-card/dashboard-list-card.component';
import { EmptyDataComponent } from 'src/app/shared/components/empty-data/empty-data.component';
import { SetVehicleRegistrationNumberComponent } from '../../actions/set-vehicle-registration-number/set-vehicle-registration-number.component';
import { truckFeature } from 'src/app/store/features/truck.feature';
import { transportJobsFilter } from 'src/app/shared/functions/filter-transport-job.function';

@Component({
  selector: 'app-dashboard-list',
  standalone: true,
  templateUrl: './dashboard-list.component.html',
  imports: [
    DashboardListHeaderComponent,
    DashboardListFilterComponent,
    DashboardListCardComponent,
    SetVehicleRegistrationNumberComponent,
    EmptyDataComponent,
    AccordionModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardListComponent {
  private readonly store = inject(Store);
  jobs = this.store.selectSignal(truckFeature.selectJobs);
  filter = this.store.selectSignal(truckFeature.selectSearchString);
  filteredData = computed(() => {
    return transportJobsFilter(this.filter(), this.jobs()).sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return timeA - timeB;
    });
  });
}
