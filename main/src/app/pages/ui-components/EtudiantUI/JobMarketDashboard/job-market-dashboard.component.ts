// src/app/components/job-market-dashboard/job-market-dashboard.component.ts
import { Component } from '@angular/core';
import {JobMarketService, JobMarketKPIs, HistogramResponse} from 'src/app/services/Etudiant.Service/job-market.service';
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import {count} from "rxjs";

@Component({
  selector: 'app-job-market-dashboard',
  templateUrl: './job-market-dashboard.component.html',
  standalone: true,
  imports: [NgForOf, DecimalPipe, FormsModule, NgIf],
  styleUrls: ['./job-market-dashboard.component.css']
})
export class JobMarketDashboardComponent {
  location: string = '';
  industry: string = '';
  data: JobMarketKPIs | null = null;
  salaryHistogram: { salary: number; vacancies: number }[] = [];
  loading = false;
  errorMessage = '';

  constructor(private jobMarketService: JobMarketService) {}

  fetchData() {
    if (!this.location.trim() || !this.industry.trim()) {
      this.errorMessage = 'Please provide both location and industry';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.data = null;
    this.salaryHistogram = [];

    this.jobMarketService.fetchJobMarketData(this.location, this.industry).subscribe({
      next: (response) => {
        this.data = response;
        this.fetchHistogram();
      },
      error: () => {
        this.errorMessage = 'Failed to fetch job market data';
        this.loading = false;
      }
    });
  }

  fetchHistogram() {
    if (!this.location.trim() || !this.industry.trim()) {
      this.loading = false;
      return;
    }

    this.jobMarketService.fetchSalaryHistogram(this.location, this.industry).subscribe({
      complete(): void {
      },
      next: (response: HistogramResponse) => {
        const rawHistogram = response.histogram || {};
        this.salaryHistogram = Object.entries(rawHistogram)
          .map(([salary, count]) => ({
            salary: +salary,
            vacancies: +count,
          }))
          .sort((a, b) => a.salary - b.salary);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to fetch salary histogram data';
        this.loading = false;
      }
    });
  }

  getCompanyName(entry: { [key: string]: number }): string {
    return Object.keys(entry)[0];
  }

  getCompanyCount(entry: { [key: string]: number }): number {
    return Object.values(entry)[0];
  }

  getContractTypes(obj: Record<string, number>): string[] {
    return Object.keys(obj);
  }
}

