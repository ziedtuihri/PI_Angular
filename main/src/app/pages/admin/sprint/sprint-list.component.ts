// src/app/components/sprint/sprint-list.component.ts

import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { SprintService, Sprint } from '../../../services/sprint.service'; // Import SprintService and Sprint interface
import { Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SprintTasksDialogComponent } from './sprint-tasks-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { VelocityChartComponent } from '../velocity-chart/velocity-chart.component'; // Import VelocityChartComponent
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-sprint-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    DatePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatDividerModule,
    VelocityChartComponent, // Ensure VelocityChartComponent is correctly imported for standalone component
  ],
  templateUrl: './sprint-list.component.html',
  styleUrls: ['./sprint-list.component.scss'],
})
export class SprintListComponent implements OnInit, AfterViewInit {
  sprints: Sprint[] = [];
  displayedColumns: string[] = ['nom', 'dateDebut', 'dateFin', 'statut', 'velocity', 'actions', 'viewTasks', 'addTask'];
  dataSource = new MatTableDataSource<Sprint>(this.sprints);
  loading = true;
  errorMessage = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  searchControl = new FormControl('');
  pageSize = 5;
  pageIndex = 0;

  // Property to hold velocity data for the chart (history of completed sprints)
  // This data will be structured as expected by the VelocityChartComponent's 'sprintsData' input.
  sprintsForChart: any[] = [];

