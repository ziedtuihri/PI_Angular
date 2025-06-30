import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EncadrantService } from 'src/app/services/Admin-Service/encadrant.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EditEncadrantDialogComponent } from './edit-encadrant-dialog.component';
import {Encadrant} from "../../../../models/encadrant.model";
import {EntrepriseService} from "../../../../services/Admin-Service/entreprise.service";


@Component({
  selector: 'app-encadrant-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule,
    EditEncadrantDialogComponent,
    MatToolbarModule
  ],
  templateUrl: './encadrant.component.html',
  styleUrls: ['./encadrant.component.css']
})
export class EncadrantComponent implements OnInit {
  displayedColumns = ['id', 'nom', 'prenom', 'email', 'entreprise', 'actions'];
  encadrants: Encadrant[] = [];
  entreprises: any[] = [];
  isLoading = false;

  constructor(
    private encadrantService: EncadrantService,
    private entrepriseService: EntrepriseService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEntreprises();
    this.loadEncadrants();
  }

  loadEntreprises() {
    this.entrepriseService.getAll().subscribe({
      next: data => {
        this.entreprises = data;
      },
      error: err => {
        console.error('Error loading entreprises', err);
      }
    });
  }

  loadEncadrants() {
    this.isLoading = true;
    this.encadrantService.getAll().subscribe({
      next: data => {
        this.encadrants = data;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error loading encadrants', err);
        this.isLoading = false;
      }
    });
  }

  // Optional: load encadrants by entreprise
  loadEncadrantsByEntreprise(entrepriseId: number) {
    this.isLoading = true;
    this.encadrantService.getByEntreprise(entrepriseId).subscribe({
      next: data => {
        this.encadrants = data;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error loading encadrants by entreprise', err);
        this.isLoading = false;
      }
    });
  }

  editEncadrant(encadrant: Encadrant) {
    const dialogRef = this.dialog.open(EditEncadrantDialogComponent, {
      width: '400px',
      data: {
        ...encadrant,
        entreprises: this.entreprises
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.encadrantService.update(result.id!, result).subscribe({
          next: () => {
            const index = this.encadrants.findIndex(e => e.id === result.id);
            if (index !== -1) {
              this.encadrants[index] = result;
            }
            this.isLoading = false;
          },
          error: err => {
            console.error('Error updating encadrant', err);
            this.isLoading = false;
          }
        });
      }
    });
  }

  getEntrepriseNameById(id: number): string {
    const entreprise = this.entreprises.find(e => e.id === id);
    return entreprise ? entreprise.nom : 'N/A';
  }

  addEncadrant() {
    const dialogRef = this.dialog.open(EditEncadrantDialogComponent, {
      width: '400px',
      data: {
        entreprises: this.entreprises
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;

        // If entreprise is selected, call createForEntreprise, else generic create
        if (result.entreprise && result.entreprise.id) {
          this.encadrantService.createForEntreprise(result.entreprise.id, result).subscribe({
            next: (newEncadrant) => {
              this.encadrants.push(<Encadrant>newEncadrant);
              this.isLoading = false;
            },
            error: err => {
              console.error('Error adding encadrant for entreprise', err);
              this.isLoading = false;
            }
          });
        } else {
          this.encadrantService.create(result).subscribe({
            next: (newEncadrant) => {
              this.encadrants.push(<Encadrant>newEncadrant);
              this.isLoading = false;
            },
            error: err => {
              console.error('Error adding encadrant', err);
              this.isLoading = false;
            }
          });
        }
      }
    });
  }

  deleteEncadrant(id: number) {
    this.isLoading = true;
    this.encadrantService.delete(id).subscribe({
      next: () => {
        this.encadrants = this.encadrants.filter(e => e.id !== id);
        this.isLoading = false;
      },
      error: err => {
        console.error('Error deleting encadrant', err);
        this.isLoading = false;
      }
    });
  }

  // Navigation helpers (unchanged)
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToEntreprise(): void {
    this.router.navigate(['admin/entreprises']);
  }

  goToEvents(): void {
    this.router.navigate(['admin/evenements']);
  }

  goToOffrePFE(): void {
    this.router.navigate(['admin/offres']);
  }
}

