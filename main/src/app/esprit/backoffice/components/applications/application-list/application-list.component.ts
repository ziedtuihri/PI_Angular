import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageDisplayComponent } from 'src/app/shared/components/message-display/message-display.component';
import { JobApplication } from 'src/app/shared/models/job-application';
import { Offer } from 'src/app/shared/models/offer';
import { JobApplicationService } from 'src/app/shared/services/job-application.service';
import { OfferService } from 'src/app/shared/services/offer.service';

@Component({
  selector: 'app-application-list',
  imports: [CommonModule,FormsModule,MessageDisplayComponent],
  templateUrl: './application-list.component.html',
  styleUrl: './application-list.component.scss'
})
export class ApplicationListComponent {
  applications: JobApplication[] = [];
  filteredApplications: JobApplication[] = [];
  offers: Offer[] = [];
  companies: string[] = [];
  isLoading = false;
  
  // Messaging
  errorMessage = '';
  successMessage = '';
  messageTimeout: any = null;
  
  // Filters
  searchText = '';
  selectedCompany: string | null = null;
  selectedOfferId: number | null = null;
  dateFrom: string | null = null;
  dateTo: string | null = null;
  userCompany: string | null = null; // Optional future use
  
  constructor(
    private applicationService: JobApplicationService,
    private offerService: OfferService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.userCompany = null; // You can assign this from the current user context if needed
    this.loadApplications();
    this.loadOffers();
  }
  
  loadApplications(): void {
    this.isLoading = true;
    this.applicationService.getAllApplications().subscribe({
      next: (apps) => {
        this.applications = apps;
        this.extractCompanyNames(apps);
        this.filterApplications();
        this.isLoading = false;
      },
      error: (err) => {
        this.showErrorMessage('Failed to load applications. Please try again later.');
        console.error('Failed to load applications', err);
        this.isLoading = false;
      }
    });
  }
  
  loadOffers(): void {
    this.offerService.getAllOffers().subscribe({
      next: (offers) => this.offers = offers,
      error: (err) => {
        this.showErrorMessage('Failed to load offers. Please try again later.');
        console.error('Failed to load offers', err);
      }
    });
  }
  
  // Messaging system methods
  showSuccessMessage(message: string, duration: number = 5000): void {
    this.clearMessages();
    this.successMessage = message;
    this.setMessageTimeout(duration);
  }
  
  showErrorMessage(message: string, duration: number = 5000): void {
    this.clearMessages();
    this.errorMessage = message;
    this.setMessageTimeout(duration);
  }
  
  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
      this.messageTimeout = null;
    }
  }
  
  private setMessageTimeout(duration: number): void {
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
    this.messageTimeout = setTimeout(() => {
      this.clearMessages();
    }, duration);
  }
  
  extractCompanyNames(apps: JobApplication[]) {
    const names = new Set<string>();
    apps.forEach(app => {
      const name = app.offer?.company?.trim();
      if (name) {
        names.add(name);
      }
    });
    this.companies = Array.from(names);
  }
  
  filterApplications() {
    this.filteredApplications = this.applications.filter(app => {
      const matchesCompany = this.userCompany
        ? app.offer?.company === this.userCompany
        : !this.selectedCompany || app.offer?.company === this.selectedCompany;
      const matchesOffer = !this.selectedOfferId || app.offer?.id === this.selectedOfferId;
      const search = this.searchText.trim().toLowerCase();
      const matchesSearch =
        search === '' ||
        app.studentId.toString().includes(search) ||
        (app.offer?.title?.toLowerCase().includes(search));
      const appliedDate = new Date(app.appliedAt ?? '');
      const matchesDateFrom = !this.dateFrom || appliedDate >= new Date(this.dateFrom);
      const matchesDateTo = !this.dateTo || appliedDate <= new Date(this.dateTo);
      return matchesCompany && matchesOffer && matchesSearch && matchesDateFrom && matchesDateTo;
    });
  }
  
  viewDetails(application: any): void {
    this.router.navigate(['/dashboard/backoffice/applications', application.id]);
  }
  
  updateStatus(application: any): void {
    this.router.navigate(['/dashboard/backoffice/applications/status', application.id]);
  }
  
  // Lifecycle hooks
  ngOnDestroy(): void {
    this.clearMessages();
  }
}
