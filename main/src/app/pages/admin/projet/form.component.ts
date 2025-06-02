import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, ValidatorFn, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ProjetService, Projet } from '../../../services/projet.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs'; // Keep Observable
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-projet-form',
  templateUrl: './form.component.html', // Correct: this matches your file name
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule,
    MatSnackBarModule,
  ],
  providers: [DatePipe]
})
export class ProjetFormComponent implements OnInit {
  projetForm!: FormGroup;
  editMode = false;
  projetId?: number;
  selectedFile?: File;
  formErrorMessage = ''; // Keeping this for more complex errors, but snackbar is primary feedback

  // Project types should match your Java enum (ProjectType)
  // Ensure these exactly match your backend ENUM values for proper mapping
  projectTypes: string[] = [
    'PFE', 'PIDEV', 'DEVOPS', 'IA', 'WEB', 'MOBILE', 'CLOUD', 'SECURITE', 'ERP', 'IOT',
    'JEUX_VIDEO', 'BLOCKCHAIN', 'BIG_DATA', 'BI', 'AUTOMATISATION', 'RECHERCHE',
    'SYSTEME_EMBARQUE', 'AUTRE'
  ];

  // Project Statuses: CORRECTED to EXACTLY match your Java enum (tn.esprit.pi.entities.enumerations.ProjectStatus)
  // Ensure these exactly match your backend ENUM values for proper mapping
  projectStatuses: string[] = [
    'NOTSTARTED',
    'PLANNED',
    'IN_PROGRESS',
    'COMPLETED',
    'OVERDUE',
    'CANCELLED'
  ];

  constructor(
    private fb: FormBuilder,
    private projetService: ProjetService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar // Injected MatSnackBar
  ) {}

