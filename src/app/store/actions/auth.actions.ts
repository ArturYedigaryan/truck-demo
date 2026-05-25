import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { httpErrorProps } from 'src/app/shared/functions/http-error-props';

export const AuthConnectActions = createActionGroup({
  source: '[Auth]',
  events: {
    Login: props<{ email: string; password: string }>(),
    LoginSuccess: emptyProps(),
    LoginError: httpErrorProps(),

    Logout: emptyProps(),

    SetState: props<{ loggedIn: boolean; tokenExpired: boolean }>(),
  },
});
