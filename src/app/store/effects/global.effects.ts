import { inject } from '@angular/core';

import { Actions, createEffect } from '@ngrx/effects';
import { filter, tap } from 'rxjs/operators';

import { ToastService } from '../../shared/services';

export const successMessage = createEffect(
  (actions = inject(Actions), toastService = inject(ToastService)) => {
    return actions.pipe(
      filter((action) => {
        return action.successMessage !== undefined && action.successMessage !== '';
      }),
      tap((action: unknown) => {
        const msg = (action as { successMessage: string }).successMessage;
        toastService.success(msg);
      }),
    );
  },
  { functional: true, dispatch: false },
);
