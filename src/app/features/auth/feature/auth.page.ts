import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './auth.page.html'
})
export class AuthPageComponent {
  private readonly auth = inject(AuthService);

  readonly isAuthenticated = this.auth.isAuthenticated;

  startLogin(): void {
    this.auth.startLogin();
  }

  logout(): void {
    this.auth.logout();
  }
}
