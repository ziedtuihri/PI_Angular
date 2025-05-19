// offer-details.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Offer } from 'src/app/shared/models/offer';
import { OfferService } from 'src/app/shared/services/offer.service';

@Component({
  selector: 'app-offer-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.scss']
})
export class OfferDetailsComponent implements OnInit {
  offer: Offer | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  constructor(
    private offerService: OfferService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check for success message in query params
    this.route.queryParams.subscribe(params => {
      if (params['success'] === 'updated') {
        this.successMessage = 'Offer updated successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      }
    });
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOfferDetails(id);
    } else {
      this.errorMessage = 'No offer ID provided';
    }
  }
  
  loadOfferDetails(id: any): void {
    this.isLoading = true;
    this.offerService.getOfferById(id)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          this.offer = data;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load offer details: ' + (error.message || 'Unknown error');
        }
      });
  }
  
  manageQuiz(): void {
    if (!this.offer) return;
    
    if (this.offer.quiz && this.offer.quiz.id) {
      // Redirect to quiz update
      this.router.navigate(['/dashboard/backoffice/quiz/update', this.offer.quiz.id ,'offer', this.offer.id]);
    } else {
      // Redirect to quiz creation
      this.router.navigate(['/dashboard/backoffice/quiz/create/offer', this.offer.id]);
    }
  }
  
  editOffer(): void {
    if (this.offer) {
      this.router.navigate(['dashboard/backoffice/offers/edit', this.offer.id]);
    }
  }
  
  deleteOffer(): void {
    if (!this.offer) return;
    
    if (confirm(`Are you sure you want to delete the offer: ${this.offer.title}?`)) {
      this.isLoading = true;
      this.offerService.deleteOffer(this.offer.id)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: () => {
            this.router.navigate(['/offers'], { 
              queryParams: { success: 'deleted' } 
            });
          },
          error: (error) => {
            this.errorMessage = 'Failed to delete offer: ' + (error.message || 'Unknown error');
          }
        });
    }
  }
  
  goBack(): void {
    this.router.navigate(['/dashboard/backoffice/offers']);
  }
  
  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}