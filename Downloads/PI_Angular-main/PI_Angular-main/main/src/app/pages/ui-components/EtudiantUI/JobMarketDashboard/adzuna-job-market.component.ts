import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, of, timer } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged, tap, catchError, delay } from 'rxjs/operators';
import { AdzunaService } from './adzuna.service';
import { FormsModule } from "@angular/forms";
import { JsonPipe, KeyValuePipe, NgForOf, NgIf } from "@angular/common";

@Component({
  selector: 'app-adzuna-dashboard',
  templateUrl: './adzuna-job-market.component.html',
  standalone: true,
  imports: [FormsModule, KeyValuePipe, JsonPipe, NgForOf, NgIf],
  styleUrls: ['./adzuna-job-market.component.css']
})
export class AdzunaDashboardComponent implements OnInit {

  private country$ = new BehaviorSubject<string>('gb');
  private searchFilters$ = new BehaviorSubject<any>({});
  private page$ = new BehaviorSubject<number>(1);

  jobs: any[] = [];
  categories: any[] = [];
  histogram: any = {};
  geoData: any = {};
  topCompanies: any[] = [];
  history: any = {};

  loading = {
    jobs: false,
    categories: false,
    histogram: false,
    geoData: false,
    topCompanies: false,
    history: false
  };

  private lastFilters: any = {};
  private lastCountry: string = 'gb';

  constructor(private adzunaService: AdzunaService) {}

  ngOnInit(): void {
    // Fetch categories only on country change
    this.country$.pipe(
      distinctUntilChanged(),
      tap(() => this.loading.categories = true),
      switchMap(country =>
        this.adzunaService.getCategories(country).pipe(
          catchError(() => of({ results: [] }))
        )
      )
    ).subscribe(res => {
      this.categories = res.results || [];
      this.loading.categories = false;
    });

    // Handle reactive KPI loading
    combineLatest([this.country$, this.searchFilters$, this.page$])
      .pipe(
        debounceTime(300),
        tap(([country, filters, page]) => {
          this.lastCountry = country;
          this.lastFilters = filters;
        })
      )
      .subscribe(([country, filters, page]) => {
        this.fetchJobs(country, page, filters);
        this.staggeredKPILoad(country, filters); // stagger KPIs to reduce rate hit
      });
  }

  private fetchJobs(country: string, page: number, filters: any) {
    this.loading.jobs = true;
    this.adzunaService.searchJobs(country, page, filters)
      .pipe(catchError(() => of({ results: [] })))
      .subscribe(res => {
        this.jobs = res.results || [];
        this.loading.jobs = false;
      });
  }

  private staggeredKPILoad(country: string, filters: any) {
    const delays = [300, 600, 900, 1200]; // stagger 4 API calls by ~300ms

    // Histogram
    this.loading.histogram = true;
    timer(delays[0]).pipe(
      switchMap(() =>
        this.adzunaService.getHistogram(country, {
          what: filters.what || '',
          where: filters.where || ''
        }).pipe(catchError(() => of({ histogram: {} })))
      )
    ).subscribe(res => {
      this.histogram = res.histogram || {};
      this.loading.histogram = false;
    });

    // GeoData
    this.loading.geoData = true;
    timer(delays[1]).pipe(
      switchMap(() =>
        this.adzunaService.getGeoData(country, filters).pipe(catchError(() => of({})))
      )
    ).subscribe(res => {
      this.geoData = res;
      this.loading.geoData = false;
    });

    // Top Companies
    this.loading.topCompanies = true;
    timer(delays[2]).pipe(
      switchMap(() =>
        this.adzunaService.getTopCompanies(country, filters).pipe(catchError(() => of({ results: [] })))
      )
    ).subscribe(res => {
      this.topCompanies = res.results || [];
      this.loading.topCompanies = false;
    });

    // History
    this.loading.history = true;
    timer(delays[3]).pipe(
      switchMap(() =>
        this.adzunaService.getHistory(country, filters).pipe(catchError(() => of({})))
      )
    ).subscribe(res => {
      this.history = res;
      this.loading.history = false;
    });
  }

  onCountryChange(country: string) {
    if (country !== this.lastCountry) {
      this.country$.next(country);
    }
  }

  onFiltersChange(filters: any) {
    const stringified = JSON.stringify(filters);
    if (JSON.stringify(this.lastFilters) !== stringified) {
      this.searchFilters$.next(filters);
      this.page$.next(1); // reset page
    }
  }

  onPageChange(page: number) {
    this.page$.next(page);
  }

  selectedCountry: string = 'gb'; // default
}
