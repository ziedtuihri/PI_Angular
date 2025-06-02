// src/app/pages/admin/sprint/sprint-form-admin/sprint-form-admin.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { SprintService ,Sprint,CreateSprintDto } from 'src/app/services/sprint.service';
import { ProjetService,Projet } from 'src/app/services/projet.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
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
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntil, Subject } from 'rxjs';
import { HttpErrorResponse, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-sprint-form-admin',
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
    MatChipsModule,
    RouterModule,
    MatTooltipModule,
    HttpClientModule
  ],
  providers: [DatePipe],
  templateUrl: './sprint-form.component.html',
  styleUrls: ['./sprint-form.component.scss']
})
export class SprintFormAdminComponent implements OnInit, OnDestroy {
  sprintForm!: FormGroup;
  editMode = false;
  sprintId?: number | null;
  projects: Projet[] = [];
  availableStudentEmails: string[] = [];
  selectedStudentEmails: string[] = [];

  selectedProjectDates: { dateDebut: Date | null, dateFinPrevue: Date | null } = { dateDebut: null, dateFinPrevue: null };

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private sprintService: SprintService,
    private projetService: ProjetService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.sprintId = idParam ? +idParam : null;
    this.editMode = !!this.sprintId;

    this.initForm();
    this.loadProjects();

