import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Inject,
  OnInit,
  Output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { authCodeFlowConfig } from '../oauth.config';
import { CustomOAuthService } from '@services/oauth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-oauth-button',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <div class="text-center">
      <p-button
        pRipple
        [outlined]="true"
        severity="contrast"
        styleClass=" w-full text-black border-black"
        label="Continue with DOME"
        (click)="login()"
      >
        <img
          src="../../assets/img/logo-dome-color.png"
          width="20px"
          height="20px"
          class="mr-2"
      /></p-button>
    </div>
  `,
})
export class OauthButtonComponent {
  private oauthService = inject(CustomOAuthService);

  login(): void {
    this.oauthService.login();
  }
}
