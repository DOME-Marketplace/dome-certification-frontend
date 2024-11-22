import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CustomOAuthService } from '@services/oauth.service';
import { map, Observable } from 'rxjs';

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
        [label]="label$ | async"
        (click)="login()"
        [loading]="loading$ | async"
      >
        <img
          *ngIf="!(loading$ | async)"
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
  loading$: Observable<boolean> = this.oauthService.loading$;
  label$: Observable<string> = this.loading$.pipe(
    map((loading) => (loading ? 'Authenticating...' : 'Continue with DOME'))
  );
  login(): void {
    this.oauthService.login();
  }


}
