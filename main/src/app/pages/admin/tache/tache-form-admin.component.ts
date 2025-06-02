// src/app/pages/admin/tache-form/tache-form.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidatorFn } from '@angular/forms'; // Import AbstractControl, ValidatorFn
import { TacheService, Tache, CreateUpdateTacheDto } from 'src/app/services/tache.service';
import { SprintService, Sprint } from 'src/app/services/sprint.service';
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
import { Subject, takeUntil, forkJoin, Observable, of } from 'rxjs'; // Import forkJoin, Observable, of
import { tap, first, catchError } from 'rxjs/operators'; // Import first, catchError
import { HttpErrorResponse } from '@angular/common/http'; // Import HttpErrorResponse

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
  tacheId?: number | null; // Changed to number | null
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
    const idParam = this.route.snapshot.paramMap.get('id');
    this.tacheId = idParam ? +idParam : null; // Convert to number
    this.editMode = !!this.tacheId;

    this.initForm(); // Initialize form structure early

    // Fetch query params and sprints in parallel
    forkJoin([
      this.route.queryParams.pipe(
        first(),
        tap(params => {
          if (params['sprintId']) {
            this.initialSprintId = +params['sprintId'];
            console.log('NGONINIT: Initial Sprint ID from query params:', this.initialSprintId);
          }
        })
      ),
      this.sprintService.getAllSprints().pipe(
        tap(sprints => {
          this.sprints = sprints;
          console.log('NGONINIT: Sprints loaded:', this.sprints);
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('NGONINIT: Erreur lors du chargement des sprints:', error);
          this.snackBar.open('Erreur lors du chargement des sprints.', 'Fermer', { duration: 3000, panelClass: ['error-snackbar'] });
          return of([]); // Return an empty array to allow forkJoin to complete
        })
      )
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        // After sprints and initialSprintId are loaded/determined
        if (this.initialSprintId !== null) {
          const sprintControl = this.tacheForm.get('sprintId');
          if (sprintControl) {
            // Only patch if the sprintId is valid and exists in the loaded sprints
            if (this.sprints.some(s => s.idSprint === this.initialSprintId)) {
                sprintControl.patchValue(this.initialSprintId);
                sprintControl.disable(); // Disable if pre-filled by query param
                console.log('NGONINIT: Sprint ID patched and disabled:', this.initialSprintId);
            } else {
                console.warn(`NGONINIT: Initial sprint ID ${this.initialSprintId} not found in loaded sprints. Not pre-filling.`);
                this.snackBar.open('Le sprint spécifié n\'existe pas.', 'Fermer', { duration: 3000, panelClass: ['warning-snackbar'] });
                this.initialSprintId = null; // Clear invalid ID
            }
          }
        }

        // Now that sprints are loaded and initial sprintId is potentially set,
        // load task details if in edit mode.
        if (this.editMode && this.tacheId) {
          this.loadTacheDetails(this.tacheId);
        }
      },
      error: (error) => {
        // This catchError in subscribe is for issues that might occur after forkJoin
        console.error('NGONINIT: Erreur lors du chargement initial de la page:', error);
        this.snackBar.open('Erreur lors du chargement des données initiales de la page.', 'Fermer', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    });

    // Date validation listener
    this.tacheForm.get('dateDebut')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.tacheForm.updateValueAndValidity());

    this.tacheForm.get('dateFin')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.tacheForm.updateValueAndValidity());
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
      storyPoints: [null, [Validators.min(0)]], // Add validators
      estimatedHours: [null, [Validators.min(0)]], // Add validators
      sprintId: [null, Validators.required],
    }, {
      validator: this.tacheDatesValidator() // Apply cross-field validation
    });
    console.log('INITFORM: Form initialized.');
  }

  // Cross-field validator for dates
  tacheDatesValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const formGroup = control as FormGroup;
      const dateDebut = formGroup.get('dateDebut')?.value;
      const dateFin = formGroup.get('dateFin')?.value;

      if (!dateDebut || !dateFin) {
        // Don't validate if dates are empty (individual field validators handle required)
        return null;
      }

      const dDebut = new Date(dateDebut);
      const dFin = new Date(dateFin);

      // Check if dates are valid Date objects (e.g., from invalid input)
      if (isNaN(dDebut.getTime()) || isNaN(dFin.getTime())) {
          return { invalidDateComparison: true }; // Or handle specific error for invalid date format
      }

      if (dDebut.getTime() > dFin.getTime()) {
        // Set error on dateFin for specific message
        formGroup.get('dateFin')?.setErrors({ taskEndsBeforeStarts: true });
        // Return group-level error for general message
        return { taskStartsAfterEnds: true };
      }

      // Clear the specific error on dateFin if it was previously set and is now valid
      if (formGroup.get('dateFin')?.hasError('taskEndsBeforeStarts')) {
          formGroup.get('dateFin')?.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      }

      return null;
    };
  }

  loadTacheDetails(id: number): void {
    this.tacheService.getTacheById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (tache: Tache) => {
          const sprintToPatch = tache.sprint?.idSprint || null;

          this.tacheForm.patchValue({
            nom: tache.nom,
            description: tache.description,
            dateDebut: tache.dateDebut ? new Date(tache.dateDebut) : null, // Use null for empty date
            dateFin: tache.dateFin ? new Date(tache.dateFin) : null, // Use null for empty date
            statut: tache.statut,
            storyPoints: tache.storyPoints,
            estimatedHours: tache.estimatedHours,
            sprintId: sprintToPatch,
          });

          // In edit mode, if the sprintId was initially disabled (from a query param),
          // decide whether to re-enable it for editing. Typically, you would re-enable
          // it so the user can change the sprint.
          if (this.initialSprintId && this.tacheForm.get('sprintId')?.disabled) {
             this.tacheForm.get('sprintId')?.enable({ emitEvent: false });
             console.log('LOADTACHEDETAILS: Sprint ID field re-enabled as initial query param was used for creation.');
          }
          // If the task was loaded without an initialSprintId, ensure the sprint control is enabled
          else if (!this.initialSprintId && this.tacheForm.get('sprintId')?.disabled) {
            this.tacheForm.get('sprintId')?.enable({ emitEvent: false });
            console.log('LOADTACHEDETAILS: Sprint ID field re-enabled as it was not pre-filled by query param.');
          }

          // Ensure cross-field validation runs after patching
          this.tacheForm.updateValueAndValidity();
          console.log('LOADTACHEDETAILS: Tache details loaded and form patched:', tache);
        },
        error: (error: HttpErrorResponse) => {
          console.error('LOADTACHEDETAILS: Erreur lors du chargement de la tâche:', error);
          this.snackBar.open('Erreur lors du chargement de la tâche.', 'Fermer', { duration: 3000, panelClass: ['error-snackbar'] });
          this.router.navigate(['/taches']);
        }
      });
  }

  onSubmit(): void {
    this.tacheForm.markAllAsTouched(); // Mark all fields as touched to show errors
    this.tacheForm.updateValueAndValidity(); // Ensure latest validation status

    if (this.tacheForm.invalid) {
      console.warn('SUBMIT: Form is invalid:', this.tacheForm.errors);
      this.snackBar.open('Veuillez corriger les erreurs du formulaire.', 'Fermer', { duration: 3000, panelClass: ['warning-snackbar'] });
      return;
    }

    const sprintIdControl = this.tacheForm.get('sprintId');
    const wasSprintIdDisabled = sprintIdControl?.disabled;
    // Temporarily enable sprintId if it was disabled to include its value in getRawValue()
    if (wasSprintIdDisabled) {
        sprintIdControl?.enable({ emitEvent: false });
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

    let operation$: Observable<Tache>;
    let successMessage: string;
    let errorMessage: string;

    if (this.editMode && this.tacheId) {
      operation$ = this.tacheService.updateTache(this.tacheId, tachePayload);
      successMessage = 'Tâche mise à jour avec succès !';
      errorMessage = 'Erreur lors de la mise à jour de la tâche.';
    } else {
      operation$ = this.tacheService.createTache(tachePayload);
      successMessage = 'Tâche créée avec succès !';
      errorMessage = 'Erreur lors de la création de la tâche.';
    }

    operation$.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open(successMessage, 'Fermer', { duration: 3000, panelClass: ['success-snackbar'] });
          this.router.navigate(['/taches']);
        },
        error: (error: HttpErrorResponse) => {
          let specificErrorMessage = errorMessage;
          if (error.error && typeof error.error === 'string') {
            specificErrorMessage = error.error;
          } else if (error.error?.message) {
            specificErrorMessage = error.error.message;
          }
          console.error('SUBMIT: Backend error:', error);
          this.snackBar.open(specificErrorMessage, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
        },
        complete: () => {
          // Re-disable sprintId control after the operation is complete
          if (wasSprintIdDisabled) {
              sprintIdControl?.disable({ emitEvent: false });
          }
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/taches']);
  }
}