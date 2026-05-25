import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime } from 'rxjs';
import { ValueTrimDirective } from 'src/app/shared/directives/value-trim.directive';
import { TruckActions } from 'src/app/store/actions/truck.actions';

@Component({
  selector: 'app-dashboard-list-filter',
  standalone: true,
  templateUrl: './dashboard-list-filter.component.html',
  imports: [
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    ReactiveFormsModule,
    ValueTrimDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardListFilterComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);
  form = new FormGroup({
    searchString: new FormControl<string>(''),
  });

  controls = {
    searchString: this.form.get('searchString'),
  };

  ngOnInit() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(300))
      .subscribe((value) => {
        this.store.dispatch(
          TruckActions.setSearch({
            searchString: value.searchString ?? '',
          }),
        );
      });
  }
}
