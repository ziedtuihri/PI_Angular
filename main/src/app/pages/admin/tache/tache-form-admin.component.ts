// src/app/pages/admin/tache-form/tache-form.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TacheService ,Tache ,CreateUpdateTacheDto } from 'src/app/services/tache.service';
import { SprintService ,Sprint } from 'src/app/services/sprint.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil, forkJoin } from 'rxjs'; // Import forkJoin
import { tap, first } from 'rxjs/operators'; // Import first

@Component({
  selector: 'app-tache-form',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    RouterModule
  ],
  providers: [DatePipe],
  templateUrl: './tache-form-admin.component.html',
})
export class TacheFormComponent implements OnInit, OnDestroy {
  tacheForm!: FormGroup;
  editMode = false;
  tacheId?: string | null;
  sprints: Sprint[] = [];
  private destroy$ = new Subject<void>();
  private initialSprintId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private tacheService: TacheService,
    private sprintService: SprintService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.tacheId = this.route.snapshot.paramMap.get('id');
    this.editMode = !!this.tacheId;

    // Use forkJoin to wait for both queryParams and sprint data
    // This ensures initialSprintId is set AND sprints are loaded before patching the form.
    forkJoin([
      this.route.queryParams.pipe(first(), tap(params => { // Use first() to complete after initial params
        if (params['sprintId']) {
          this.initialSprintId = +params['sprintId'];
          console.log('NGONINIT: Initial Sprint ID from query params:', this.initialSprintId);
        }
      })),
      this.sprintService.getAllSprints().pipe(tap(sprints => {
        this.sprints = sprints;
        console.log('NGONINIT: Sprints loaded:', this.sprints);
      }))
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.initForm(); // Initialize form after initialSprintId and sprints are loaded

        if (this.editMode && this.tacheId) {
          this.loadTacheDetails(+this.tacheId);
        } else if (this.initialSprintId !== null) {
          // For new tasks, if initialSprintId is present, patch the form control
          const sprintControl = this.tacheForm.get('sprintId');
          if (sprintControl) {
            // Only patch if the sprintId is valid and exists in the loaded sprints
            if (this.sprints.some(s => s.idSprint === this.initialSprintId)) {
                sprintControl.patchValue(this.initialSprintId);
                sprintControl.disable(); // Disable if pre-filled
                console.log('NGONINIT: Sprint ID patched and disabled:', this.initialSprintId);
            } else {
                console.warn(`NGONINIT: Initial sprint ID ${this.initialSprintId} not found in loaded sprints. Not pre-filling.`);
                this.snackBar.open('Le sprint spécifié n\'existe pas.', 'Fermer', { duration: 3000 });
                // Optionally, clear initialSprintId here if it's truly invalid
                this.initialSprintId = null;
            }
          }
        }
      },
      error: (error) => {
        console.error('NGONINIT: Erreur lors du chargement initial:', error);
        this.snackBar.open('Erreur lors du chargement des données initiales.', 'Fermer', { duration: 3000 });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(): void {
    this.tacheForm = this.fb.group({
      nom: ['', Validators.required],
      description: [''],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      statut: ['', Validators.required],
      storyPoints: [null],
      estimatedHours: [null],
      // Initialize sprintId to null or a default, it will be patched later if initialSprintId exists
      sprintId: [null, Validators.required],
    });
    console.log('INITFORM: Form initialized.');
  }

  // loadSprints is now handled by the forkJoin in ngOnInit, so it's not needed as a separate public method
  // but keeping it if there's other logic that relies on it. For pre-filling, ngOnInit's forkJoin is key.

  loadTacheDetails(id: number): void {
    this.tacheService.getTacheById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tache: Tache) => {
          const sprintToPatch = tache.sprint?.idSprint || null;

          this.tacheForm.patchValue({
            nom: tache.nom,
            description: tache.description,
            dateDebut: tache.dateDebut ? new Date(tache.dateDebut) : '',
            dateFin: tache.dateFin ? new Date(tache.dateFin) : '',
            statut: tache.statut,
            storyPoints: tache.storyPoints,
            estimatedHours: tache.estimatedHours,
            sprintId: sprintToPatch,
          });

          // In edit mode, if the sprintId was initially disabled (from a query param),
          // decide whether to re-enable it for editing. Typically, you would re-enable.
          if (this.tacheForm.get('sprintId')?.disabled) {
             this.tacheForm.get('sprintId')?.enable();
             console.log('LOADTACHEDETAILS: Sprint ID field re-enabled for editing.');
          }
          console.log('LOADTACHEDETAILS: Tache details loaded:', tache);
        },
        error: (error) => {
          console.error('LOADTACHEDETAILS: Erreur lors du chargement de la tâche:', error);
          this.snackBar.open('Erreur lors du chargement de la tâche.', 'Fermer', { duration: 3000 });
          this.router.navigate(['/taches']);
        }
      });
  }

  onSubmit(): void {
    this.tacheForm.markAllAsTouched();
    if (this.tacheForm.invalid) {
      this.snackBar.open('Veuillez corriger les erreurs du formulaire.', 'Fermer', { duration: 3000 });
      return;
    }

    const formValue = this.tacheForm.getRawValue();
    console.log('SUBMIT: Form value for submission (raw):', formValue);

    const tachePayload: CreateUpdateTacheDto = {
      nom: formValue.nom,
      description: formValue.description,
      dateDebut: this.datePipe.transform(formValue.dateDebut, 'yyyy-MM-dd')!,
      dateFin: this.datePipe.transform(formValue.dateFin, 'yyyy-MM-dd')!,
      statut: formValue.statut,
      storyPoints: formValue.storyPoints,
      estimatedHours: formValue.estimatedHours,
      sprintId: formValue.sprintId,
    };

    if (this.editMode && this.tacheId) {
      this.tacheService.updateTache(+this.tacheId, tachePayload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.snackBar.open('Tâche mise à jour avec succès !', 'Fermer', { duration: 3000 });
            this.router.navigate(['/taches']);
          },
          error: (error) => {
            console.error('SUBMIT: Erreur lors de la mise à jour de la tâche:', error);
            this.snackBar.open('Erreur lors de la mise à jour de la tâche.', 'Fermer', { duration: 3000 });
          }
        });
    } else {
      this.tacheService.createTache(tachePayload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.snackBar.open('Tâche créée avec succès !', 'Fermer', { duration: 3000 });
            this.router.navigate(['/taches']);
          },
          error: (error) => {
            console.error('SUBMIT: Erreur lors de la création de la tâche:', error);
            this.snackBar.open('Erreur lors de la création de la tâche.', 'Fermer', { duration: 3000 });
          }
        });
    }
  }

  onCancel(): void {
    this.router.navigate(['/taches']);
  }
}