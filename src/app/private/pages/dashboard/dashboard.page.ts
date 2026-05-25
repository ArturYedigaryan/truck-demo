import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { StartShiftComponent } from '../../components/start-shift/start-shift.component';
import { userFeature } from 'src/app/store/features/user.feature';
import { DashboardListComponent } from '../../components/dashboard/dashboard-list/dashboard-list.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    templateUrl: './dashboard.page.html',
    imports: [DashboardListComponent, StartShiftComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
    private readonly store = inject(Store);
    currentUser = this.store.selectSignal(userFeature.selectCurrentUser)
}