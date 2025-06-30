import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EntrepriseService } from '../../../../services/Admin-Service/entreprise.service';
import { EditEntrepriseDialogComponent } from './edit-entreprise-dialog.component';
import { MatToolbar } from "@angular/material/toolbar";  // Adjust path if needed

@Component({
  selector: 'app-entreprise-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule,
    MatDialogModule,
    EditEntrepriseDialogComponent,
    MatToolbar
  ],
  templateUrl: './entreprise-list.component.html',
  styleUrls: ['./entreprise-list.component.css']
})
export class EntrepriseListComponent implements OnInit {
  displayedColumns = ['id', 'name', 'email', 'status', 'actions'];
  entreprises: any[] = [];
  isLoading = false;

  constructor(
    private entrepriseService: EntrepriseService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEntreprises();
  }

  loadEntreprises() {
    this.isLoading = true;
    this.entrepriseService.getAll().subscribe({
      next: (data) => {
        this.entreprises = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading entreprises', err);
        this.isLoading = false;
      }
    });
  }

  validate(id: number) {
    this.isLoading = true;
    this.entrepriseService.validate(id).subscribe({
      next: () => this.loadEntreprises(),
      error: (err) => {
        console.error('Error validating entreprise', err);
        this.isLoading = false;
      }
    });
  }

  refuse(id: number) {
    this.isLoading = true;
    this.entrepriseService.refuse(id).subscribe({
      next: () => this.loadEntreprises(),
      error: (err) => {
        console.error('Error refusing entreprise', err);
        this.isLoading = false;
      }
    });
  }

  editEntreprise(entreprise: any) {
    const dialogRef = this.dialog.open(EditEntrepriseDialogComponent, {
      width: '400px',
      data: entreprise // passing the current entreprise data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        // Update the entreprise using the returned result from the dialog
        this.entrepriseService.update(result.id, result).subscribe({
          next: () => {
            // Update the entreprise directly in the list without reloading
            const index = this.entreprises.findIndex(e => e.id === result.id);
            if (index !== -1) {
              this.entreprises[index] = result; // Replace the updated entreprise in the list
            }
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error updating entreprise', err);
            this.isLoading = false;
          }
        });
      }
    });
  }

  addEntreprise() {
    const dialogRef = this.dialog.open(EditEntrepriseDialogComponent, {
      width: '400px',
      data: {}  // Pass an empty object for creating a new entreprise
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.entrepriseService.create(result).subscribe({
          next: (newEntreprise) => {
            this.entreprises.push(newEntreprise); // Add the new entreprise to the list
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error adding entreprise', err);
            this.isLoading = false;
          }
        });
      }
    });
  }

  viewDetails(id: number) {
    console.log('View details for entreprise:', id);
  }

  refreshList() {
    this.loadEntreprises();
  }

  // Method to navigate back to the dashboard
  goToDashboard() {
    this.router.navigate(['admin/profile']);
  }

  // Empty method definitions to avoid errors
  goToEntreprise() {
    console.log("Go to Entreprise");
  }

  goToEvents() {
    this.router.navigate(['admin/evenements']);
  }

  goToOffrePFE() {
    this.router.navigate(['admin/offres']);
  }

  goToEncadrants() {
    this.router.navigate(['admin/encadrant']);
  }
}
