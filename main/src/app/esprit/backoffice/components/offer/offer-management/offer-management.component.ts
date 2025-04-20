import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { Offer } from 'src/app/shared/models/offer';
import { Quiz } from 'src/app/shared/models/quiz';
import { OfferService } from 'src/app/shared/services/offer.service';
import { OfferListComponent } from '../offer-list/offer-list.component';
import { OfferDetailsComponent } from '../offer-details/offer-details.component';
import { OfferFormComponent } from '../offer-form/offer-form.component';

@Component({
  selector: 'app-offer-management',
  templateUrl: './offer-management.component.html',
  styleUrls: ['./offer-management.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule,
    OfferFormComponent,
    OfferDetailsComponent,
    OfferListComponent
  ]
})
export class OfferManagementComponent implements OnInit {
  offers: Offer[] = [];
  selectedOffer: Offer | null = null;
  isLoading = false;
  isEditing = false;
  errorMessage = '';
  successMessage = '';
  showForm = false;
  
  constructor(private offerService: OfferService) {}

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

  openCreateForm(): void {
    this.isEditing = false;
    this.selectedOffer = null;
    this.showForm = true;
  }

  openEditForm(offer: Offer): void {
    this.isEditing = true;
    this.selectedOffer = offer;
    this.showForm = true;
  }
  
  handleFormSubmit(formData: { offer: Offer, isEditing: boolean }): void {
    this.isLoading = true;
    
    if (formData.isEditing) {
      // Update existing offer
      this.offerService.updateOffer(formData.offer.id, formData.offer)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (updated) => {
            const index = this.offers.findIndex(o => o.id === updated.id);
            if (index !== -1) {
              this.offers[index] = updated;
            }
            this.successMessage = 'Offer updated successfully!';
            this.resetForm();
          },
          error: (error) => {
            this.errorMessage = 'Failed to update offer: ' + (error.message || 'Unknown error');
          }
        });
    } else {
      // Create new offer
      this.offerService.createOffer(formData.offer)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (created) => {
            this.offers.push(created);
            this.successMessage = 'Offer created successfully!';
            this.resetForm();
          },
          error: (error) => {
            this.errorMessage = 'Failed to create offer: ' + (error.message || 'Unknown error');
          }
        });
    }
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
            if (this.selectedOffer?.id === offer.id) {
              this.resetForm();
            }
          },
          error: (error) => {
            this.errorMessage = 'Failed to delete offer: ' + (error.message || 'Unknown error');
          }
        });
    }
  }

  viewDetails(offer: Offer): void {
    this.isLoading = true;
    this.offerService.getOfferById(offer.id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (detailedOffer) => {
          this.selectedOffer = detailedOffer;
          this.showForm = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load offer details: ' + (error.message || 'Unknown error');
        }
      });
  }

  navigateToQuiz(offer: Offer): void {
    // Navigate to quiz management component with offer ID
    console.log(`Navigate to quiz management for offer ${offer.id}`);
    // Example: this.router.navigate(['/offers', offer.id, 'quiz']);
  }

  resetForm(): void {
    this.selectedOffer = null;
    this.isEditing = false;
    this.showForm = false;
    // Clear messages after 3 seconds
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}