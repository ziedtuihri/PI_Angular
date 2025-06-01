import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { Encadrant } from 'src/app/models/encadrant.model';

@Component({
  selector: 'app-edit-encadrant-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './edit-encadrant-dialog.component.html',
  styleUrls: ['./edit-encadrant-dialog.component.css']
})
export class EditEncadrantDialogComponent implements OnInit {
  encadrantForm!: FormGroup;
  isEditMode = false;

  // Hardcode entrepriseId as 1 here for the dialog
  private readonly entrepriseId = 1;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditEncadrantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Encadrant | null
  ) {}

  ngOnInit() {
    this.isEditMode = !!this.data;

    this.encadrantForm = this.fb.group({
      id: [this.data?.id ?? null],
      nom: [this.data?.nom ?? '', [Validators.required, Validators.minLength(2)]],
      prenom: [this.data?.prenom ?? '', [Validators.required, Validators.minLength(2)]],
      email: [this.data?.email ?? '', [Validators.required, Validators.email]],
      telephone: [this.data?.telephone ?? '', [Validators.pattern(/^\+?[0-9\s\-]{6,15}$/)]],
      specialite: [this.data?.specialite ?? '', [Validators.required, Validators.minLength(2)]]
    });
  }

  get f() {
    return this.encadrantForm.controls;
  }

  onSave() {
    if (this.encadrantForm.invalid) {
      this.encadrantForm.markAllAsTouched();
      return;
    }

    // Prepare the object to send, including entreprise with hardcoded id=1
    const formValue = this.encadrantForm.value;

    const result: Encadrant = {
      ...formValue,
      entreprise: { id: this.entrepriseId }
    };

    this.dialogRef.close(result);
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
