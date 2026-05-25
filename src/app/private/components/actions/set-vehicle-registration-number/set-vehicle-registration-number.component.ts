import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TruckActions } from 'src/app/store/actions/truck.actions';
import { truckFeature } from 'src/app/store/features/truck.feature';
import { userFeature } from 'src/app/store/features/user.feature';
import { LoaderService } from 'src/app/shared/loader/loader.service';

@Component({
  selector: 'app-set-vehicle-registration-number',
  standalone: true,
  templateUrl: './set-vehicle-registration-number.component.html',
  imports: [ReactiveFormsModule, DialogModule, SelectModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetVehicleRegistrationNumberComponent {
  private readonly store = inject(Store);
  private readonly loaderService = inject(LoaderService);
  loading = this.loaderService.isLoading;
  isVisible = this.store.selectSignal(truckFeature.selectIsVisibleVehicleRegistrationDialog);
  vehicles = this.store.selectSignal(truckFeature.selectVehicles);
  currentUser = this.store.selectSignal(userFeature.selectCurrentUser);
  form = new FormGroup({
    vehicleId: new FormControl<string | null>(null, [Validators.required]),
  });
  controls = {
    vehicleId: this.form.get('vehicleId'),
  };

  constructor() {
    effect(() => {
      if (this.isVisible()) {
        this.form.reset();
      }
    });
  }

  hideDialog() {
    this.store.dispatch(
      TruckActions.changeVisibilitySetVehicleRegistrationNumber({ visible: false }),
    );
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.store.dispatch(
      TruckActions.vehicleSelected({
        vehicleId: this.form.value.vehicleId!,
        driverId: this.currentUser()!.driverId,
      }),
    );
  }
}
