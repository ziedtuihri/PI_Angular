// src/app/components/tache/listtache/listtache.component.ts

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TacheService } from '../../../services/tache.service';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

// New imports for the filter dropdown
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-listtache',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule, // Add this for the filter
    MatSelectModule     // Add this for the filter
  ],
  templateUrl: './listtache.component.html',
  styleUrl: './listtache.component.scss',
})
export class ListtacheComponent implements OnInit, AfterViewInit {
  // MODIFICATION: Removed 'sprint' from displayedColumns
  displayedColumns: string[] = ['nom', 'dateDebut', 'dateFin', 'statut', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  loading = true;
  errorMessage = '';
  currentSprintId: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private tacheService: TacheService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const sprintId = params.get('sprintId');
      if (sprintId) {
        this.currentSprintId = +sprintId;
        this.loadTachesBySprintId(this.currentSprintId);
      } else {
        this.currentSprintId = null;
        this.loadAllTaches();
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // MODIFICATION: Removed 'sprint' case from sortingDataAccessor
    this.dataSource.sortingDataAccessor = (item: any, property: string) => {
      switch (property) {
        // case 'sprint': return item.sprint ? item.sprint.nom : null; // Removed
        default: return item[property];
      }
    };
  }

  loadAllTaches(): void {
    this.loading = true;
    this.errorMessage = '';
    this.tacheService.getAllTaches().subscribe({
      next: (taches: any[]) => {
        this.dataSource.data = taches;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la récupération de toutes les tâches.';
        console.error('Error loading all tasks:', error);
        this.loading = false;
        this.snackBar.open(this.errorMessage, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
      },
    });
  }

  loadTachesBySprintId(sprintId: number): void {
    this.loading = true;
    this.errorMessage = '';
    this.tacheService.getTasksBySprintId(sprintId).subscribe({
      next: (taches: any[]) => {
        this.dataSource.data = taches;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = `Erreur lors de la récupération des tâches pour le sprint ID ${sprintId}.`;
        console.error(`Error loading tasks for sprint ${sprintId}:`, error);
        this.loading = false;
        this.snackBar.open(this.errorMessage, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
      },
    });
  }

  addTache(): void {
    if (this.currentSprintId) {
      this.router.navigate(['/sprints', this.currentSprintId, 'tasks', 'add']);
    } else {
      this.router.navigate(['/taches/add']);
    }
  }

  editTache(id: number): void {
    if (this.currentSprintId) {
      this.router.navigate(['/sprints', this.currentSprintId, 'tasks', 'edit', id]);
    } else {
      this.router.navigate(['/taches/edit', id]);
    }
  }

  viewTacheDetails(id: number): void {
    if (this.currentSprintId) {
      this.router.navigate(['/sprints', this.currentSprintId, 'tasks', 'details', id]);
    } else {
      this.router.navigate(['/taches/details', id]);
    }
  }

  deleteTache(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.tacheService.deleteTache(id).subscribe({
        next: () => {
          this.snackBar.open('Tâche supprimée avec succès', 'Fermer', { duration: 3000, panelClass: ['success-snackbar'] });
          if (this.currentSprintId) {
            this.loadTachesBySprintId(this.currentSprintId);
          } else {
            this.loadAllTaches();
          }
        },
        error: (error) => {
          this.snackBar.open('Erreur lors de la suppression de la tâche', 'Fermer', { duration: 3000, panelClass: ['error-snackbar'] });
          console.error('Error deleting task:', error);
        },
      });
    }
  }

  formatStatut(statut: string): string {
    switch (statut) {
      case 'TODO': return 'Non démarré';
      case 'IN_PROGRESS': return 'En cours';
      case 'DONE': return 'Terminée';
      case 'BLOCKED': return 'Bloquée';
      case 'REVIEW': return 'En révision';
      default: return statut;
    }
  }

  // MODIFICATION: Removed getSprintName method
  // getSprintName(tache: any): string {
  //   return tache.sprint ? tache.sprint.nom || 'Nom inconnu' : 'Non affecté';
  // }

  // MODIFICATION: Removed viewSprintDetails method
  // viewSprintDetails(sprintId: number): void {
  //   this.router.navigate(['/sprints/details', sprintId]);
  // }

  onStatusFilterChange(status: string): void {
    if (status === 'ALL') {
      if (this.currentSprintId) {
        this.loadTachesBySprintId(this.currentSprintId);
      } else {
        this.loadAllTaches();
      }
    } else {
      this.loading = true;
      this.errorMessage = '';
      this.tacheService.getTachesByStatus(status).subscribe({
        next: (taches: any[]) => {
          this.dataSource.data = taches;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = `Erreur lors de la récupération des tâches par statut ${status}.`;
          console.error(`Error loading tasks by status ${status}:`, error);
          this.loading = false;
          this.snackBar.open(this.errorMessage, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
        },
      });
    }
  }
}