// src/app/services/job-market.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface JobMarketKPIs {
  totalJobs: number;
  averageSalary: number | null;
  salaryMin: number | null;
  salaryMax: number | null;
  topCompanies: { [key: string]: number }[];
  contractTypeDistribution: { [key: string]: number };
  error?: string;
}

export interface HistogramResponse {
  histogram: Record<string, number>;
}

@Injectable({ providedIn: 'root' })
export class JobMarketService {
  private apiUrl = `${environment.apiUrl}/jobmarket/search`;

  constructor(private http: HttpClient) {}

  fetchJobMarketData(location: string, industry: string): Observable<JobMarketKPIs> {
    const params = new HttpParams().set('location', location).set('industry', industry);
    return this.http.get<JobMarketKPIs>(this.apiUrl, { params });
  }

  fetchSalaryHistogram(location: string, industry: string): Observable<HistogramResponse> {
    const params = new HttpParams().set('location', location).set('industry', industry);
    return this.http.get<HistogramResponse>(`${this.apiUrl}/histogram`, { params });
  }
}
