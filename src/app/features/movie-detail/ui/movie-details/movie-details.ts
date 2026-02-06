import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { MovieDetailsStore } from '../../state/movie-details.store';

@Component({
  selector: 'app-movie-details',
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetails {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly store = inject(MovieDetailsStore);

  readonly movie = this.store.movie;
  readonly loading = this.store.loading;
  readonly error = this.store.error;

  private readonly movieId = toSignal(
    this.activatedRoute.paramMap.pipe(
      map((params) => {
        const value = params.get('id');
        return value ? Number(value) : null;
      }),
    ),
    { initialValue: null },
  );

  constructor() {
    effect(() => {
      const id = this.movieId();
      if (id && id > 0) {
        this.store.loadMovie(id);
      }
    });
  }

  reload(): void {
    this.store.reload();
  }
}
