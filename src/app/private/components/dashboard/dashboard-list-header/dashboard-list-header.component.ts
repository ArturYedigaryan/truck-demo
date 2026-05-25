import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { TimerComponent } from 'src/app/shared/components/timer/timer.component';
import { LoaderService } from 'src/app/shared/loader/loader.service';
import { TruckActions } from 'src/app/store/actions/truck.actions';
import { truckFeature } from 'src/app/store/features/truck.feature';
import { userFeature } from 'src/app/store/features/user.feature';

@Component({
  selector: 'app-dashboard-list-header',
  standalone: true,
  templateUrl: './dashboard-list-header.component.html',
  imports: [ButtonModule, TimerComponent, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardListHeaderComponent {
  private readonly store = inject(Store);
  private readonly loaderService = inject(LoaderService);
  loading = this.loaderService.isLoading;
  currentUser = this.store.selectSignal(userFeature.selectCurrentUser);
  vehicles = this.store.selectSignal(truckFeature.selectVehicles);
  jobs = this.store.selectSignal(truckFeature.selectJobs);
  vehicleId = this.store.selectSignal(truckFeature.selectSelectedVehicleId);

  selectedVehicle = computed(() => {
    const selectedId = this.vehicleId();
    const list = this.vehicles();
    if (selectedId && list.length > 0) {
      return list.find((v) => v.vehicleId === selectedId);
    }
    return null;
  });

  openVehicleNumber() {
    this.store.dispatch(
      TruckActions.changeVisibilitySetVehicleRegistrationNumber({ visible: true }),
    );
  }
}
