import { CommonModule, DOCUMENT, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Grid, GridCell, GridCellWidget, GridRow } from '@angular/aria/grid';

import { AuthService } from '../../../core/auth/auth.service';
import { MovieBase } from '../domain/models/movie-base.model';
import { HomeStore } from '../state/home.store';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, RouterLink, NgOptimizedImage, Grid, GridRow, GridCell, GridCellWidget],
  templateUrl: './home.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly store = inject(HomeStore);
  private readonly auth = inject(AuthService);

  readonly nowPlaying = this.store.nowPlaying;
  readonly loading = this.store.loading;
  readonly error = this.store.error;
  readonly isAuthenticated = this.auth.isAuthenticated;
  readonly columns = signal(3);
  readonly movieRows = computed(() => chunkMovies(this.nowPlaying(), this.columns()));

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.store.loadNowPlayingTitles(10);
    }

    this.setupResponsiveColumns();
  }

  login(): void {
    this.auth.startLogin();
  }

  reload(): void {
    this.store.reload();
  }

  private setupResponsiveColumns(): void {
    const view = this.document.defaultView;
    if (!view?.matchMedia) {
      return;
    }

    const smQuery = view.matchMedia('(min-width: 640px)');
    const lgQuery = view.matchMedia('(min-width: 1024px)');
    const updateColumns = () => {
      if (lgQuery.matches) {
        this.columns.set(3);
        return;
      }
      if (smQuery.matches) {
        this.columns.set(2);
        return;
      }
      this.columns.set(1);
    };

    updateColumns();

    smQuery.addEventListener('change', updateColumns);
    lgQuery.addEventListener('change', updateColumns);

    this.destroyRef.onDestroy(() => {
      smQuery.removeEventListener('change', updateColumns);
      lgQuery.removeEventListener('change', updateColumns);
    });
  }
}

function chunkMovies(movies: MovieBase[], columns: number): MovieBase[][] {
  const safeColumns = Math.max(1, columns);
  const rows: MovieBase[][] = [];

  for (let index = 0; index < movies.length; index += safeColumns) {
    rows.push(movies.slice(index, index + safeColumns));
  }

  return rows;
}
