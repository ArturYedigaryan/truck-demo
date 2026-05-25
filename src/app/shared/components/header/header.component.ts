import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Store } from '@ngrx/store';

import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';

import { authFeature } from 'src/app/store/features/auth.feature';
import { LoaderService } from '../../loader/loader.service';
import { userFeature } from 'src/app/store/features/user.feature';
import { TruckActions } from 'src/app/store/actions/truck.actions';

@Component({
  selector: 'shared-header',
  standalone: true,
  templateUrl: './header.component.html',
  imports: [RouterLink, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly store = inject(Store);
  private readonly loaderService = inject(LoaderService);
  private readonly confirmationService = inject(ConfirmationService);
  loading = this.loaderService.isLoading;
  isLoggedIn = this.store.selectSignal(authFeature.selectIsLoggedIn);
  currentUser = this.store.selectSignal(userFeature.selectCurrentUser);

  finishShift() {
    this.confirmationService.confirm({
      header: 'Finish shift',
      message: `Are you sure you want to finish shift?`,
      acceptLabel: 'Finish',
      rejectLabel: 'Cancel',
      closable: false,
      acceptButtonStyleClass: 'btn-primary',
      rejectButtonStyleClass: 'p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.store.dispatch(TruckActions.finishShift());
      },
    });
  }
}
