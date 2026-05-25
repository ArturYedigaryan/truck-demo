import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly messagesService = inject(MessageService);

  success(message: string, title = 'Success') {
    this.messagesService.add({
      severity: 'success',
      summary: title,
      detail: message,
      life: 5_000,
    });
  }

  error(message: string, title = 'Error') {
    this.messagesService.add({
      severity: 'error',
      summary: title,
      detail: message,
      life: 10_000,
    });
  }
}
