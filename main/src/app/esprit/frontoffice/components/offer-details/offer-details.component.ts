import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Offer } from 'src/app/shared/models/offer';
import { OfferService } from 'src/app/shared/services/offer.service';

@Component({
  selector: 'app-offer-details',
  imports: [CommonModule],
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

}
