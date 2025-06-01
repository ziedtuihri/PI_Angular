import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { Event } from 'src/app/models/event.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {MatIcon} from "@angular/material/icon";

export interface EditEventDialogData {
  event?: Event;  // if provided, dialog works in edit mode
  isNew: boolean; // true if creating new event
}

export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-edit-event-dialog',
  templateUrl: './edit-event-dialog.component.html',
  styleUrls: ['./edit-event-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogContent,
    MatIcon
  ],
  providers: [
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' } // Optional: set locale
  ],
})
export class EditEventDialogComponent implements OnInit {
  eventForm!: FormGroup;
  isNew: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditEventDialogData
  ) {
    this.isNew = data.isNew;
  }

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      titre: [this.data.event?.titre || '', Validators.required],
      description: [this.data.event?.description || '', Validators.required],
      date: [this.data.event?.date ? new Date(this.data.event.date) : '', Validators.required],
      lieu: [this.data.event?.lieu || '', Validators.required],
    });
  }

  onSave(): void {
    if (this.eventForm.invalid) return;

    const resultEvent: Event = {
      ...this.data.event,
      ...this.eventForm.value,
    };

    this.dialogRef.close({ action: 'save', event: resultEvent });
  }

  onDelete(): void {
    if (this.isNew) return;
    this.dialogRef.close({ action: 'delete', event: this.data.event });
  }

  onCancel(): void {
    this.dialogRef.close({ action: 'cancel' });
  }
}
