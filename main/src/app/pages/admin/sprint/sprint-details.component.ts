import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SprintService, Sprint } from '../../../services/sprint.service';
import { DatePipe, CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-sprint-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterLink, DatePipe, MatProgressSpinnerModule],
  templateUrl: './sprint-details.component.html',
  styleUrl: './sprint-details.component.scss'
})
export class SprintDetailsComponent implements OnInit {
  sprintId!: number;
  sprintDetails?: Sprint;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private sprintService: SprintService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.sprintId = +id;
        this.getSprintDetails(this.sprintId);
      }
    });
  }

  getSprintDetails(id: number): void {
    this.loading = true;
    this.sprintService.getSprintById(id).subscribe({
      next: (data) => {
        this.sprintDetails = data;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la récupération des détails du sprint.';
        console.error(error);
        this.loading = false;
      }
    });
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case 'NOTSTARTED':
        return 'statut-non-demarre';
      case 'INPROGRESS':
        return 'statut-en-cours';
      case 'CANCELLED':
        return 'statut-annule';
      case 'DONE':
        return 'statut-termine';
      default:
        return '';
    }
  }
}