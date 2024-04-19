import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-forgot',
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
        <div class=" p-2 text-center">
          <h1 class=" text-3xl font-bold my-4">Forgot Password</h1>
          <p class="text-left mt-8">Please enter your email to continue</p>
        </div>
        <div class="flex flex-col gap-8 p-2 mb-4">
          <span class="p-float-label w-full">
            <input class="w-full" pInputText id="email" [(ngModel)]="email" />
            <label for="email">Email</label>
          </span>

          <span class="p-float-label w-full">
            <p-password
              inputStyleClass="w-full"
              styleClass="w-full"
              [(ngModel)]="password"
              [feedback]="false"
            ></p-password>
            <label for="password">New Password</label>
          </span>

          <p-button
            styleClass="w-full"
            pRipple
            icon="pi pi-user"
            label="Recovery"
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
export class ForgotComponent {
  password!: string;
  email!: string;
  constructor() {}
}
