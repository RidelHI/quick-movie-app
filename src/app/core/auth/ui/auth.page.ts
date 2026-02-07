import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthStore } from '../state/auth.store';

@Component({
  selector: 'app-auth-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './auth.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPageComponent {
  private readonly auth = inject(AuthStore);

  readonly isAuthenticated = this.auth.isAuthenticated;
  readonly error = this.auth.error;

  startLogin(): void {
    this.auth.startLogin();
  }

  logout(): void {
    this.auth.logout();
  }
}
