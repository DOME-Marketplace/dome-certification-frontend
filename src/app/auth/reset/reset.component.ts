import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-reset',
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
          <h1 class=" text-3xl font-bold my-4">Reset Password</h1>
          <p class="text-left mt-6">
            Please enter your new password to continue
          </p>
        </div>
        <div class="flex flex-col gap-8 p-2 mb-4">
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
            label="Reset"
          ></p-button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetComponent {
  password!: string;
  email!: string;
  constructor() {}
}
