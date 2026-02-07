import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { MovieDetails } from './movie-details';
import { MovieDetailsStore } from '../../state/movie-details.store';

describe('MovieDetails', () => {
  let component: MovieDetails;
  let fixture: ComponentFixture<MovieDetails>;
  const storeMock = {
    movie: signal(null),
    loading: signal(false),
    error: signal<string | null>(null),
    loadMovie: vi.fn(),
    reload: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [MovieDetails],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ id: '1' })) },
        },
        { provide: MovieDetailsStore, useValue: storeMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MovieDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads movie from route id', () => {
    expect(storeMock.loadMovie).toHaveBeenCalledWith(1);
  });
});
