import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthStore } from '../../../core/auth/state/auth.store';
import { HomeStore } from '../state/home.store';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, RouterLink, NgOptimizedImage],
  templateUrl: './home.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent implements OnInit {
  private readonly store = inject(HomeStore);
  private readonly auth = inject(AuthStore);

  readonly nowPlaying = this.store.nowPlaying;
  readonly loading = this.store.loading;
  readonly loadingMore = this.store.loadingMore;
  readonly error = this.store.error;
  readonly isAuthenticated = this.auth.isAuthenticated;
  readonly searchQuery = this.store.searchQuery;
  readonly languageFilter = this.store.languageFilter;
  readonly page = this.store.page;
  readonly totalPages = this.store.totalPages;
  readonly hasMore = computed(() => this.page() < this.totalPages());
  readonly filteredMovies = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const language = this.languageFilter();
    return this.nowPlaying().filter((movie) => {
      const matchesQuery = query
        ? movie.title.toLowerCase().includes(query) ||
          movie.originalTitle.toLowerCase().includes(query)
        : true;
      const matchesLanguage = language === 'all' ? true : movie.originalLanguage === language;
      return matchesQuery && matchesLanguage;
    });
  });
  readonly languageOptions = computed(() => {
    const languages = new Set(this.nowPlaying().map((movie) => movie.originalLanguage));
    return Array.from(languages).sort((a, b) => a.localeCompare(b));
  });

  ngOnInit(): void {
    this.store.loadNowPlaying();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const threshold = 300;
    const position = window.innerHeight + window.scrollY;
    const height = document.body.offsetHeight;
    if (position >= height - threshold) {
      this.store.loadNextPage();
    }
  }

  login(): void {
    this.auth.startLogin();
  }

  updateSearchQuery(value: string): void {
    this.store.setSearchQuery(value);
  }

  updateLanguageFilter(value: string): void {
    this.store.setLanguageFilter(value);
  }

  clearFilters(): void {
    this.store.setSearchQuery('');
    this.store.setLanguageFilter('all');
  }

  reload(): void {
    this.store.reload();
  }
}
