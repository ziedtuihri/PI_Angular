import { Component, OnInit } from '@angular/core';
import {MoyenneService, Projet, ProjetDto, UserNameDto} from '../../services/moyenne.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-moyenne',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './moyenne.component.html',
  styleUrls: ['./moyenne.component.scss'],
})
export class MoyenneComponent implements OnInit {
  projets: ProjetDto[] = [];
  users: UserNameDto[] = [];

  selectedUserId: number | null = null;
  selectedProjetId: number | null = null;

  moyenne: number | null = null;
  errorMessage = '';

  constructor(private moyenneService: MoyenneService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadProjets();
  }

  loadUsers() {
    this.moyenneService.getUsersByRole().subscribe({
      next: (users) => (this.users = users),
      error: (err) => {
        console.error('Erreur chargement utilisateurs', err);
        this.errorMessage = 'Erreur lors du chargement des utilisateurs';
      },
    });
  }

  loadProjets() {
    this.moyenneService.getProjetsDto().subscribe({
      next: (projets) => (this.projets = projets),
      error: (err) => {
        console.error('Erreur chargement projets', err);
        this.errorMessage = 'Erreur lors du chargement des projets';
      },
    });
  }

  calculerMoyenne(): void {
    console.log('User ID:', this.selectedUserId);
    console.log('Projet ID:', this.selectedProjetId);

    if (this.selectedProjetId && this.selectedUserId) {
      this.moyenneService.getMoyenneProjet(this.selectedProjetId, this.selectedUserId).subscribe({
        next: (val) => {
          // Arrondir à 2 chiffres après la virgule
          this.moyenne = Math.round(val * 100) / 100;
          this.errorMessage = '';
          console.log('Moyenne reçue:', this.moyenne);
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du calcul de la moyenne';
        },
      });
    } else {
      this.errorMessage = 'Veuillez sélectionner un utilisateur et un projet.';
    }
  }


}