  ngOnInit(): void {
    this.projetId = this.route.snapshot.params['id'];
    this.editMode = !!this.projetId;

    this.projetForm = this.fb.group(
      {
        nom: ['', Validators.required],
        description: ['', Validators.maxLength(1000)],
        projectType: ['', Validators.required],
        dateDebut: ['', Validators.required],
        dateFinPrevue: ['', Validators.required],
        dateFinReelle: [null], // Set initial value to null for optional date
        statut: ['', Validators.required],
        file: [null], // For file input control
        listeEtudiantsInput: ['', Validators.maxLength(500)], // Input for comma-separated emails
        encadrantEmail: ['', Validators.email],
      },
      { validators: this.datesValidator } // Group validator
    );

    if (this.editMode) {
      this.projetService.getById(this.projetId!).subscribe({
        next: (projet: Projet) => {
          this.projetForm.patchValue({
            nom: projet.nom,
            description: projet.description,
            projectType: projet.projectType,
            // Convert string dates from backend to Date objects for Material Datepicker
            dateDebut: projet.dateDebut ? new Date(projet.dateDebut) : null,
            dateFinPrevue: projet.dateFinPrevue ? new Date(projet.dateFinPrevue) : null,
            dateFinReelle: projet.dateFinReelle ? new Date(projet.dateFinReelle) : null,
            statut: projet.statut,
            listeEtudiantsInput: projet.studentEmailsList ? projet.studentEmailsList.join(', ') : '',
            encadrantEmail: projet.teacherEmail || '', // Use || '' to ensure it's a string, not undefined
          });
          // Clear any initial validation errors after patching, if needed, or rely on user interaction
          this.projetForm.markAsPristine();
          this.projetForm.markAsUntouched();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erreur chargement projet', err);
          const errorMessage = "Erreur lors du chargement du projet: " + (err.error?.message || err.message || JSON.stringify(err.error));
          this.snackBar.open(errorMessage, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
          this.formErrorMessage = errorMessage; // Keep this if you also display it in the form itself
        },
      });
    }
  }

  // Custom validator for date logic
  datesValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const group = control as FormGroup;
    const debut = group.get('dateDebut')?.value;
    const finPrevue = group.get('dateFinPrevue')?.value;
    const finReelle = group.get('dateFinReelle')?.value;

    // Convert to Date objects for comparison
    const startDate = debut ? new Date(debut) : null;
    const plannedEndDate = finPrevue ? new Date(finPrevue) : null;
    const realEndDate = finReelle ? new Date(finReelle) : null;

    if (startDate && plannedEndDate && plannedEndDate < startDate) {
      return { dateFinPrevueBeforeDebut: true };
    }
    if (startDate && realEndDate && realEndDate < startDate) {
      return { dateFinReelleBeforeDebut: true };
    }
    return null;
  };

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // You don't need to patch the 'file' control value for file upload.
      // The `selectedFile` property is enough. The file control is mostly a placeholder for UI.
      // If you want to show the file name in the form, you could do:
      // this.projetForm.get('file')?.setValue(file.name);
    } else {
      this.selectedFile = undefined; // Clear selected file if user cancels selection
      // If you were showing file name, clear it:
      // this.projetForm.get('file')?.setValue(null);
    }
  }

  onSubmit(): void {
    this.formErrorMessage = ''; // Clear previous error messages

    if (this.projetForm.invalid) {
      this.projetForm.markAllAsTouched(); // Mark all controls as touched to show validation errors
      const invalidControls = Object.keys(this.projetForm.controls).filter(key => this.projetForm.controls[key].invalid);
      console.warn('Form is invalid, controls:', invalidControls);
      // Access errors at the group level (for date validator)
      if (this.projetForm.errors) {
        console.warn('Form group errors:', this.projetForm.errors);
      }

      this.snackBar.open('Veuillez corriger les erreurs dans le formulaire.', 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
      return;
    }

    const formValue = this.projetForm.value;

    // Process student emails: split by comma, trim whitespace, filter empty strings
    const studentEmailsList: string[] = formValue.listeEtudiantsInput
      ? formValue.listeEtudiantsInput.split(',').map((email: string) => email.trim()).filter((email: string) => email !== '')
      : [];
    // Ensure teacher email is trimmed and empty string if null/undefined
    const teacherEmail: string | undefined = formValue.encadrantEmail?.trim() || undefined; // Use undefined for no value

    // Prepare the Projet object to send to the backend
    const projetToSend: Projet = {
      idProjet: this.editMode ? this.projetId : undefined, // Only include ID if in edit mode
      nom: formValue.nom,
      description: formValue.description,
      projectType: formValue.projectType,
      // Format dates to 'YYYY-MM-DD' string for backend
      dateDebut: this.datePipe.transform(formValue.dateDebut, 'yyyy-MM-dd')!,
      dateFinPrevue: this.datePipe.transform(formValue.dateFinPrevue, 'yyyy-MM-dd')!,
      dateFinReelle: formValue.dateFinReelle ? this.datePipe.transform(formValue.dateFinReelle, 'yyyy-MM-dd')! : undefined,
      statut: formValue.statut,
      teacherEmail: teacherEmail,
      studentEmailsList: studentEmailsList
    };

    let projectOperation$: Observable<Projet>;

    if (this.editMode) {
      projectOperation$ = this.projetService.update(this.projetId!, projetToSend);
    } else {
      projectOperation$ = this.projetService.create(projetToSend);
    }

    projectOperation$.subscribe({
      next: (responseProjet: Projet) => {
        // Use the ID from the response for file upload if in create mode, otherwise use existing ID
        const projectIdForUpload = this.editMode ? this.projetId! : responseProjet.idProjet!;

        if (this.selectedFile) {
          this.projetService.uploadFile(projectIdForUpload, this.selectedFile).subscribe({
            next: () => {
              console.log('Projet et fichier sauvegardés avec succès!');
              this.snackBar.open('Projet et fichier sauvegardés avec succès!', 'Fermer', { duration: 3000, panelClass: ['success-snackbar'] });
              this.router.navigate(['/projet']);
            },
            error: (err: HttpErrorResponse) => {
              console.error('Erreur lors de l\'upload du fichier', err);
              // Provide specific feedback for file upload error
              const fileUploadErrorMessage = "Erreur lors de l'upload du fichier : " + (err.error?.message || err.message || JSON.stringify(err.error));
              this.snackBar.open(fileUploadErrorMessage, 'Fermer', { duration: 7000, panelClass: ['error-snackbar'] }); // Longer duration for critical error
              this.formErrorMessage = fileUploadErrorMessage; // Optional: keep for form-level error display
            },
          });
        } else {
          console.log('Projet sauvegardé avec succès (sans fichier ou fichier inchangé)!');
          this.snackBar.open('Projet sauvegardé avec succès!', 'Fermer', { duration: 3000, panelClass: ['success-snackbar'] });
          this.router.navigate(['/projet']);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erreur lors de la sauvegarde du projet (opération principale)', err);
        const mainSaveErrorMessage = "Erreur lors de la sauvegarde du projet. Détails: " + (err.error?.message || err.message || JSON.stringify(err.error));
        this.snackBar.open(mainSaveErrorMessage, 'Fermer', { duration: 7000, panelClass: ['error-snackbar'] }); // Longer duration for critical error
        this.formErrorMessage = mainSaveErrorMessage; // Optional: keep for form-level error display
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/projet']);
  }

  // Helper to get form control for template access (e.g., for error messages)
  get formControls() {
    return this.projetForm.controls;
  }
}