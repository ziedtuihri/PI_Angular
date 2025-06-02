// src/app/components/sprint/sprint-list/sprint-list.component.ts

import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { Sprint, SprintService } from '../../../services/sprint.service';
import { MatDividerModule } from '@angular/material/divider';
import { VelocityChartComponent } from '../velocity-chart/velocity-chart.component';

// Interface pour les données de vélocité du graphique
interface ChartSprintData {
  sprintName: string;
  committedPoints: number;
  completedPoints: number;
}

@Component({
  selector: 'app-sprint-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    RouterModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    VelocityChartComponent,
    ReactiveFormsModule
  ],
  templateUrl: './sprint-list.component.html', // Assurez-vous que ce fichier HTML est à jour
  styleUrls: ['./sprint-list.component.scss'],
  providers: [DatePipe],
})
export class SprintListComponent implements OnInit, OnDestroy, AfterViewInit {
  sprints: Sprint[] = []; // Garde une copie brute des données si nécessaire
  displayedColumns: string[] = [
    'nom',
    'dateDebut',
    'dateFin',
    'statut',
    'isUrgent',
    'velocity',
    'actions',
    'viewTasks',
    'addTask',
  ];
  dataSource = new MatTableDataSource<Sprint>([]);
  loading = false;
  private destroy$ = new Subject<void>();
  errorMessage: string = '';

  // Pagination
  pageSize = 5;
  pageIndex = 0;
  totalSprints = 0;

  // Contrôle de recherche
  searchControl = new FormControl('');

