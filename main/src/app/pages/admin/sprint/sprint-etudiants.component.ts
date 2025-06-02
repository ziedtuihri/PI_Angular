// src/app/pages/admin/sprint/sprint-etudiants/sprint-etudiants.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute ,RouterLink } from '@angular/router';
//import { ActivatedRoute, RouterLink } from '@angular/router';
import { SprintService } from '../../../services/sprint.service';
import { CommonModule } from '@angular/common';
//import { FormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips'; // For mat-chip-listbox and mat-chip-row

// Remove interface EtudiantAffecteDTO { ... }

@Component({
  selector: 'app-sprint-etudiants',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatChipsModule,
  ],
  templateUrl: './sprint-etudiants.component.html',
  styleUrls: ['./sprint-etudiants.component.scss']
})
export class SprintEtudiantsComponent implements OnInit {
  sprintId: number | null = null;
  etudiantsAffectes: string[] = []; // Stores just the names (emails)
  nouveauEtudiantNom: string = '';

  constructor(
    private route: ActivatedRoute,
    private sprintService: SprintService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.sprintId = +params.get('id')!;
      if (this.sprintId) {
        this.chargerEtudiantsAffectes();
      }
    });
  }

  chargerEtudiantsAffectes(): void {
    if (this.sprintId) {
      this.sprintService.getEtudiantsAffectesAuSprint(this.sprintId).subscribe(
        (etudiants: string[]) => {
          this.etudiantsAffectes = etudiants.filter(name => name && name.trim() !== '');

          console.log('Étudiants affectés:', this.etudiantsAffectes);
          if (this.etudiantsAffectes.length === 0) {
            this.snackBar.open('Aucun étudiant affecté à ce sprint.', 'Fermer', { duration: 3000 });
          }
        },
        error => {
          console.error('Erreur lors du chargement des étudiants affectés:', error);
          this.snackBar.open('Erreur lors du chargement des étudiants.', 'Fermer', { duration: 3000 });
        }
      );
    }
  }

  affecterEtudiant(): void {
    const studentEmail = this.nouveauEtudiantNom.trim();
    if (this.sprintId && studentEmail) {
      this.sprintService.affecterEtudiantAuSprint(this.sprintId, studentEmail).subscribe(
        (updatedSprint: any) => { // Change Sprint to any
          console.log('Étudiant affecté:', updatedSprint);
          this.snackBar.open(`"${studentEmail}" affecté avec succès!`, 'Fermer', { duration: 3000 });
          this.nouveauEtudiantNom = '';
          this.chargerEtudiantsAffectes();
        },
        error => {
          console.error('Erreur lors de l\'affectation de l\'étudiant:', error);
          this.snackBar.open(`Erreur lors de l'affectation de "${studentEmail}".`, 'Fermer', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('Veuillez entrer un nom d\'étudiant valide.', 'Fermer', { duration: 3000 });
    }
  }

  supprimerEtudiant(nomEtudiant: string): void {
    if (this.sprintId && nomEtudiant) {
      this.sprintService.supprimerEtudiantDuSprint(this.sprintId, nomEtudiant).subscribe(
        (updatedSprint: any) => { // Change Sprint to any
          console.log('Étudiant supprimé:', updatedSprint);
          this.snackBar.open(`"${nomEtudiant}" supprimé avec succès.`, 'Fermer', { duration: 3000 });
          this.chargerEtudiantsAffectes();
        },
        error => {
          console.error('Erreur lors de la suppression de l\'étudiant:', error);
          this.snackBar.open(`Erreur lors de la suppression de "${nomEtudiant}".`, 'Fermer', { duration: 3000 });
        }
      );
    } else {
      this.snackBar.open('Impossible de supprimer cet étudiant.', 'Fermer', { duration: 3000 });
    }
  }
}