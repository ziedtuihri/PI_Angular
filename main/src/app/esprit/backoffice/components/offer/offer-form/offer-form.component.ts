// offer-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { OfferService } from 'src/app/shared/services/offer.service';
import { Offer } from 'src/app/shared/models/offer';

@Component({
  selector: 'app-offer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './offer-form.component.html',
  styleUrls: ['./offer-form.component.scss']
})
export class OfferFormComponent implements OnInit {
  offerForm: FormGroup;
  isLoading = false;
  isEditing = false;
  errorMessage = '';
  offerId: any;
  
  constructor(
    private fb: FormBuilder,
    private offerService: OfferService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.offerForm = this.createOfferForm();
  }

  ngOnInit(): void {
    this.offerId = this.route.snapshot.paramMap.get('id');
    this.isEditing = !!this.offerId;
    
    if (this.isEditing && this.offerId) {
      this.loadOfferData(this.offerId);
    }
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
  
  loadOfferData(id: number): void {
    this.isLoading = true;
    this.offerService.getOfferById(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (offer) => {
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
        },
        error: (error) => {
          this.errorMessage = 'Failed to load offer data: ' + (error.message || 'Unknown error');
        }
      });
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
    
    if (this.isEditing && this.offerId) {
      // Update existing offer
      this.offerService.updateOffer(this.offerId, formValue)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (updated) => {
            this.router.navigate(['/dashboard/backoffice/offers/details', updated.id], { 
              queryParams: { success: 'updated' } 
            });
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
            this.router.navigate(['/dashboard/backoffice/quiz/create/offer', created.id]);
          },
          error: (error) => {
            this.errorMessage = 'Failed to create offer: ' + (error.message || 'Unknown error');
          }
        });
    }
  }
  
  cancel() {
    if (this.isEditing && this.offerId) {
      console.log('navigated to /dashboard/backoffice/offers + id')
      this.router.navigate(['/dashboard/backoffice/offers']);
      
    } else {
      console.log('navigated to /dashboard/backoffice/offers')
      this.router.navigate(['/dashboard/backoffice/offers']);
      
    }
  }
  
  hasError(controlName: string, errorName: string): boolean {
    const control = this.offerForm.get(controlName);
    return !!control && control.touched && control.hasError(errorName);
  }
  
  clearMessages(): void {
    this.errorMessage = '';
  }
}