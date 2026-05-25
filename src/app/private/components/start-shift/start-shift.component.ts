import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { LoaderService } from 'src/app/shared/loader/loader.service';
import { AuthConnectActions } from 'src/app/store/actions/auth.actions';
import { TruckActions } from 'src/app/store/actions/truck.actions';
import { userFeature } from 'src/app/store/features/user.feature';

@Component({
  selector: 'app-start-shift',
  standalone: true,
  templateUrl: './start-shift.component.html',
  imports: [ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartShiftComponent {
  private readonly store = inject(Store);
  private readonly loaderService = inject(LoaderService);
  loading = this.loaderService.isLoading;
  currentUser = this.store.selectSignal(userFeature.selectCurrentUser);

  logout() {
    this.store.dispatch(AuthConnectActions.logout());
  }

  startShift() {
    this.store.dispatch(TruckActions.startShift());
  }
}