    this.sprintForm.get('etudiantsAffectes')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.selectedStudentEmails = value || [];
      });

    this.setupProjectChangeListener();

    this.sprintForm.get('dateDebut')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.sprintForm.updateValueAndValidity());

    this.sprintForm.get('dateFin')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.sprintForm.updateValueAndValidity());

    if (this.editMode && this.sprintId) {
      this.loadSprintDetails(this.sprintId);
    } else if (this.editMode && !this.sprintId) {
      this.snackBar.open('Erreur: ID de sprint manquant pour l\'édition.', 'Fermer', { duration: 3000 });
      this.router.navigate(['/sprints']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(): void {
    this.sprintForm = this.fb.group({
      nom: ['', Validators.required],
      objectif: [''],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      statut: ['', Validators.required],
      projetId: [null, Validators.required],
      etudiantsAffectes: [[] as string[]],
    }, {
      validator: this.sprintDatesValidator()
    });
  }

  sprintDatesValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const formGroup = control as FormGroup;
      const sprintDateDebut = formGroup.get('dateDebut')?.value;
      const sprintDateFin = formGroup.get('dateFin')?.value;

      formGroup.get('dateDebut')?.setErrors(null);
      formGroup.get('dateFin')?.setErrors(null);

      if (!sprintDateDebut || !sprintDateFin) {
        return null;
      }

      const sDebut = new Date(sprintDateDebut);
      const sFin = new Date(sprintDateFin);

      if (sDebut.getTime() > sFin.getTime()) {
        formGroup.get('dateFin')?.setErrors({ sprintEndsBeforeStarts: true });
        return { sprintDateConflict: true };
      }

      if (this.selectedProjectDates.dateDebut && this.selectedProjectDates.dateFinPrevue) {
        const pDebut = new Date(this.selectedProjectDates.dateDebut);
        const pFin = new Date(this.selectedProjectDates.dateFinPrevue);

        if (sDebut.getTime() < pDebut.getTime()) {
          formGroup.get('dateDebut')?.setErrors({ sprintStartsBeforeProject: true });
          return { sprintDateConflict: true };
        }
        if (sFin.getTime() > pFin.getTime()) {
          formGroup.get('dateFin')?.setErrors({ sprintEndsAfterProject: true });
          return { sprintDateConflict: true };
        }
      }

      return null;
    };
  }

  removeStudentEmailFromForm(emailToRemove: string): void {
    const currentSelection: string[] = this.sprintForm.get('etudiantsAffectes')?.value || [];
    const newSelection = currentSelection.filter(email => email !== emailToRemove);
    this.sprintForm.get('etudiantsAffectes')?.setValue(newSelection);
  }

  loadProjects(): void {
    this.projetService.getAllProjets()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projets: Projet[]) => {
          this.projects = projets;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erreur lors du chargement des projets:', error);
          this.snackBar.open('Erreur lors du chargement des projets.', 'Fermer', { duration: 3000, panelClass: ['error-snackbar'] });
        }
      });
  }

  setupProjectChangeListener(): void {
    this.sprintForm.get('projetId')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(projectId => {
        if (projectId) {
          const selectedProject = this.projects.find(p => p.idProjet === projectId);
          if (selectedProject) {
            this.selectedProjectDates.dateDebut = selectedProject.dateDebut ? new Date(selectedProject.dateDebut) : null;
            this.selectedProjectDates.dateFinPrevue = selectedProject.dateFinPrevue ? new Date(selectedProject.dateFinPrevue) : null;
          } else {
            this.selectedProjectDates = { dateDebut: null, dateFinPrevue: null };
          }

          this.loadAvailableStudentEmailsForProject(projectId);

          if (!this.editMode || (this.editMode && this.sprintForm.get('projetId')?.dirty)) {
            this.sprintForm.get('etudiantsAffectes')?.setValue([]);
          }
        } else {
          this.availableStudentEmails = [];
          this.sprintForm.get('etudiantsAffectes')?.setValue([]);
          this.selectedProjectDates = { dateDebut: null, dateFinPrevue: null };
        }
        this.sprintForm.updateValueAndValidity();
      });
  }

  loadAvailableStudentEmailsForProject(projectId: number): void {
    this.projetService.getStudentEmails(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (emails: string[]) => {
          this.availableStudentEmails = emails;

          const currentSelected = this.sprintForm.get('etudiantsAffectes')?.value || [];
          const filteredSelected = currentSelected.filter((email: string) =>
              this.availableStudentEmails.includes(email)
          );

          if (!this.arraysEqual(filteredSelected, currentSelected)) {
            this.sprintForm.get('etudiantsAffectes')?.setValue(filteredSelected, { emitEvent: false });
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erreur lors du chargement des étudiants pour le projet:', error);
          this.snackBar.open('Erreur lors du chargement des étudiants du projet.', 'Fermer', { duration: 3000, panelClass: ['error-snackbar'] });
          this.availableStudentEmails = [];
          this.sprintForm.get('etudiantsAffectes')?.setValue([]);
        }
      });
  }

  loadSprintDetails(id: number): void {
    this.sprintService.getSprintById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (sprint: Sprint) => {
          if (this.projects.length === 0) {
            this.loadProjects();
          }

          const associatedProject = this.projects.find(p => p.idProjet === sprint.projet?.idProjet);
          if (associatedProject) {
            this.selectedProjectDates.dateDebut = associatedProject.dateDebut ? new Date(associatedProject.dateDebut) : null;
            this.selectedProjectDates.dateFinPrevue = associatedProject.dateFinPrevue ? new Date(associatedProject.dateFinPrevue) : null;
          }

          this.sprintForm.patchValue({
            nom: sprint.nom,
            objectif: sprint.description,
            dateDebut: sprint.dateDebut ? new Date(sprint.dateDebut) : '',
            dateFin: sprint.dateFin ? new Date(sprint.dateFin) : '',
            statut: sprint.statut,
            projetId: sprint.projet?.idProjet || null,
            etudiantsAffectes: sprint.etudiantsAffectes || [] // Patch the affected students
          }, { emitEvent: false });

          this.selectedStudentEmails = sprint.etudiantsAffectes || [];

          this.sprintForm.updateValueAndValidity();
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open('Erreur lors du chargement du sprint.', 'Fermer', { duration: 3000, panelClass: ['error-snackbar'] });
          console.error('Error loading sprint:', error);
          this.router.navigate(['/sprints']);
        }
      });
  }

  onSubmit(): void {
    this.sprintForm.updateValueAndValidity();

    if (this.sprintForm.invalid) {
      this.sprintForm.markAllAsTouched();
      this.snackBar.open('Veuillez corriger les erreurs du formulaire.', 'Fermer', { duration: 3000, panelClass: ['warning-snackbar'] });
      return;
    }

    const formValue = this.sprintForm.getRawValue();

    const commonSprintProperties = {
      nom: formValue.nom,
      description: formValue.objectif,
      dateDebut: this.datePipe.transform(formValue.dateDebut, 'yyyy-MM-dd')!,
      dateFin: this.datePipe.transform(formValue.dateFin, 'yyyy-MM-dd')!,
      statut: formValue.statut,
      etudiantsAffectes: formValue.etudiantsAffectes || [], // Include students for service to handle
    };

    if (this.editMode) {
      if (this.sprintId) {
        const sprintIdNum = this.sprintId;
        const sprintData: Sprint = {
          idSprint: sprintIdNum,
          ...commonSprintProperties,
          projet: formValue.projetId ? { idProjet: formValue.projetId } as Projet : undefined,
        };

        this.sprintService.updateSprint(sprintIdNum, sprintData)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.snackBar.open('Sprint mis à jour avec succès !', 'Fermer', { duration: 3000, panelClass: ['success-snackbar'] });
              // REMOVED: this.handleStudentAssignment(sprintIdNum, formValue.etudiantsAffectes);
              this.router.navigate(['/sprints']);
            },
            error: (error: HttpErrorResponse) => {
              let errorMessage = 'Erreur lors de la mise à jour du sprint.';
              if (error.error && typeof error.error === 'string') {
                errorMessage = error.error;
              } else if (error.error?.message) {
                errorMessage = error.error.message;
              }
              this.snackBar.open(errorMessage, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
              console.error('Error updating sprint:', error);
            },
          });
      } else {
        this.snackBar.open('Erreur: ID de sprint manquant pour la mise à jour.', 'Fermer', { duration: 3000, panelClass: ['error-snackbar'] });
      }
    } else { // Create mode
      const createSprintPayload: CreateSprintDto = {
        ...commonSprintProperties,
        projetId: formValue.projetId,
      };

      if (createSprintPayload.projetId === null || createSprintPayload.projetId === undefined) {
          this.snackBar.open('Veuillez sélectionner un projet pour le sprint.', 'Fermer', { duration: 3000, panelClass: ['warning-snackbar'] });
          return;
      }

      this.sprintService.createSprint(createSprintPayload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.snackBar.open('Sprint créé avec succès !', 'Fermer', { duration: 3000, panelClass: ['success-snackbar'] });
            // REMOVED: If backend only handles students *after* sprint creation, call this:
            // REMOVED: if (createdSprint.idSprint) { this.handleStudentAssignment(createdSprint.idSprint, formValue.etudiantsAffectes); }
            this.router.navigate(['/sprints']);
          },
          error: (error: HttpErrorResponse) => {
            let errorMessage = 'Erreur lors de la création du sprint.';
            if (error.error && typeof error.error === 'string') {
              errorMessage = error.error;
            } else if (error.error?.message) {
                errorMessage = error.error.message;
            }
            this.snackBar.open(errorMessage, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
            console.error('Error creating sprint:', error);
          },
        });
    }
  }

  // REMOVED: The handleStudentAssignment method is no longer needed here.
  // The SprintService's createSprint and updateSprint methods now handle
  // the _syncStudentAssignments internally using RxJS operators.

  /**
   * Navigates back to the sprint list.
   */
  onCancel(): void {
    this.router.navigate(['/sprints']);
  }

  /**
   * Helper function to compare two string arrays for equality (order-agnostic).
   * @param a First array.
   * @param b Second array.
   * @returns True if arrays contain the same elements, false otherwise.
   */
  private arraysEqual(a: string[], b: string[]): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    const sortedA = [...a].sort();
    const sortedB = [...b].sort();

    for (let i = 0; i < sortedA.length; ++i) {
      if (sortedA[i] !== sortedB[i]) return false;
    }
    return true;
  }
}