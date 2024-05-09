import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [
    CommonModule,
    CheckboxModule,
    ButtonModule,
    PasswordModule,
    FormsModule,
    RouterLink,
    InputTextModule,
  ],
  template: `
    <div class=" min-h-screen  mx-auto flex items-center justify-center ">
      <div class="bg-gray-50  w-[520px] p-8 shadow-md rounded-md ">
        <div class=" p-2 gap-2 text-center">
          <h1 class="text-3xl font-bold my-4">Login</h1>
          <p></p>
        </div>
        <div class="flex flex-col gap-8 p-2 mb-4">
          <span class="p-float-label w-full">
            <input
              class="w-full"
              pInputText
              id="username"
              [(ngModel)]="username"
            />
            <label for="username">Username</label>
          </span>

          <span class="p-float-label w-full">
            <p-password
              inputStyleClass="w-full"
              styleClass="w-full"
              [(ngModel)]="password"
              [feedback]="false"
              [toggleMask]="true"
              [appendTo]="getToggleIcon()"
            ></p-password>
            <label for="password">Password</label>
          </span>
          <div class="flex items-center justify-between gap-5">
            <div class="flex align-items-center">
              <p-checkbox
                id="rememberme1"
                [binary]="true"
                styleClass="mr-2"
              ></p-checkbox>
              <label for="rememberme1">Remember me</label>
            </div>
            <a
              class="font-medium no-underline ml-2 text-right cursor-pointer"
              style="color: var(--primary-color)"
              routerLink="/auth/forgot"
              >Forgot password?</a
            >
          </div>

          <p-button
            styleClass="w-full"
            pRipple
            icon="pi pi-user"
            label="Submit"
            [loading]="loading"
            (click)="onSubmit()"
          ></p-button>
        </div>
        <a
          class="font-medium no-underline ml-2   cursor-pointer"
          style="color: var(--primary-color)"
          routerLink="/auth/register"
          >Don't have an account?</a
        >
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private router = inject(Router);
  private auth = inject(AuthService);
  private messageService = inject(MessageService);
  password = '';
  username = '';
  showPassword: boolean = false;

  loading: boolean = false;

  getToggleIcon(): string {
    return this.showPassword ? 'pi pi-eye-slash' : 'pi pi-eye';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    //redireccionar a dashboard
    if (this.username === '' || this.password === '') {
      return;
    }
    this.loading = true;

    this.auth
      .login(this.username, this.password)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Login successful',
          });
          this.router.navigate(['/home']);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Invalid credentials',
          });
        },
      })
      .add(() => {
        this.loading = false;
      });
  }
}
