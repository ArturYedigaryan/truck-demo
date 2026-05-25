import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService } from 'primeng/api';

import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ConfirmDialogModule, ToastModule],
  templateUrl: './app.html',
  providers: [ConfirmationService],
})
export class App {}