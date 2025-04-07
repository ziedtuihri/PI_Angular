import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Offer } from 'src/app/shared/models/offer';

@Component({
  selector: 'app-offer-details',
  imports: [CommonModule],
  templateUrl: './offer-details.component.html',
  styleUrl: './offer-details.component.scss'
})
export class OfferDetailsComponent {
  @Input() offer!: Offer;
  @Output() back = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Offer>();
  @Output() delete = new EventEmitter<Offer>();
  @Output() manageQuiz = new EventEmitter<Offer>();
  
  onBack(): void {
    this.back.emit();
  }
  
  onEdit(offer: Offer): void {
    this.edit.emit(offer);
  }
  
  onDelete(offer: Offer): void {
    this.delete.emit(offer);
  }
  
  onManageQuiz(): void {
    this.manageQuiz.emit(this.offer);
  }
}
