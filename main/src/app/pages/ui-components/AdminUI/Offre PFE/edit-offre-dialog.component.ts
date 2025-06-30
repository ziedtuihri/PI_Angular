import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { EntrepriseService } from 'src/app/services/Admin-Service/entreprise.service';

@Component({
  selector: 'app-edit-offre-dialog',
  standalone: true,
  templateUrl: './edit-offre-dialog.component.html',
  styleUrls: ['./edit-offre-dialog.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ]
})
export class EditOffreDialogComponent implements OnInit {
  offre: any = {
    titre: '',
    description: '',
    competences: '',
    localisation: '',
    dateDebut: '',
    dateFin: '',
    disponible: true,
    entrepriseId: null
  };

  entreprises: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditOffreDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private entrepriseService: EntrepriseService
  ) {
    if (data && Object.keys(data).length > 0) {
      this.offre = { ...data };
    }
  }

  ngOnInit(): void {
    this.entrepriseService.getAll().subscribe({
      next: (data) => (this.entreprises = data),
      error: (err) => console.error('Failed to load entreprises', err)
    });
  }

  onSave(): void {
    if (!this.offre.titre || !this.offre.description || !this.offre.entrepriseId) {
      alert('Titre, Description, and Entreprise are required.');
      return;
    }
    this.dialogRef.close(this.offre);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
