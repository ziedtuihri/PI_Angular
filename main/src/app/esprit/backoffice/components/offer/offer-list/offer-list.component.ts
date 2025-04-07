import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Offer } from 'src/app/shared/models/offer';

@Component({
  selector: 'app-offer-list',
  imports: [CommonModule],
  templateUrl: './offer-list.component.html',
  styleUrl: './offer-list.component.scss'
})
export class OfferListComponent {
  @Input() offers: Offer[] = [];
  @Output() viewDetails = new EventEmitter<Offer>();
  @Output() editOffer = new EventEmitter<Offer>();
  @Output() deleteOffer = new EventEmitter<Offer>();
  
  onViewDetails(offer: Offer): void {
    this.viewDetails.emit(offer);
  }
  
  onEditOffer(offer: Offer): void {
    this.editOffer.emit(offer);
  }
  
  onDeleteOffer(offer: Offer): void {
    this.deleteOffer.emit(offer);
  }
}
