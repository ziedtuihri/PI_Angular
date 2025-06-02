// src/app/pages/admin/sprint/sprint-tasks-dialog/sprint-tasks-dialog.component.ts

import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { SprintService, Sprint } from '../../../services/sprint.service';
import { CommonModule, DatePipe } from '@angular/common'; // DatePipe added here
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Subject, takeUntil } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Re-defining Tache interface based on your backend response structure
export interface Tache {
  idTache?: number;
  nom: string; // From your network tab, it's 'nom', not 'titre'
  description?: string;
  dateDebut: string;
  dateFin: string;
  statut: string;
  storyPoints?: number;
  estimatedHours?: number;
  loggedHours?: number;
  assignedTo?: any; // Assuming 'assignedTo' can be null or an object/string
}

@Component({
  selector: 'app-sprint-tasks-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatDialogModule // IMPORTANT: Make sure MatDialogModule is here
  ],
  providers: [DatePipe], // Explicitly provide DatePipe for use in the component or its template
  templateUrl: './sprint-tasks-dialog.component.html',
  styleUrls: ['./sprint-tasks-dialog.component.scss']
})
export class SprintTasksDialogComponent implements OnInit, OnDestroy {
  sprint: Sprint;
  tasks: Tache[] = [];
  loadingTasks = false;
  private destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { sprint: Sprint },
    private dialogRef: MatDialogRef<SprintTasksDialogComponent>,
    private sprintService: SprintService,
    private datePipe: DatePipe // Inject DatePipe if used in template for formatting
  ) {
    this.sprint = data.sprint;
    console.log('Sprint with tasks data received for dialog:', this.sprint);
  }

  ngOnInit(): void {
    if (this.sprint && this.sprint.idSprint) {
      this.loadSprintTasks(this.sprint.idSprint);
    } else {
      console.warn('Sprint ID is missing, cannot load tasks.');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSprintTasks(sprintId: number): void {
    this.loadingTasks = true;
    console.log('Attempting to load tasks for sprint ID:', sprintId);
    this.sprintService.getSprintWithTasks(sprintId)
      .pipe(takeUntil(this.destroy$)) // Prevent memory leaks
      .subscribe({
        next: (response: any) => {
          // Based on your network tab screenshot, the response is a Sprint object
          // with a 'taches' array inside it.
          if (response && Array.isArray(response.taches)) {
            this.tasks = response.taches;
          } else {
            console.warn('Backend response for sprint tasks does not contain a "taches" array or is not in expected format:', response);
            this.tasks = [];
          }
          this.loadingTasks = false;
          console.log('Tasks reloaded for sprint', sprintId, ':', this.tasks);
        },
        error: (error) => {
          console.error('Error loading tasks for sprint:', sprintId, error);
          this.tasks = [];
          this.loadingTasks = false;
          // You might want to show a MatSnackBar here too to inform the user
        }
      });
  }

  // Helper method to format task status for display
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

  closeDialog(): void {
    this.dialogRef.close();
  }
}