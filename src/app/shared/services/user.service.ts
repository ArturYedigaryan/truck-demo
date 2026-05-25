import { Injectable } from '@angular/core';

import { BaseHttp } from '../api/base-http.service';
import { User } from '../interfaces/auth/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseHttp {
  getCurrentUser() {
    return this.http.get<User>('/api/driver/current-driver');
  }
}
