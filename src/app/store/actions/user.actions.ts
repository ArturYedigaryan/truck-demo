import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { httpErrorProps } from 'src/app/shared/functions/http-error-props';
import { User } from 'src/app/shared/interfaces/auth/user.interface';


/**
 * @ignore
 */
export const UserActions = createActionGroup({
  source: '[User]',
  events: {
    GetCurrentUser: emptyProps(),
    GetCurrentUserSuccess: props<{ user: User }>(),
    GetCurrentUserError: httpErrorProps(),
  },
});
