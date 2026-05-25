import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RouterOutlet } from '@angular/router';
import { userFeature } from '../store/features/user.feature';
import { UserActions } from '../store/actions/user.actions';

@Component({
    selector: 'app-private',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './private.page.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivatePage implements OnInit {
    private readonly store = inject(Store);
    currentUser = this.store.selectSignal(userFeature.selectCurrentUser);

    ngOnInit(): void {
        this.store.dispatch(UserActions.getCurrentUser())
    }
}


