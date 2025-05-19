import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Offer } from 'src/app/shared/models/offer';
import { OfferService } from 'src/app/shared/services/offer.service';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-offer-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule
  ],
  templateUrl: './offer-list.component.html',
  styleUrl: './offer-list.component.scss'
})
export class OfferListComponent {
  offers: Offer[] = [];

  constructor(private offerService: OfferService) { }

  ngOnInit(): void {
    this.offerService.getAllOffers().subscribe(data => {
      this.offers = data.map(o => ({
        ...o,
        endDate: o.endDate ? new Date(o.endDate) : undefined
      }));
    });
  }

  isClosed(date?: Date): boolean {
    if (!date) return false;
    const today = new Date();
    return new Date(date).getTime() < today.getTime();
  }

  isClosingSoon(date?: Date): boolean {
    if (!date) return false;
    const today = new Date();
    const end = new Date(date);
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(today.getDate() + 7);
    return end >= today && end <= oneWeekFromNow;
  }
}
