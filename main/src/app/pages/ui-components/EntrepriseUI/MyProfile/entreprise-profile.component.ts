import { Component, OnInit } from '@angular/core';
import { EntrepriseViewService } from 'src/app/services/Entreprise.Service/entrepriseView.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Entreprise } from 'src/app/models/entreprise.model';
import {CommonModule} from "@angular/common";
import {MatTableModule} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatChipsModule} from "@angular/material/chips";
import {MatDialogModule} from "@angular/material/dialog";
import {EditEntrepriseDialogComponent} from "../../AdminUI/entreprise-list/edit-entreprise-dialog.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {Router} from "@angular/router";

@Component({
  selector: 'app-entreprise-profile',
  templateUrl: './entreprise-profile.component.html',
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
  styleUrls: ['./entreprise-profile.component.css']
})
export class EntrepriseProfileComponent implements OnInit {
  entrepriseId = 1; // Placeholder for now
  entreprise: Entreprise | null = null;
  isEditing = false;
  isLoading = false;

  constructor(
    private entrepriseService: EntrepriseViewService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEntreprise();
  }

  loadEntreprise(): void {
    this.isLoading = true;
    this.entrepriseService.getProfile(this.entrepriseId).subscribe({
      next: (data) => {
        this.entreprise = data;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load profile.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  saveChanges(): void {
    if (!this.entreprise) return;

    this.entrepriseService.updateProfile(this.entrepriseId, this.entreprise).subscribe({
      next: (updated) => {
        this.snackBar.open('Profile updated successfully.', 'Close', { duration: 3000 });
        this.entreprise = updated;
        this.isEditing = false;
      },
      error: () => {
        this.snackBar.open('Failed to update profile.', 'Close', { duration: 3000 });
      }
    });
  }

  cancelEdit(): void {
    this.loadEntreprise();
    this.isEditing = false;
  }
  goToDashboard() {
    this.router.navigate(['entreprise/dashboard']);
  }
}
