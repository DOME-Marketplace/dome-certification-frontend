import { AuthService } from '@services/auth.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-auth-register',
  standalone: true,
  imports: [
    CommonModule,
    CheckboxModule,
    ButtonModule,
    PasswordModule,
    ReactiveFormsModule,
    InputTextModule,
    RouterLink,
  ],
  template: `
    <div class="min-h-screen mx-auto flex items-center justify-center">
      <div class="bg-gray-50 w-[520px] p-8 shadow-md rounded-md">
        <div class="p-2 gap-2 text-center">
          <h1 class="text-3xl font-bold my-4">Register</h1>
          <p></p>
        </div>
        <form
          [formGroup]="registerForm"
          (ngSubmit)="onSubmit()"
          class="flex flex-col gap-8 p-2"
        >
          <span class="p-float-label w-full">
            <input
              class="w-full"
              pInputText
              id="username"
              formControlName="username"
            />
            <label for="username">Username</label>
          </span>
          <span class="p-float-label w-full">
            <input
              class="w-full"
              pInputText
              id="firstname"
              formControlName="firstname"
            />
            <label for="firstname">Firstname</label>
          </span>
          <span class="p-float-label w-full">
            <input
              class="w-full"
              pInputText
              id="lastname"
              formControlName="lastname"
            />
            <label for="lastname">Lastname</label>
          </span>
          <span class="p-float-label w-full">
            <input
              class="w-full"
              type="email"
              pInputText
              id="email"
              formControlName="email"
            />
            <label for="email">Email</label>
          </span>
          <span class="p-float-label w-full">
            <p-password
              inputStyleClass="w-full"
              styleClass="w-full"
              formControlName="password"
              [toggleMask]="true"
              [feedback]="true"
              promptLabel="Choose a password"
              weakLabel="Too simple"
              mediumLabel="Average complexity"
              strongLabel="Complex password"
            ></p-password>
            <label for="password">Password</label>
          </span>
          <span class="p-float-label w-full">
            <input
              class="w-full"
              pInputText
              id="country_code"
              formControlName="country_code"
            />
            <label for="country_code">Country Code</label>
          </span>
          <span class="p-float-label w-full">
            <input
              class="w-full"
              pInputText
              id="address"
              formControlName="address"
            />
            <label for="address">Address</label>
          </span>
          <span class="p-float-label w-full">
            <input
              class="w-full"
              pInputText
              id="organization_name"
              formControlName="organization_name"
            />
            <label for="organization_name">Organization Name</label>
          </span>
          <span class="p-float-label w-full">
            <input
              class="w-full"
              pInputText
              id="website"
              formControlName="website"
            />
            <label for="website">Website</label>
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
            type="submit"
            pRipple
            icon="pi pi-user"
            label="Submit"
            [disabled]="registerForm.invalid"
          ></p-button>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  public registerForm: FormGroup;
  private router = inject(Router);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  // password!: string;
  // username!: string;
  // firstname!: string;
  // lastname!: string;
  // email!: string;
  // country_code!: string;
  // address!: string;
  // organization_name!: string;
  // website!: string;

  // constructor() {}

  // onSubmit() {
  //   const user = {
  //     username: this.username,
  //     firstname: this.firstname,
  //     lastname: this.lastname,
  //     email: this.email,
  //     password: this.password,
  //     country_code: this.country_code,
  //     address: this.address,
  //     organization_name: this.organization_name,
  //     website: this.website,
  //   };

  //   this.AuthService.register( user).subscribe(
  //     response => {
  //       console.log('User registered successfully', response);
  //     },
  //     error => {
  //       console.error('Error registering user', error);
  //     }
  //   );
  // }

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          this.passwordComplexityValidator,
        ],
      ],
      country_code: ['', Validators.required],
      address: ['', Validators.required],
      organization_name: ['', Validators.required],
      website: ['', Validators.required],
    });
  }
  passwordComplexityValidator(control: FormControl) {
    const value = control.value;
    if (
      value &&
      (!/[A-Z]/.test(value) || !/[!@#$%^&*(),.?":{}|<>]/.test(value))
    ) {
      return { complexity: true };
    }
    return null;
  }

  onSubmit() {
    console.log('submit');
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
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
      });
    }
  }
}
