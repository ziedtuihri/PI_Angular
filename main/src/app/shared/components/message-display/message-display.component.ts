import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-message-display',
  imports: [CommonModule],
  templateUrl: './message-display.component.html',
  styleUrl: './message-display.component.scss'
})
export class MessageDisplayComponent {
  @Input() errorMessage: string = '';
  @Input() successMessage: string = '';
  @Output() clear = new EventEmitter<void>();

  onClear(): void {
    this.clear.emit();
  }
}
