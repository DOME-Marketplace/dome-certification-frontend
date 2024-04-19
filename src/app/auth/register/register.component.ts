import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-register',
  standalone: true,
  imports: [
    CommonModule,
    CheckboxModule,
    ButtonModule,
    PasswordModule,
    FormsModule,
    InputTextModule,
    RouterLink,
  ],
  template: `
    <div class=" min-h-screen  mx-auto flex items-center justify-center ">
      <div class="bg-gray-50  w-[520px] p-8 shadow-md rounded-md ">
        <div class=" p-2 gap-2 text-center">
          <h1 class="text-3xl font-bold my-4">Register</h1>
          <p></p>
        </div>
        <div class="flex flex-col gap-8 p-2">
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
            <input
              class="w-full"
              pInputText
              id="lastname"
              [(ngModel)]="lastname"
            />
            <label for="lastname">Lastname</label>
          </span>
          <span class="p-float-label w-full">
            <input
              class="w-full"
              type="email"
              pInputText
              id="email"
              [(ngModel)]="email"
            />
            <label for="email">Email</label>
          </span>

          <span class="p-float-label w-full">
            <p-password
              inputStyleClass="w-full"
              styleClass="w-full"
              [(ngModel)]="password"
              [toggleMask]="true"
              [feedback]="true"
              promptLabel="Choose a password"
              weakLabel="Too simple"
              mediumLabel="Average complexity"
              strongLabel="Complex password"
            ></p-password>
            <label for="password">Password</label>
          </span>

          <div class="flex items-center justify-between gap-5">
            <div class="flex align-items-center"></div>
            <a
              class="font-medium no-underline ml-2 text-right cursor-pointer"
              style="color: var(--primary-color)"
              routerLink="/auth/login"
              >Already register?</a
            >
          </div>

          <p-button
            styleClass="w-full"
            pRipple
            icon="pi pi-user"
            label="Submit"
          ></p-button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  password!: string;
  username!: string;
  lastname!: string;
  email!: string;
  constructor() {}
}
