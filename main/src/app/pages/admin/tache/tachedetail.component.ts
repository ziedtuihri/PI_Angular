import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TacheService } from '../../../services/tache.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Sprint } from '../../../services/sprint.service'; // Si vous affichez des infos sur le sprint

@Component({
  selector: 'app-tache-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DatePipe,
  ],
  templateUrl: './tachedetail.component.html',
  styleUrl: './tachedetail.component.scss'
})
export class TacheDetailsComponent implements OnInit {
  tacheId: number = 0;
  tacheDetails: any;
  sprintDetails: Sprint | null = null;

  constructor(
    private route: ActivatedRoute,
    private tacheService: TacheService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.tacheId = +params['id'];
      if (this.tacheId) {
        this.getTacheDetails(this.tacheId);
      }
    });
  }

  getTacheDetails(id: number): void {
    this.tacheService.getTacheById(id).subscribe(
      (data) => {
        this.tacheDetails = data;
        this.sprintDetails = data.sprint;
        console.log('Détails de la tâche:', this.tacheDetails);
      },
      (error) => {
        console.error('Erreur lors de la récupération des détails de la tâche', error);
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/taches']);
  }

  formatStatut(statut: string): string {
    switch (statut) {
      case 'NOTSTARTED':
        return 'Non démarré';
      case 'INPROGRESS':
        return 'En cours';
      case 'DONE':
        return 'Terminée';
      case 'BLOCKED':
        return 'Bloquée';
      default:
        return statut;
    }
  }
}