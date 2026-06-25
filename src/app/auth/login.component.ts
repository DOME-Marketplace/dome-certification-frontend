import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OauthButtonComponent } from './Oauth.button.component';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [CommonModule, OauthButtonComponent],
  template: `
    <div class="min-h-screen mx-auto flex items-center justify-center">
      <div class="bg-gray-50 w-[420px] p-10 pb-8 shadow-md rounded-md flex flex-col items-center gap-8">
        <div class="text-center">
          <img src="../../assets/img/logo-dome-color.png" width="80px" class="mb-4" />
          <h1 class="text-3xl font-bold my-2">Login</h1>
          <p class="text-gray-500 text-sm m-0">
            Use your DOME Wallet to sign in.<br />
            Scan the QR code with your EUDI Wallet or DOME Digital Wallet and select your LEAR credential.
          </p>
        </div>
        <div class="w-full">
          <app-oauth-button />
        </div>
        <div class="text-center text-sm text-gray-400">
          Don't have an account?
          <a
            class="font-medium no-underline ml-1 cursor-pointer"
            style="color: var(--primary-color)"
            href="https://knowledgebase.dome-marketplace.org/shelves/company-onboarding-process"
            target="_blank"
          >Sign up</a>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {}
