import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { AuthService } from '@services/auth.service';
import { User } from '@models/user.model';
import { ToolbarComponent } from '@components/toolbar.component';
import { BreadcrumbComponent } from '@components/breadcrumb.component';

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
