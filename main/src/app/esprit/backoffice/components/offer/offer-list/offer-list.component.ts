// offer-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Offer } from 'src/app/shared/models/offer';
import { OfferService } from 'src/app/shared/services/offer.service';
import { TruncatePipe } from 'src/app/shared/pipes/truncate.pipe';
import { MessageDisplayComponent } from 'src/app/shared/components/message-display/message-display.component';

@Component({
  selector: 'app-offer-list',
  standalone: true,
  imports: [
    CommonModule,
    TruncatePipe,
    MessageDisplayComponent],
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.scss']
})
export class OfferListComponent implements OnInit {
  offers: Offer[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  constructor(
    private offerService: OfferService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.isLoading = true;
    this.offerService.getAllOffers()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          this.offers = data;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load offers: ' + (error.message || 'Unknown error');
        }
      });
  }

  navigateToCreateForm(): void {
    this.router.navigate(['/dashboard/backoffice/offers/create']);
  }

  viewDetails(offer: Offer): void {
    this.router.navigate(['/dashboard/backoffice/offers/details', offer.id]);
  }

  editOffer(offer: Offer): void {
    this.router.navigate(['/dashboard/backoffice/offers/edit', offer.id]);
  }

  deleteOffer(offer: Offer): void {
    if (confirm(`Are you sure you want to delete the offer: ${offer.title}?`)) {
      this.isLoading = true;
      this.offerService.deleteOffer(offer.id)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: () => {
            this.offers = this.offers.filter(o => o.id !== offer.id);
            this.successMessage = 'Offer deleted successfully!';
            
            // Clear messages after 3 seconds
            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          },
          error: (error) => {
            this.errorMessage = 'Failed to delete offer: ' + (error.message || 'Unknown error');
          }
        });
    }
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}