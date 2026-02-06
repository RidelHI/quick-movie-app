import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth/auth.service';
import { HomeStore } from '../state/home.store';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  templateUrl: './home.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit {
  private readonly store = inject(HomeStore);
  private readonly auth = inject(AuthService);

  readonly nowPlaying = this.store.nowPlaying;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly isAuthenticated = this.auth.isAuthenticated;

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.store.loadNowPlayingTitles(10);
    }
  }

  login(): void {
    this.auth.startLogin();
  }

  reload(): void {
    this.store.reload();
  }
}
