import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@models/user.model';
import { UserRole } from '@models/user.role.model';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: ``,
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private user: User | null;

  ngOnInit(): void {
    this.user = this.authService.getUserFromLocalStorage();
    if (
      this.user.role === UserRole.ADMIN ||
      this.user.role === UserRole.EMPLOYEE
    ) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/newRequest']);
    }
  }
}
