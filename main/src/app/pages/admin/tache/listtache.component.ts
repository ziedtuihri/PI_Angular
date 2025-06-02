// src/app/components/tache/listtache/listtache.component.ts

import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core'; // Added OnDestroy
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

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './listtache.component.html',
  styleUrl: './listtache.component.scss',
})
export class ListtacheComponent implements OnInit, AfterViewInit, OnDestroy { // Implemented OnDestroy
  displayedColumns: string[] = ['nom', 'dateDebut', 'dateFin', 'statut', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  loading = true;
  errorMessage = '';
  currentSprintId: number | null = null;
  private destroy$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private tacheService: TacheService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('ListTacheComponent: ngOnInit started.');
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const sprintId = params.get('sprintId');
      console.log('ListTacheComponent: route paramMap changed. sprintId:', sprintId);
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
    console.log('ListTacheComponent: ngAfterViewInit started.');
    // Ensure paginator and sort are defined before assigning
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item: any, property: string) => {
        switch (property) {
          default: return item[property];
        }
      };
    }
  }

  ngOnDestroy(): void {
    console.log('ListTacheComponent: ngOnDestroy called.');
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadAllTaches(): void {
    console.log('ListTacheComponent: Loading all tasks...');
    this.loading = true;
    this.errorMessage = '';
    this.tacheService.getAllTaches().pipe(takeUntil(this.destroy$)).subscribe({
      next: (taches: any[]) => {
        console.log('ListTacheComponent: All tasks loaded successfully:', taches);
        this.dataSource.data = taches;
        this.loading = false;
        if (taches.length === 0) {
          this.snackBar.open('Aucune tâche trouvée.', 'Fermer', { duration: 3000, panelClass: ['info-snackbar'] });
        }
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la récupération de toutes les tâches.';
        console.error('ListTacheComponent: Error loading all tasks:', error);
        this.loading = false;
        this.snackBar.open(this.errorMessage, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
      },
    });
  }

  loadTachesBySprintId(sprintId: number): void {
    console.log(`ListTacheComponent: Loading tasks for sprint ID: ${sprintId}...`);
    this.loading = true;
    this.errorMessage = '';
    this.tacheService.getTasksBySprintId(sprintId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (taches: any[]) => {
        console.log(`ListTacheComponent: Tasks for sprint ${sprintId} loaded successfully:`, taches);
        this.dataSource.data = taches;
        this.loading = false;
        if (taches.length === 0) {
          this.snackBar.open(`Aucune tâche trouvée pour le sprint ID ${sprintId}.`, 'Fermer', { duration: 3000, panelClass: ['info-snackbar'] });
        }
      },
      error: (error) => {
        this.errorMessage = `Erreur lors de la récupération des tâches pour le sprint ID ${sprintId}.`;
        console.error(`ListTacheComponent: Error loading tasks for sprint ${sprintId}:`, error);
        this.loading = false;
        this.snackBar.open(this.errorMessage, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
      },
    });
  }

  addTache(): void {
    console.log('ListTacheComponent: Navigating to add task...');
    if (this.currentSprintId) {
      this.router.navigate(['/sprints', this.currentSprintId, 'tasks', 'add']);
    } else {
      this.router.navigate(['/taches/add']);
    }
  }

  editTache(id: number): void {
    console.log('ListTacheComponent: Navigating to edit task ID:', id);
    if (this.currentSprintId) {
      this.router.navigate(['/sprints', this.currentSprintId, 'tasks', 'edit', id]);
    } else {
      this.router.navigate(['/taches/edit', id]);
    }
  }

  viewTacheDetails(id: number): void {
    console.log('ListTacheComponent: Navigating to task details ID:', id);
    if (this.currentSprintId) {
      this.router.navigate(['/sprints', this.currentSprintId, 'tasks', 'details', id]);
    } else {
      this.router.navigate(['/taches/details', id]);
    }
  }

  deleteTache(id: number): void {
    console.log('ListTacheComponent: Attempting to delete task ID:', id);
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.tacheService.deleteTache(id).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.snackBar.open('Tâche supprimée avec succès', 'Fermer', { duration: 3000, panelClass: ['success-snackbar'] });
          console.log('ListTacheComponent: Task deleted successfully. Reloading tasks...');
          if (this.currentSprintId) {
            this.loadTachesBySprintId(this.currentSprintId);
          } else {
            this.loadAllTaches();
          }
        },
        error: (error) => {
          this.snackBar.open('Erreur lors de la suppression de la tâche', 'Fermer', { duration: 3000, panelClass: ['error-snackbar'] });
          console.error('ListTacheComponent: Error deleting task:', error);
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

  onStatusFilterChange(status: string): void {
    console.log('ListTacheComponent: Status filter changed to:', status);
    if (status === 'ALL') {
      if (this.currentSprintId) {
        this.loadTachesBySprintId(this.currentSprintId);
      } else {
        this.loadAllTaches();
      }
    } else {
      this.loading = true;
      this.errorMessage = '';
      this.tacheService.getTachesByStatus(status).pipe(takeUntil(this.destroy$)).subscribe({
        next: (taches: any[]) => {
          console.log(`ListTacheComponent: Tasks by status "${status}" loaded successfully:`, taches);
          this.dataSource.data = taches;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = `Erreur lors de la récupération des tâches par statut ${status}.`;
          console.error(`ListTacheComponent: Error loading tasks by status ${status}:`, error);
          this.loading = false;
          this.snackBar.open(this.errorMessage, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
        },
      });
    }
  }
}