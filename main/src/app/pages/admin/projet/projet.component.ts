// src/app/components/projet/projet.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Projet, ProjetService } from '../../../services/projet.service';
import { Router, RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Keep if you use <mat-spinner>

@Component({
  selector: 'app-projet',
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
  ],
  templateUrl: './projet.component.html',
  styleUrls: ['./projet.component.scss'],
  providers: [DatePipe],
})
export class ProjetComponent implements OnInit, OnDestroy {
  projets: Projet[] = [];
  displayedColumns: string[] = [
    'nom',
    'projectType',
    'statut',
    'fichier',
    'dateDebut',
    'dateFinPrevue',
    'actions',
  ];
  loading = false;
  private destroy$ = new Subject<void>();
  errorMessage: string = '';

  constructor(
    private projetService: ProjetService,
    private router: Router,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar
  ) {
    console.log('ProjetComponent: Constructor called.');
  }

  // --- Lifecycle Hooks ---
  ngOnInit(): void {
    console.log('ProjetComponent: ngOnInit called.');
    this.loadProjets(); // Load projects when the component initializes
    // Removed: this.decodeAndLogToken();
  }

  ngOnDestroy(): void {
    console.log('ProjetComponent: ngOnDestroy called.');
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- Removed Authentication and Role Management Section ---
  // private decodeAndLogToken(): void {
  //   // All logic related to jwtDecode and token handling removed
  // }

  // --- Data Loading ---
  loadProjets(): void {
    console.log('ProjetComponent: loadProjets called. Setting loading = true.');
    this.loading = true;
    this.errorMessage = '';

    this.projetService.getAllProjets()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Projet[]) => {
          console.log('ProjetComponent: Projects loaded successfully.');
          this.projets = data;
          this.loading = false;
          console.log('Projets array:', this.projets);
          if (data.length === 0) {
            console.log('ProjetComponent: No projects found in the response.');
            this.snackBar.open('Aucun projet trouvé.', 'Fermer', { duration: 3000, panelClass: ['info-snackbar'] });
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('ProjetComponent: Error loading projects:', err);
          this.loading = false;
          let userMessage = 'Erreur lors du chargement des projets. Veuillez réessayer.';

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

  // --- Navigation & Actions ---
  onAddProjet(): void {
    console.log('ProjetComponent: Navigating to add new project form.');
    this.router.navigate(['/projet/form']);
  }

  onEditProjet(id?: number): void {
    if (id !== undefined && id !== null) {
      console.log('ProjetComponent: Navigating to edit project with ID:', id);
      this.router.navigate(['/projet/form', id]);
    } else {
      console.warn('ProjetComponent: Cannot edit project: ID is undefined or null.');
      this.snackBar.open('ID du projet non défini pour la modification.', 'Fermer', { duration: 3000, panelClass: ['warning-snackbar'] });
    }
  }

  onDeleteProjet(id?: number): void {
    if (id === undefined || id === null) {
      console.warn('ProjetComponent: Cannot delete project: ID is undefined or null.');
      this.snackBar.open('ID du projet non défini pour la suppression.', 'Fermer', { duration: 3000, panelClass: ['warning-snackbar'] });
      return;
    }
    if (confirm('Voulez-vous vraiment supprimer ce projet ? Cette action est irréversible.')) {
      console.log('ProjetComponent: Deleting project with ID:', id);
      this.projetService.delete(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log('ProjetComponent: Project deleted successfully, reloading projects.');
            this.snackBar.open('Projet supprimé avec succès !', 'Fermer', { duration: 3000, panelClass: ['success-snackbar'] });
            this.loadProjets();
          },
          error: (err: HttpErrorResponse) => {
            console.error('ProjetComponent: Error deleting project:', err);
            let userMessage = 'Erreur lors de la suppression du projet.';
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

  downloadFile(idProjet?: number): void {
    if (idProjet === undefined || idProjet === null) {
      console.error('ProjetComponent: Project ID is undefined or null for file download.');
      this.snackBar.open('ID du projet non défini pour le téléchargement du fichier.', 'Fermer', { duration: 3000, panelClass: ['warning-snackbar'] });
      return;
    }
    console.log('ProjetComponent: Attempting to download file for project ID:', idProjet);
    this.projetService.downloadFile(idProjet)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blobData: Blob) => {
          const fileName = `projet_${idProjet}_fichier.pdf`;
          this.downloadBlob(blobData, fileName);
          this.snackBar.open('Fichier téléchargé avec succès !', 'Fermer', { duration: 3000, panelClass: ['success-snackbar'] });
        },
        error: (err: HttpErrorResponse) => {
          console.error('ProjetComponent: Error downloading file:', err);
          let userMessage = 'Erreur lors du téléchargement du fichier.';
          if (err.status === 404) {
              userMessage = 'Fichier non trouvé pour ce projet.';
          } else if (err.error && typeof err.error === 'string') {
              userMessage = err.error;
          } else if (err.message) {
              userMessage = err.message;
          }
          this.snackBar.open(userMessage, 'Fermer', { duration: 5000, panelClass: ['error-snackbar'] });
        },
      });
  }

  private downloadBlob(data: Blob, filename: string): void {
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  onViewDetail(id?: number): void {
    if (id !== undefined && id !== null) {
      console.log('ProjetComponent: Navigating to project details for ID:', id);
      this.router.navigate(['/projet/detail', id]);
    } else {
      console.warn('ProjetComponent: Cannot view project details: ID is undefined or null.');
      this.snackBar.open('ID du projet non défini pour les détails.', 'Fermer', { duration: 3000, panelClass: ['warning-snackbar'] });
    }
  }

  onAddEvaluation(idProjet?: number): void {
    if (idProjet !== undefined && idProjet !== null) {
      console.log('ProjetComponent: Navigating to add evaluation for project ID:', idProjet);
      this.router.navigate(['/add-evaluation', idProjet]);
    } else {
      console.warn('ProjetComponent: Cannot add evaluation: Project ID is undefined or null.');
      this.snackBar.open('ID du projet non défini pour ajouter une évaluation.', 'Fermer', { duration: 3000, panelClass: ['warning-snackbar'] });
    }
  }

  // --- Helper Methods for Display ---
  formatStatut(statut: string): string {
    switch (statut) {
      case 'EN_COURS': return 'En Cours';
      case 'TERMINE': return 'Terminé';
      case 'EN_ATTENTE': return 'En Attente';
      case 'ANNULE': return 'Annulé';
      default: return statut;
    }
  }

  formatProjectType(type: string): string {
    switch (type) {
      case 'DEVELOPPEMENT': return 'Développement';
      case 'RECHERCHE': return 'Recherche';
      case 'MAINTENANCE': return 'Maintenance';
      case 'DESIGN': return 'Design';
      default: return type;
    }
  }
}