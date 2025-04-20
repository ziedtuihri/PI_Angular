import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SprintService } from '../../../services/sprint.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sprint-etudiants',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './sprint-etudiants.component.html',
  styleUrls: ['./sprint-etudiants.component.scss']
})
export class SprintEtudiantsComponent implements OnInit {
  sprintId: number | null = null;
  etudiantsAffectes: string[] = [];
  nouveauEtudiantNom: string = '';

  constructor(
    private route: ActivatedRoute,
    private sprintService: SprintService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.sprintId = Number(params.get('id'));
      if (this.sprintId) {
        this.chargerEtudiantsAffectes();
      }
    });
  }

  chargerEtudiantsAffectes(): void {
    if (this.sprintId) {
      this.sprintService.getEtudiantsDuSprint(this.sprintId).subscribe(
        etudiantsJson => {
          this.etudiantsAffectes = etudiantsJson
            .filter(item => item !== undefined && item !== null && item !== 'undefined')
            .map(jsonString => {
              try {
                const etudiantObject = JSON.parse(jsonString);
                return etudiantObject?.nomEtudiant || '';
              } catch (error) {
                console.error('Erreur lors du parsing JSON:', error, jsonString);
                return jsonString; // Si le parsing échoue, on essaie d'afficher la chaîne brute (pour le cas de "undefined")
              }
            });
          console.log('Étudiants affectés (parsés):', this.etudiantsAffectes);
        },
        error => {
          console.error('Erreur lors du chargement des étudiants affectés:', error);
        }
      );
    }
  }

  affecterEtudiant(): void {
    if (this.sprintId && this.nouveauEtudiantNom.trim()) {
      this.sprintService.affecterEtudiantAuSprint(this.sprintId, this.nouveauEtudiantNom.trim()).subscribe(
        updatedSprint => {
          console.log('Étudiant affecté:', updatedSprint);
          this.nouveauEtudiantNom = '';
          this.chargerEtudiantsAffectes();
        },
        error => {
          console.error('Erreur lors de l\'affectation de l\'étudiant:', error);
        }
      );
    }
  }

  supprimerEtudiant(nomEtudiant: string): void {
    if (this.sprintId) {
      this.sprintService.supprimerEtudiantDuSprint(this.sprintId, nomEtudiant).subscribe(
        updatedSprint => {
          console.log('Étudiant supprimé:', updatedSprint);
          this.chargerEtudiantsAffectes();
        },
        error => {
          console.error('Erreur lors de la suppression de l\'étudiant:', error);
        }
      );
    }
  }
}