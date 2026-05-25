import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthConnectActions } from 'src/app/store/actions/auth.actions';
import { LoaderService } from 'src/app/shared/loader/loader.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, PasswordModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  loading = inject(LoaderService).isLoading;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onLogin() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    this.store.dispatch(
      AuthConnectActions.login({ email: email!, password: password! })
    );
  }
}
