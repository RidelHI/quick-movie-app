import { Component, inject, OnInit } from '@angular/core';

import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-auth-callback-page',
  standalone: true,
  template: `
    <section class="auth-callback">
      <p>Completando autenticacion...</p>
    </section>
  `
})
export class AuthCallbackPageComponent implements OnInit {
  private readonly auth = inject(AuthService);

  ngOnInit(): void {
    this.auth.completeLogin();
  }
}
