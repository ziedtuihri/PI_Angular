import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit-encadrant-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './edit-encadrant-dialog.component.html',
  styleUrls: ['./edit-encadrant-dialog.component.css'],
})
export class EditEncadrantDialogComponent implements OnInit {
  encadrantForm!: FormGroup;
  entreprises: { id: number; nom: string }[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditEncadrantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.entreprises = this.data.entreprises || [];

    const entrepriseId = this.data?.entreprise?.id || null;

    this.encadrantForm = this.fb.group({
      id: [this.data?.id],
      nom: [this.data?.nom ?? '', Validators.required],
      prenom: [this.data?.prenom ?? '', Validators.required],
      email: [this.data?.email ?? '', [Validators.required, Validators.email]],
      telephone: [this.data?.telephone ?? '', Validators.required],
      specialite: [this.data?.specialite ?? '', Validators.required],
      entrepriseId: [entrepriseId, Validators.required],
    });
  }

  onSave(): void {
    if (this.encadrantForm.invalid) return;

    const formValue = this.encadrantForm.value;

    // Find the full entreprise object by selected entrepriseId
    const selectedEntreprise = this.entreprises.find(
      (e) => e.id === formValue.entrepriseId
    );

    // Construct result with full entreprise info (id and nom)
    const result = {
      ...formValue,
      entreprise: selectedEntreprise
        ? { id: selectedEntreprise.id, nom: selectedEntreprise.nom }
        : null,
    };

    delete result.entrepriseId;

    this.dialogRef.close(result);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
