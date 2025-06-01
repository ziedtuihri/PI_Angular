import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { EntrepriseEncadrantService } from 'src/app/services/Entreprise.Service/entreprise-encadrant.service';
import { Encadrant } from 'src/app/models/encadrant.model';
import { EditEncadrantDialogComponent } from './edit-encadrant-dialog.component';
import {Router} from "@angular/router"; // Assume exists for edit/create dialog

@Component({
  selector: 'app-entreprise-encadrant',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule,
    EditEncadrantDialogComponent
  ],
  templateUrl: './entreprise-encadrant.component.html',
  styleUrls: ['./entreprise-encadrant.component.css']
})
export class EntrepriseEncadrantComponent implements OnInit {
  encadrants: Encadrant[] = [];
  filteredEncadrants: Encadrant[] = [];
  isLoading = false;

  // Form control for filtering by competence
  competenceFilter = new FormControl('');

  displayedColumns = ['id', 'nom', 'prenom', 'email', 'telephone', 'specialite', 'actions'];

  constructor(
    private encadrantService: EntrepriseEncadrantService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEncadrants();

    // React to filter changes
    this.competenceFilter.valueChanges.subscribe(value => {
      this.applyFilter(value);
    });
  }

  loadEncadrants() {
    this.isLoading = true;
    this.encadrantService.getEncadrants().subscribe({
      next: (data) => {
        this.encadrants = data;
        this.filteredEncadrants = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading encadrants', err);
        this.isLoading = false;
      }
    });
  }
  goToDashboard() {
    this.router.navigate(['entreprise/dashboard']);
  }

  applyFilter(filterValue: string | null) {
    if (!filterValue) {
      this.filteredEncadrants = this.encadrants;
    } else {
      const filterLower = filterValue.toLowerCase();
      this.filteredEncadrants = this.encadrants.filter(e =>
        e.specialite.toLowerCase().includes(filterLower)
      );
    }
  }

  openEditDialog(encadrant?: Encadrant) {
    const dialogRef = this.dialog.open(EditEncadrantDialogComponent, {
      width: '400px',
      data: encadrant ? { ...encadrant } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      if (result.id) {
        this.encadrantService.updateEncadrant(result.id, result).subscribe(() => this.loadEncadrants());
      } else {
        this.encadrantService.createEncadrant(result).subscribe(() => this.loadEncadrants());
      }
    });
  }

  deleteEncadrant(id: number) {
    if (!confirm('Are you sure you want to delete this encadrant?')) return;

    this.isLoading = true;
    this.encadrantService.deleteEncadrant(id).subscribe({
      next: () => this.loadEncadrants(),
      error: (err) => {
        console.error('Error deleting encadrant', err);
        this.isLoading = false;
      }
    });
  }
}
