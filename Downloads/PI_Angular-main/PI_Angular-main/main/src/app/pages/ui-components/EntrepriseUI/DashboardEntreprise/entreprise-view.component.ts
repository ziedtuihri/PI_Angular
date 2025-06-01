// src/app/components/entreprise-view/entreprise-view.component.ts
import { Component, OnInit } from '@angular/core';
import { EntrepriseViewService } from 'src/app/services/Entreprise.Service/entrepriseView.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { EditEntrepriseDialogComponent } from '../../AdminUI/entreprise-list/edit-entreprise-dialog.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Entreprise } from 'src/app/models/entreprise.model';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entreprise-view',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule,
    MatDialogModule,
    EditEntrepriseDialogComponent,
    MatToolbarModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './entreprise-view.component.html',
  styleUrls: ['./entreprise-view.component.css']
})
export class EntrepriseViewComponent implements OnInit {
  entrepriseId: number = 1; // Static for now until auth is available
  entreprise: Entreprise | null = null;
  isEditing: boolean = false;
  isLoading: boolean = true;

  constructor(
    private entrepriseService: EntrepriseViewService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.entrepriseService.getProfile(this.entrepriseId).subscribe(
      (data: Entreprise) => {
        this.entreprise = data;
        this.isLoading = false;
      },
      (error) => {
        this.snackBar.open('Error loading profile', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    );
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveChanges(): void {
    if (!this.entreprise) return;

    this.entrepriseService.updateProfile(this.entrepriseId, this.entreprise).subscribe(
      (updated: Entreprise) => {
        this.entreprise = updated;
        this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
        this.isEditing = false;
      },
      (error) => {
        this.snackBar.open('Update failed. Try again.', 'Close', { duration: 3000 });
      }
    );
  }

  cancelEdit(): void {
    this.loadProfile();
    this.isEditing = false;
  }

  isEntrepriseValidated(): boolean {
    return this.entreprise?.statut === 'VALIDE';
  }



  goToProfile(): void {
    this.router.navigate(['/entreprise/profile']);
  }

  goToOffer(): void {
    this.router.navigate(['/entreprise/offres']);
  }

  goToEvent(): void {
    this.router.navigate(['/entreprise/events']);
  }

  goToEncdrants(): void {
    this.router.navigate(['entreprise/encadrants']);
  }

  goToApplication(): void {
    this.router.navigate(['entreprise/candidatures']);
  }
}
