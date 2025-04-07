import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { Offer } from 'src/app/shared/models/offer';
import { OfferService } from 'src/app/shared/services/offer.service';

@Component({
  selector: 'app-alloffer',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './alloffer.component.html',
  styleUrl: './alloffer.component.scss'
})
export class AllofferComponent {
  offers: Offer[] = [];
  selectedOffer: Offer | null = null;
  offerForm: FormGroup;
  isLoading = false;
  isEditing = false;
  errorMessage = '';
  successMessage = '';
  showForm = false;
  
  constructor(
    private offerService: OfferService,
    private fb: FormBuilder
  ) {
    this.offerForm = this.createOfferForm();
  }

  ngOnInit(): void {
    this.loadOffers();
  }

  createOfferForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      company: ['', [Validators.required]],
      location: ['', [Validators.required]],
      type: ['', [Validators.required]],
      startDate: [null],
      endDate: [null],
      companyId: [null]
    });
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
    this.offerForm.reset();
    this.showForm = true;
  }

  openEditForm(offer: Offer): void {
    this.isEditing = true;
    this.selectedOffer = offer;
    this.offerForm.patchValue({
      title: offer.title,
      description: offer.description,
      company: offer.company,
      location: offer.location,
      type: offer.type,
      startDate: offer.startDate,
      endDate: offer.endDate,
      companyId: offer.companyId
    });
    this.showForm = true;
  }

  saveOffer(): void {
    if (this.offerForm.invalid) {
      this.offerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formValue = this.offerForm.value;
    
    // Convert date strings to Date objects if needed
    if (formValue.startDate && typeof formValue.startDate === 'string') {
      formValue.startDate = new Date(formValue.startDate);
    }
    
    if (formValue.endDate && typeof formValue.endDate === 'string') {
      formValue.endDate = new Date(formValue.endDate);
    }
    
    if (this.isEditing && this.selectedOffer) {
      // Update existing offer
      const updatedOffer: Offer = {...this.selectedOffer, ...formValue};
      this.offerService.updateOffer(this.selectedOffer.id, updatedOffer)
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
      const newOffer: Offer = formValue;
      this.offerService.createOffer(newOffer)
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

  manageQuiz(offer: Offer): void {
    // Navigate to quiz management component with offer ID
    // You would implement this with Angular Router
    console.log(`Navigate to quiz management for offer ${offer.id}`);
    // Example: this.router.navigate(['/offers', offer.id, 'quiz']);
  }

  resetForm(): void {
    this.offerForm.reset();
    this.selectedOffer = null;
    this.isEditing = false;
    this.showForm = false;
    // Clear messages after 3 seconds
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.offerForm.get(controlName);
    return !!control && control.touched && control.hasError(errorName);
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
