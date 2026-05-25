import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

import { TransportJobCargoStatus } from 'src/app/shared/enums/transport-job-cargo-status.enum';
import { TransportJobDriverStatus } from 'src/app/shared/enums/transport-job-driver-status.enum';
import { TransportJob } from 'src/app/shared/interfaces/truck/transport-job.interface';
import { VoyageCargo } from 'src/app/shared/interfaces/truck/voyage-cargo.interface';
import { LoaderService } from 'src/app/shared/loader/loader.service';
import { TruckActions } from 'src/app/store/actions/truck.actions';

@Component({
  selector: 'app-dashboard-list-card',
  standalone: true,
  templateUrl: './dashboard-list-card.component.html',
  imports: [AccordionPanel, AccordionContent, AccordionHeader, ButtonModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardListCardComponent {
  transportJob = input.required<TransportJob>();
  private readonly confirmationService = inject(ConfirmationService);
  private readonly store = inject(Store);
  private readonly loaderService = inject(LoaderService);
  loading = this.loaderService.isLoading;
  transportJobDriverStatus = TransportJobDriverStatus;
  transportJobCargoStatus = TransportJobCargoStatus;

  onStart(event: PointerEvent, assignmentId: string) {
    event.stopPropagation();
    this.confirmationService.confirm({
      header: 'Start Job',
      message: `Are you sure you want to start this job?`,
      acceptLabel: 'Start',
      rejectLabel: 'Cancel',
      closable: false,
      acceptButtonStyleClass: 'btn-primary',
      rejectButtonStyleClass: 'p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.store.dispatch(
          TruckActions.startJob({
            jobId: this.transportJob().jobId,
            assignmentId,
          }),
        );
      },
    });
  }

  onCollect(cargo: VoyageCargo) {
    this.confirmationService.confirm({
      header: 'Confirm Collection',
      message: `Are you sure you want to mark "${cargo.description}" as collected?`,
      acceptLabel: 'Confirm',
      rejectLabel: 'Cancel',
      closable: false,
      acceptButtonStyleClass: 'btn-primary',
      rejectButtonStyleClass: 'p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.store.dispatch(TruckActions.confirmCollection({ cargoId: cargo.cargoId }));
      },
    });
  }

  onDeliver(cargo: VoyageCargo) {
    this.confirmationService.confirm({
      header: 'Confirm Delivery',
      message: `Are you sure you want to mark "${cargo.description}" as delivered?`,
      acceptLabel: 'Confirm',
      rejectLabel: 'Cancel',
      closable: false,
      acceptButtonStyleClass: 'btn-primary',
      rejectButtonStyleClass: 'p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',
      accept: () => {
        this.store.dispatch(
          TruckActions.confirmDelivery({
            jobId: this.transportJob().jobId,
            cargoId: cargo.cargoId,
          }),
        );
      },
    });
  }
}
