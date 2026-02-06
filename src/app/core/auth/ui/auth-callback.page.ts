import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { AuthStore } from '../state/auth.store';

@Component({
  selector: 'app-auth-callback-page',
  template: `
    <section class="auth-callback">
      <p>Completando autenticacion...</p>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthCallbackPageComponent implements OnInit {
  private readonly auth = inject(AuthStore);

  ngOnInit(): void {
    this.auth.completeLogin();
  }
}