  constructor(
    private sprintService: SprintService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadSprints();
    this.setupSearch();
    this.loadVelocityData();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      // Manually trigger change detection to avoid ExpressionChangedAfterItHasBeenCheckedError
      this.changeDetectorRef.detectChanges();
    } else {
      console.warn('MatPaginator not found for dataSource. Paginator might not function correctly.');
    }
  }

  /**
   * Loads all sprints from the SprintService.
   */
  loadSprints(): void {
    this.loading = true;
    this.sprintService.getAllSprints().subscribe({
      next: (sprints: Sprint[]) => {
        this.sprints = sprints;
        this.dataSource.data = sprints; // Update MatTableDataSource
        this.loading = false;
        this.changeDetectorRef.detectChanges();

        // Fetch individual sprint velocities after loading all
        this._fetchVelocities(this.sprints);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = 'Erreur lors du chargement des sprints. Veuillez réessayer.';
        console.error('Erreur chargement sprints:', error);
        this.loading = false;
        this.snackBar.open(this.errorMessage, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
      },
    });
  }

  /**
   * Fetches the velocity for each sprint individually and updates the table data.
   * Uses forkJoin to wait for all velocity calculations before updating the chart data.
   * @param sprints The array of sprints to fetch velocities for.
   */
  private _fetchVelocities(sprints: Sprint[]): void {
    if (!sprints || sprints.length === 0) {
      this.sprintsForChart = [];
      return;
    }

    const velocityObservables = sprints.map(sprint =>
      sprint.idSprint
        ? this.sprintService.calculateSprintVelocity(sprint.idSprint).pipe(
            tap(velocity => sprint.velocity = velocity), // Assign velocity to sprint object
            catchError(err => {
              console.error(`Error calculating velocity for Sprint ID ${sprint.idSprint}:`, err);
              sprint.velocity = -1; // Indicate an error or not calculable
              return of(-1); // Return a default value to allow forkJoin to complete
            })
          )
        : of(0) // Default velocity for sprints without an ID
    );

    // Use forkJoin to wait for all velocity calculations to complete
    forkJoin(velocityObservables).subscribe({
      next: () => {
        // After all velocities are calculated, update the data source to trigger table refresh
        this.dataSource.data = [...this.sprints]; // Create a new array reference to trigger change detection
        this.loadVelocityData(); // Then, reload the chart data as all table data is ready
      },
      error: (err) => {
        console.error('Error in batch velocity fetching for table:', err);
        this.snackBar.open('Certaines vélocités n\'ont pas pu être calculées.', 'Fermer', { duration: 3000, panelClass: ['warning-snackbar'] });
      }
    });
  }

  /**
   * Loads historical velocity data specifically for the velocity chart.
   */
  loadVelocityData(): void {
    this.sprintService.getVelocityHistory().subscribe({
      next: (data: any[]) => {
        // Assuming data structure from backend is suitable for chart:
        // [{ sprintName: 'Sprint X', completedPoints: 20, committedPoints: 25 }, ...]
        this.sprintsForChart = data;
        console.log('Velocity Data for Chart:', this.sprintsForChart);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading velocity history for chart:', error);
        this.snackBar.open('Erreur lors du chargement des données de vélocité pour le graphique.', 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
      }
    });
  }

  /**
   * Sets up the search functionality with debounce and distinctUntilChanged.
   */
  setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Wait for 300ms pause in typing
        distinctUntilChanged(), // Only emit if value has changed
        tap(() => this.loading = true), // Show spinner immediately on search input
        switchMap((term: string | null) => {
          if (term && term.trim()) {
            console.log('Recherche par terme:', term);
            return this.sprintService.searchSprints(term).pipe(
              catchError((err) => {
                console.error('Search API error:', err);
                return of([]); // Return empty array on error to prevent breaking the stream
              })
            );
          } else {
            console.log('Rechargement de tous les sprints (terme de recherche vide)...');
            return this.sprintService.getAllSprints().pipe(
              catchError((err) => {
                console.error('Get All Sprints API error during search reset:', err);
                return of([]); // Return empty array on error
              })
            );
          }
        })
      )
      .subscribe({
        next: (results: Sprint[]) => {
          this.sprints = results;
          this.dataSource.data = results; // Update MatTableDataSource
          this.loading = false;
          this.changeDetectorRef.detectChanges();
          this._fetchVelocities(this.sprints); // Re-fetch velocities for new search results
        },
        error: (error: HttpErrorResponse) => {
          this.errorMessage = 'Erreur lors de la recherche des sprints.';
          console.error('Erreur recherche sprints', error);
          this.loading = false;
          this.snackBar.open(this.errorMessage, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
        },
      });
  }

  /**
   * Handles page changes in the MatPaginator.
   * @param event PageEvent object containing page index and page size.
   */
  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    // Note: MatTableDataSource handles pagination automatically on the client-side.
    // If you were implementing server-side pagination, you would make an API call here.
  }

  /**
   * Navigates to the sprint edit form.
   * @param id The ID of the sprint to edit.
   */
  editSprint(id: number): void {
    this.router.navigate(['/sprints', id, 'edit']);
  }

  /**
   * Navigates to the page for managing students associated with a sprint.
   * @param id The ID of the sprint.
   */
  viewEtudiants(id: number): void {
    this.router.navigate(['/sprints', id, 'etudiants', 'manage']);
  }

  /**
   * Deletes a sprint after user confirmation.
   * @param id The ID of the sprint to delete.
   */
  deleteSprint(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce sprint ? Cette action est irréversible.')) {
      this.sprintService.deleteSprint(id).subscribe({
        next: () => {
          this.snackBar.open('Sprint supprimé avec succès !', 'Fermer', { duration: 3000, panelClass: ['success-snackbar'] });
          this.loadSprints(); // Reload list after deletion
          this.loadVelocityData(); // Reload velocity data after deletion
        },
        error: (error: HttpErrorResponse) => {
          let msg = 'Erreur lors de la suppression du sprint.';
          if (error.status === 404) {
            msg = 'Le sprint n\'a pas été trouvé ou a déjà été supprimé.';
          } else if (error.error?.message) {
             msg = `Erreur: ${error.error.message}`;
          }
          this.errorMessage = msg;
          console.error('Erreur suppression sprint', error);
          this.snackBar.open(this.errorMessage, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
        },
      });
    }
  }

  /**
   * Navigates to the sprint creation form.
   */
  addSprint(): void {
    this.router.navigate(['/sprints', 'add']);
  }

  /**
   * Opens a dialog to display tasks associated with a sprint.
   * @param sprintId The ID of the sprint whose tasks are to be viewed.
   */
  viewTasks(sprintId: number): void {
    this.sprintService.getSprintWithTasks(sprintId).subscribe({
      next: (sprintWithTasks: Sprint) => {
        console.log('Sprint with tasks data received for dialog:', sprintWithTasks);
        this.dialog.open(SprintTasksDialogComponent, {
          width: '80%',
          maxHeight: '90vh',
          data: { sprint: sprintWithTasks } // Pass the entire sprint object with tasks
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erreur lors du chargement des tâches du sprint', error);
        let msg = 'Impossible de charger les tâches pour ce sprint. Veuillez réessayer.';
        if (error.status === 404) {
            msg = 'Le sprint n\'existe pas ou aucune tâche n\'a été trouvée.';
        } else if (error.error?.message) {
             msg = `Erreur: ${error.error.message}`;
        }
        this.snackBar.open(msg, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
      }
    });
  }

  /**
   * Navigates to the task creation form for a specific sprint.
   * @param sprintId The ID of the sprint to which a task will be added.
   */
  addTaskToSprint(sprintId: number): void {
    this.router.navigate(['/sprints', sprintId, 'tasks', 'add']);
  }

  /**
   * Returns a CSS class based on the sprint status for styling.
   * @param statut The sprint status string.
   * @returns Corresponding CSS class.
   */
  getStatutClass(statut: string): string {
    switch (statut) {
      case 'PLANNED':
        return 'statut-planifie';
      case 'IN_PROGRESS':
        return 'statut-en-cours';
      case 'CANCELLED':
        return 'statut-annule';
      case 'COMPLETED':
        return 'statut-termine';
      case 'NOTSTARTED':
        return 'statut-non-demarre';
      case 'OVERDUE':
        return 'statut-en-retard';
      default:
        return '';
    }
  }

  /**
   * Navigates to a general calendar view (if applicable).
   */
  openGeneralCalendar(): void {
    this.router.navigate(['/general-calendar']);
  }
}