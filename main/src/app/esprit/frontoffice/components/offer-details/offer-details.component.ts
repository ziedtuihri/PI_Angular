import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { Offer } from 'src/app/shared/models/offer';
import { OfferService } from 'src/app/shared/services/offer.service';

@Component({
  selector: 'app-offer-details',
  imports: [CommonModule,MatButtonModule],
  templateUrl: './offer-details.component.html',
  styleUrl: './offer-details.component.scss'
})
export class OfferDetailsComponent {
  offer!: Offer;

constructor(
  private route: ActivatedRoute,
  private offerService: OfferService,
  private router: Router
) {}

ngOnInit(): void {
  const id = +this.route.snapshot.paramMap.get('id')!;
  this.offerService.getOfferById(id).subscribe(data => this.offer = data);
}

applyToOffer(): void {
  this.router.navigate(['/dashboard/frontoffice/apply' , this.offer.id,'quiz', this.offer.quiz?.id]);
}
isOfferClosed(): boolean {
  if (!this.offer?.endDate) return false;
  const endDate = new Date(this.offer.endDate);
  const today = new Date();
  return endDate.getTime() < today.getTime();
}

isClosingSoon(): boolean {
  if (!this.offer?.endDate) return false;
  const end = new Date(this.offer.endDate);
  const today = new Date();
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(today.getDate() + 7);
  return end >= today && end <= oneWeekFromNow;
}
}
