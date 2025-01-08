import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '@models/user.model';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="flex flex-col gap-8 justify-center items-center flex-1 p-6">
      <div class="text-center">
        <h1 class="text-4xl font-bold mb-4">Welcome, {{ user?.firstname }}</h1>
        <p class="text-xl text-gray-600">Please select an option below</p>
      </div>

      <div
        class="flex flex-col  md:flex-row gap-6 w-full max-w-4xl justify-center items-center"
      >
        <a
          class="flex flex-col items-center justify-center gap-4 p-6 min-w-[280px]  bg-[#eff3f8] hover:bg-blue-200 text-[#2D58A7]  rounded-lg transition transform hover:scale-105 no-underline "
          routerLink="/dashboard"
        >
          <i class="pi pi-chart-line text-4xl"></i>
          <span class="text-lg font-semibold uppercase">Dashboard</span>
        </a>

        <a
          *ngIf="user?.role === 'CUSTOMER' || user?.role === 'ADMIN'"
          class="flex flex-col items-center justify-center gap-4 p-6  min-w-[280px] bg-[#eff3f8] hover:bg-blue-200 text-[#2D58A7] rounded-lg transition transform hover:scale-105 no-underline"
          routerLink="/newRequest"
        >
          <i class="pi pi-plus-circle text-4xl"></i>
          <span class="text-lg font-semibold uppercase">New Request</span>
        </a>
      </div>
    </section>
  `,
})
export class IndexComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  user: User | null = null;

  ngOnInit(): void {
    this.user = this.authService.getUserFromSessionStorage();
    this.authService.setAuthState(this.user);
    if (!this.user) {
      this.router.navigate(['/auth/login']);
    }
  }
}
