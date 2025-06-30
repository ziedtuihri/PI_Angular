import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { EntrepriseService } from '../../../../services/Admin-Service/entreprise.service';

@Component({
  selector: 'app-edit-event-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogActions,
    MatDialogContent,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './edit-event-dialog.component.html',
  styleUrls: ['./edit-event-dialog.component.css'],
})
export class EditEventDialogComponent {
  event: any;
  entreprises: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private entrepriseService: EntrepriseService
  ) {
    this.event = { ...data }; // Shallow copy
    this.updateEventStatus();
    this.loadEntreprises();
  }

  // Load entreprises from service
  loadEntreprises(): void {
    this.entrepriseService.getAll().subscribe({
      next: (data) => {
        this.entreprises = data;
      },
      error: (err) => {
        console.error('Error loading entreprises', err);
      }
    });
  }

  // Update status based on event date
  updateEventStatus(): void {
    const eventDate = new Date(this.event.date);
    const today = new Date();
    this.event.status = eventDate < today ? 'inactive' : 'active';
  }

  // Triggered when the date input changes
  onDateChange(): void {
    this.updateEventStatus();
  }

  // Save event and close dialog
  onSave(): void {
    this.dialogRef.close(this.event);
  }

  // Cancel and close dialog
  onCancel(): void {
    this.dialogRef.close();
  }
}