  // Données pour le graphique de vélocité
  sprintsForChart: ChartSprintData[] = []; // Utilisation de l'interface ChartSprintData

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private sprintService: SprintService,
    private router: Router,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar
  ) {
    console.log('SprintListComponent: Constructor called.');
  }

  // --- Hooks de cycle de vie ---
  ngOnInit(): void {
    console.log('SprintListComponent: ngOnInit called.');
    this.loadSprints(); // Charge les sprints au démarrage

    // S'abonne aux changements de valeur du contrôle de recherche
    this.searchControl.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.applyFilter(value || '');
    });
  }

  ngAfterViewInit(): void {
    console.log('SprintListComponent: ngAfterViewInit started.');
    // Assigne paginator et sort à dataSource après l'initialisation de la vue
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
      // Définit le tri personnalisé si nécessaire
      this.dataSource.sortingDataAccessor = (item: Sprint, property: string) => {
        switch (property) {
          // Ajoutez des cas pour des propriétés imbriquées si 'item[property]' ne fonctionne pas
          // case 'projectName': return item.project?.name;
          default: return (item as any)[property];
        }
      };
    }
  }

  ngOnDestroy(): void {
    console.log('SprintListComponent: ngOnDestroy called.');
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- Chargement des données ---
  loadSprints(): void {
    console.log('SprintListComponent: loadSprints called. Setting loading = true.');
    this.loading = true;
    this.errorMessage = '';

    this.sprintService.getAllSprints()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Sprint[]) => {
          console.log('SprintListComponent: Sprints loaded successfully.');
          this.sprints = data;
          this.dataSource.data = data;
          this.totalSprints = data.length;
          this.loading = false;

          // Charge les données de vélocité pour le graphique
          this.loadVelocityChartData();

          console.log('Sprints array:', this.sprints);
          if (data.length === 0) {
            console.log('SprintListComponent: No sprints found in the response.');
            this.snackBar.open('Aucun sprint trouvé.', 'Fermer', { duration: 3000, panelClass: ['info-snackbar'] });
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('SprintListComponent: Error loading sprints:', err);
          this.loading = false;
          let userMessage = 'Erreur lors du chargement des sprints. Veuillez réessayer.';

          if (err.error instanceof ErrorEvent) {
            userMessage = `Erreur réseau: ${err.error.message}`;
          } else if (err.error && typeof err.error === 'string') {
            userMessage = err.error;
          } else if (err.error && typeof err.error === 'object' && err.error.message) {
            userMessage = err.error.message;
          } else if (err.status) {
            userMessage = `Erreur ${err.status}: ${err.statusText || 'Problème de serveur.'}`;
          }

          this.errorMessage = userMessage;
          this.snackBar.open(userMessage, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
        },
      });
  }

  /**
   * Charge les données historiques de vélocité pour le graphique.
   */
  loadVelocityChartData(): void {
    this.sprintService.getVelocityHistory()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any[]) => { // Le backend renvoie List<Object[]>
          this.sprintsForChart = data.map(item => ({
            sprintName: item[0],
            committedPoints: item[1],
            completedPoints: item[2]
          }));
          console.log('Velocity data loaded for chart:', this.sprintsForChart);
        },
        error: (err) => {
          console.error('Error loading velocity history for chart:', err);
          // Gérer l'erreur, par exemple afficher un message à l'utilisateur
          this.snackBar.open('Impossible de charger les données de vélocité du graphique.', 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
        }
      });
  }

  // --- Méthodes de pagination et de filtre ---
  handlePageEvent(event: PageEvent): void {
    console.log('Page event:', event);
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    // Si vous faites de la pagination côté serveur, vous feriez un appel API ici
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log('Applying filter:', this.dataSource.filter);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage(); // Réinitialise la pagination à la première page lors du changement de filtre
    }
  }

  // --- Navigation et actions ---
  onAddSprint(): void {
    console.log('SprintListComponent: Navigating to add new sprint form.');
    this.router.navigate(['/sprint/form']);
  }

  onEditSprint(id?: number): void {
    if (id !== undefined && id !== null) {
      console.log('SprintListComponent: Navigating to edit sprint with ID:', id);
      this.router.navigate(['/sprint/form', id]);
    } else {
      console.warn('SprintListComponent: Cannot edit sprint: ID is undefined or null.');
      this.snackBar.open('ID du sprint non défini pour la modification.', 'Fermer', { duration: 3000, panelClass: ['warning-snackbar'] });
    }
  }

  onDeleteSprint(id?: number): void {
    if (id === undefined || id === null) {
      console.warn('SprintListComponent: Cannot delete sprint: ID is undefined or null.');
      this.snackBar.open('ID du sprint non défini pour la suppression.', 'Fermer', { duration: 3000, panelClass: ['warning-snackbar'] });
      return;
    }
    if (confirm('Voulez-vous vraiment supprimer ce sprint ? Cette action est irréversible.')) {
      console.log('SprintListComponent: Deleting sprint with ID:', id);
      this.sprintService.deleteSprint(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log('SprintListComponent: Sprint deleted successfully, reloading sprints.');
            this.snackBar.open('Sprint supprimé avec succès !', 'Fermer', { duration: 3000, panelClass: ['success-snackbar'] });
            this.loadSprints(); // Recharge la liste après la suppression
          },
          error: (err: HttpErrorResponse) => {
            console.error('SprintListComponent: Error deleting sprint:', err);
            let userMessage = 'Erreur lors de la suppression du sprint.';
            if (err.error && typeof err.error === 'string') {
              userMessage = err.error;
            } else if (err.message) {
              userMessage = err.message;
            }
            this.snackBar.open(userMessage, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
          },
        });
    }
  }

  onViewSprintDetail(id?: number): void {
    if (id !== undefined && id !== null) {
      console.log('SprintListComponent: Navigating to sprint details for ID:', id);
      this.router.navigate(['/sprints', id, 'tasks']); // Ou naviguez vers une liste de tâches spécifique à ce sprint
    } else {
      console.warn('SprintListComponent: Cannot view sprint details: ID is undefined or null.');
      this.snackBar.open('ID du sprint non défini pour les détails.', 'Fermer', { duration: 3000, panelClass: ['warning-snackbar'] });
    }
  }

  addTaskToSprint(sprintId: number): void {
    console.log('SprintListComponent: Navigating to add task to sprint ID:', sprintId);
    this.router.navigate(['/sprints', sprintId, 'tasks', 'add']); // Ajustez cette route selon votre configuration de routage
  }

  /**
   * Navigates to the calendar view.
   */
  navigateToCalendar(): void {
    console.log('SprintListComponent: Navigating to calendar view.');
    // Assurez-vous que '/calendar' est la route correcte pour votre composant de calendrier
    this.router.navigate(['/calendar']);
  }

  // --- Méthodes d'aide pour l'affichage ---
  formatStatut(statut: string): string {
    switch (statut) {
      case 'PLANNED': return 'Planifié';
      case 'IN_PROGRESS': return 'En Cours';
      case 'COMPLETED': return 'Terminé';
      case 'CANCELED': return 'Annulé';
      default: return statut;
    }
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'PLANNED': return 'badge bg-light-info text-info';
      case 'IN_PROGRESS': return 'badge bg-light-warning text-warning';
      case 'COMPLETED': return 'badge bg-light-success text-success';
      case 'CANCELED': return 'badge bg-light-danger text-danger';
      default: return 'badge bg-light-secondary text-secondary';
    }
  }
}