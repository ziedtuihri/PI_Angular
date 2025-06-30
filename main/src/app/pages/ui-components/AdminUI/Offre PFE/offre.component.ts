// src/app/components/offre/offre.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OffreService } from 'src/app/services/Admin-Service/offre.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EditOffreDialogComponent } from './edit-offre-dialog.component';
import { MatChip } from "@angular/material/chips";

@Component({
  selector: 'app-offre-list',
  standalone: true,
  templateUrl: './offre.component.html',
  styleUrls: ['./offre.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule,
    EditOffreDialogComponent,
    MatToolbarModule,
    MatChip
  ]
})
export class OffreComponent implements OnInit {
  displayedColumns = ['id', 'titre', 'localisation', 'dateDebut', 'dateFin', 'disponible', 'actions'];
  offres: any[] = [];
  isLoading = false;

  // This can be dynamically set if needed (e.g., from logged-in user's entreprise)
  entrepriseId = 1;

  constructor(
    private offreService: OffreService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOffres();
  }

  loadOffres() {
    this.isLoading = true;
    this.offreService.getAll().subscribe({
      next: (data) => {
        this.offres = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading offres', err);
        this.isLoading = false;
      }
    });
  }

  addOffre(): void {
    const dialogRef = this.dialog.open(EditOffreDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;

        // Attach entrepriseId explicitly to the result object
        result.entrepriseId = this.entrepriseId;

        this.offreService.create(result).subscribe({
          next: (newOffre) => {
            this.offres.push(newOffre);
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error creating offre', err);
            this.isLoading = false;
          }
        });
      }
    });
  }

  editOffre(offre: any): void {
    const dialogRef = this.dialog.open(EditOffreDialogComponent, {
      width: '400px',
      data: offre
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        this.offreService.update(result.id, result).subscribe({
          next: () => {
            const index = this.offres.findIndex(o => o.id === result.id);
            if (index !== -1) {
              this.offres[index] = result;
            }
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error updating offre', err);
            this.isLoading = false;
          }
        });
      }
    });
  }

  deleteOffre(id: number): void {
    if (confirm('Are you sure you want to delete this offer?')) {
      this.isLoading = true;
      this.offreService.delete(id).subscribe({
        next: () => {
          this.offres = this.offres.filter(o => o.id !== id);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error deleting offre', err);
          this.isLoading = false;
        }
      });
    }
  }

  goToDashboard() {
    this.router.navigate(['admin/profile']);
  }

  goToEntreprise() {
    this.router.navigate(['admin/entreprises']);
  }

  goToEvents() {
    this.router.navigate(['admin/evenements']);
  }

  goToOffrePFE() {
    console.log("Go to Student - OffrePFE");
  }

  goToEncadrants() {
    this.router.navigate(['admin/encadrant']);
  }
}
