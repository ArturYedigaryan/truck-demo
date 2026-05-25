import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export const apiRequestInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api/')) return next(req);
  const token = localStorage.getItem('access_token');
  const cloned = req.clone({
    url: `${environment.apiUrl}${req.url}`,
    setHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return next(cloned);
};
