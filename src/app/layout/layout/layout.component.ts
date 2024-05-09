import { Router, RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './../../components/toolbar/toolbar.component';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { AuthService } from '@services/auth.service';
import { User } from '@models/user.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, ToolbarComponent, RouterOutlet, BreadcrumbComponent],
  template: `
    <div class=" ">
      <app-toolbar [user]="user"></app-toolbar>
      <main
        class=" py-6 mt-16 max-w-screen-xl mx-auto min-h-[calc(100dvh-4rem)]"
      >
        <app-breadcrumb></app-breadcrumb>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  user: User | null = null;

  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalStorage();
    this.authService.setAuthState(this.user);
    if (!this.user) {
      this.router.navigate(['/auth/login']);
    }
  }
}
