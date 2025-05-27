import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Offer } from 'src/app/shared/models/offer';
import { OfferService } from 'src/app/shared/services/offer.service';

@Component({
  selector: 'app-offer-list',
  imports: [RouterLink, CommonModule],
  templateUrl: './offer-list.component.html',
  styleUrl: './offer-list.component.scss'
})
export class OfferListComponent {
  offers: Offer[] = [];

  constructor(private offerService: OfferService) { }

  ngOnInit(): void {
    this.offerService.getAllOffers().subscribe(data => this.offers = data);
  }
}
