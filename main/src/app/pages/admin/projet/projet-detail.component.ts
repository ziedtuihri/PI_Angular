import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjetService, Projet } from '../../../services/projet.service'; 
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-projet-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, DatePipe, FormsModule],
  templateUrl: './projet-detail.component.html',
  styleUrls: ['./projet-detail.component.scss']
})
export class ProjetDetailComponent implements OnInit {
  projetId: number | null = null;
  projet: Projet | null = null;
  nouvelEtudiantNom: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private projetService: ProjetService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projetId = +params['id'];
      if (this.projetId) {
        this.loadProjetDetails(this.projetId);
      }
    });
  }

  loadProjetDetails(id: number): void {
    this.projetService.getById(id).subscribe(
      (projet) => {
        this.projet = projet;
      },
      (error) => {
        this.errorMessage = 'Erreur lors du chargement des détails du projet.';
        console.error(error);
      }
    );
  }

  ajouterEtudiant(): void {
    if (this.projetId && this.nouvelEtudiantNom.trim()) {
      this.projetService.ajouterEtudiantAuProjet(this.projetId, this.nouvelEtudiantNom.trim()).subscribe(
        (updatedProjet) => {
          this.projet = updatedProjet; 
          this.nouvelEtudiantNom = ''; 
          this.errorMessage = '';
          this.loadProjetDetails(this.projetId!); 
        },
        (error) => {
          this.errorMessage = 'Erreur lors de l\'ajout de l\'étudiant.';
          console.error(error);
        }
      );
    }
  }

  supprimerEtudiant(nomEtudiant: string): void {
    if (this.projetId) {
      this.projetService.supprimerEtudiantDuProjet(this.projetId, nomEtudiant).subscribe(
        (updatedProjet) => {
          this.projet = updatedProjet; 
          this.errorMessage = '';
          this.loadProjetDetails(this.projetId!); 
        },
        (error) => {
          this.errorMessage = 'Erreur lors de la suppression de l\'étudiant.';
          console.error(error);
        }
      );
    }
  }

  goBack(): void {
    this.router.navigate(['/projet']);
  }
}