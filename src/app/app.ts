import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppFooterComponent } from './core/layout/app-footer/app-footer.component';
import { AppHeaderComponent } from './core/layout/app-header/app-header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppHeaderComponent, AppFooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('quick-movie-app');
}
