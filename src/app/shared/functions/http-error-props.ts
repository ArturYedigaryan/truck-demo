import { HttpErrorResponse } from '@angular/common/http';

export const httpErrorProps = () => {
  return (res: { error: HttpErrorResponse }) => ({ error: res.error });
};
