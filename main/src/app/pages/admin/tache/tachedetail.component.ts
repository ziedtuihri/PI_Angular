// src/app/components/tachedetail/tachedetail.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { TacheService } from '../../../services/tache.service';
import { SprintService } from '../../../services/sprint.service'; // Import SprintService
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

// Import Tache from TacheService
import { Tache } from '../../../services/tache.service';
// Import Sprint and Etudiant from SprintService
import { Sprint } from '../../../services/sprint.service'; // Corrected import for Sprint and Etudiant


@Component({
  selector: 'app-tache-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatChipsModule,
    FormsModule
  ],
  providers: [DatePipe],
  templateUrl: './tachedetail.component.html',
  styleUrl: './tachedetail.component.scss'
})
export class TacheDetailsComponent implements OnInit, OnDestroy {
  tacheId: number = 0;
  tacheDetails: Tache | null = null;
  private previousSprintId: number | null = null;

  hoursToLog: number | null = null;
  message: string | null = null;
  isSuccess: boolean = true;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private tacheService: TacheService,
    private router: Router,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.tacheId = +idParam;
        this.getTacheDetails(this.tacheId);
      } else {
        this.snackBar.open('ID de tâche manquant dans l\'URL.', 'Fermer', { duration: 3000 });
        this.router.navigate(['/taches']);
      }

      const sprintIdParam = params.get('sprintId');
      if (sprintIdParam) {
        this.previousSprintId = +sprintIdParam;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTacheDetails(id: number): void {
    this.tacheService.getTacheById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: Tache) => {
        this.tacheDetails = data;
        console.log('Détails de la tâche:', this.tacheDetails);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des détails de la tâche', error);
        this.snackBar.open('Erreur lors du chargement de la tâche.', 'Fermer', { duration: 3000 });
        this.router.navigate(['/taches']);
      }
    });
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

  viewSprintDetails(sprintId: number): void {
    this.router.navigate(['/sprints/details', sprintId]);
  }

  onLogTime(): void {
    if (this.tacheId && this.hoursToLog !== null && this.hoursToLog > 0) {
      this.tacheService.logTimeOnTask(this.tacheId, this.hoursToLog).pipe(takeUntil(this.destroy$)).subscribe({
        next: (updatedTache) => {
          this.tacheDetails = updatedTache;
          this.hoursToLog = null;
          this.snackBar.open('Heures loguées avec succès !', 'Fermer', { duration: 3000 });
          this.message = 'Heures loguées avec succès !';
          this.isSuccess = true;
          console.log('Logged hours updated:', updatedTache);
        },
        error: (error) => {
          console.error('Erreur lors de l\'enregistrement des heures:', error);
          this.snackBar.open('Erreur lors de l\'enregistrement des heures.', 'Fermer', { duration: 3000 });
          this.message = 'Erreur lors de l\'enregistrement des heures.';
          this.isSuccess = false;
          if (error.error && typeof error.error === 'string') {
              this.snackBar.open(`Erreur: ${error.error}`, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
          }
        }
      });
    } else {
      this.snackBar.open('Veuillez entrer un nombre positif d\'heures à loguer.', 'Fermer', { duration: 3000 });
      this.message = 'Veuillez entrer un nombre positif d\'heures à loguer.';
      this.isSuccess = false;
    }
  }
}