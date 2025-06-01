import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OffreEntrepriseService } from 'src/app/services/Entreprise.Service/offre-entreprise.service';
import { Offre } from 'src/app/models/offre.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import {MatDatepicker, MatDatepickerToggle} from "@angular/material/datepicker";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-entreprise-offres',
  standalone: true,
  templateUrl: './entreprise-offres.component.html',
  styleUrls: ['./entreprise-offres.component.css'],
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIcon,
    MatTooltip,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerModule,
    MatNativeDateModule,
  ]
})
export class EntrepriseOffresComponent implements OnInit {
  offres: Offre[] = [];
  isLoading = true;
  isEditing = false;
  isCreating = false;
  selectedOffre: Offre | null = null;
  editedOffre: Offre | null = null; // ✅ Add this line
  entrepriseId = 1; // Static for now

  offreForm: FormGroup;
  minDate: Date = new Date(); // today

  constructor(
    private offreService: OffreEntrepriseService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.offreForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      competences: [''],
      localisation: [''],
      dateDebut: ['', [Validators.required, this.dateNotInPastValidator()]],
      dateFin: ['', [Validators.required]],
      disponible: [true]
    }, {
      validators: this.dateFinAfterDateDebutValidator()
    });

    // Update dateFin validity when dateDebut changes
    this.offreForm.get('dateDebut')?.valueChanges.subscribe(() => {
      this.offreForm.get('dateFin')?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.loadOffres();
  }

  loadOffres(): void {
    this.isLoading = true;
    this.offreService.getByEntrepriseId(this.entrepriseId).subscribe({
      next: (data: Offre[]) => {
        this.offres = data;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load offers', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  editOffre(offre: Offre): void {
    this.selectedOffre = offre;
    this.isEditing = true;
    this.offreForm.patchValue(offre);
  }

  createNewOffre(): void {
    this.selectedOffre = null;
    this.offreForm.reset({ disponible: true });
    this.isCreating = true;
  }

  cancel(): void {
    this.selectedOffre = null;
    this.isEditing = false;
    this.isCreating = false;
    this.offreForm.reset();
  }

  saveOffre(): void {
    if (this.offreForm.invalid) {
      this.snackBar.open('Please fill all required fields correctly.', 'Close', { duration: 3000 });
      return;
    }

    const offreData = { ...this.offreForm.value, entrepriseId: this.entrepriseId };
    console.log('Offre data to save:', offreData);

    if (this.isEditing && this.selectedOffre) {
      this.offreService.update(this.selectedOffre.id, offreData).subscribe({
        next: () => {
          this.snackBar.open('Offer updated', 'Close', { duration: 3000 });
          this.loadOffres();
          this.cancel();
        },
        error: () => this.snackBar.open('Update failed', 'Close', { duration: 3000 })
      });
    } else if (this.isCreating) {
      this.offreService.create(offreData).subscribe({
        next: () => {
          this.snackBar.open('Offer created', 'Close', { duration: 3000 });
          this.loadOffres();
          this.cancel();
        },
        error: () => this.snackBar.open('Creation failed', 'Close', { duration: 3000 })
      });
    }
  }

  deleteOffre(id: number): void {
    if (confirm('Are you sure you want to delete this offer?')) {
      this.offreService.delete(id).subscribe({
        next: () => {
          this.snackBar.open('Offer deleted', 'Close', { duration: 3000 });
          this.loadOffres();
        },
        error: () => this.snackBar.open('Deletion failed', 'Close', { duration: 3000 })
      });
    }
  }

  // Validator to ensure dateDebut is today or future date
  private dateNotInPastValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // normalize to start of day
      const value = control.value;
      if (value) {
        const controlDate = new Date(value);
        if (controlDate < today) {
          return { dateInPast: true };
        }
      }
      return null;
    };
  }

  // Validator to ensure dateFin is after or same as dateDebut
  private dateFinAfterDateDebutValidator(): ValidatorFn {
    return (group: AbstractControl) => {
      const dateDebut = group.get('dateDebut')?.value;
      const dateFin = group.get('dateFin')?.value;
      if (dateDebut && dateFin) {
        const dDebut = new Date(dateDebut);
        const dFin = new Date(dateFin);
        if (dFin < dDebut) {
          return { dateFinBeforeDateDebut: true };
        }
      }
      return null;
    };
  }

  goToDashboard() {
    this.router.navigate(['entreprise/dashboard']);
  }

}
