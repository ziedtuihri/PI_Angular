// src/app/pages/admin/sprint/sprint-details/sprint-details.component.ts

import { Component, OnInit } from '@angular/core';
import { Router ,RouterModule , ActivatedRoute} from '@angular/router';
//import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // ADDED RouterModule here
import { SprintService } from '../../../services/sprint.service';
// Remove import { Sprint } from '../../../shared/models/sprint.models';

// Angular Material Imports (these remain the same as they are for UI components)
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// No need for RouterLink explicitly if RouterModule is imported. RouterLink is part of RouterModule.
// import { RouterLink } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-sprint-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // ADDED RouterModule to imports
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    // RouterLink, // Can remove this if RouterModule is imported, as RouterLink is part of it
    MatChipsModule,
  ],
  templateUrl: './sprint-details.component.html',
  styleUrls: ['./sprint-details.component.scss']
})
export class SprintDetailsComponent implements OnInit {
  sprintId: number | null = null;
  sprintDetails: any; // Change Sprint | undefined to any
  loading: boolean = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private sprintService: SprintService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.sprintId = +id;
        this.loadSprintDetails();
      } else {
        this.errorMessage = "ID du sprint non fourni dans l'URL.";
        this.loading = false;
      }
    });
  }

  loadSprintDetails(): void {
    if (this.sprintId === null) {
      this.errorMessage = "Impossible de charger les détails : ID du sprint est null.";
      this.loading = false;
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.sprintService.getSprintById(this.sprintId).subscribe({
      next: (data) => {
        this.sprintDetails = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des détails du sprint:', err);
        this.errorMessage = "Erreur lors du chargement des détails du sprint. Veuillez réessayer.";
        this.loading = false;
      }
    });
  }

  getStatutClass(statut: string | undefined): string { // Keep 'string | undefined' for safety here
    if (!statut) return '';
    switch (statut.toUpperCase()) {
      case 'IN_PROGRESS': return 'status-in-progress';
      case 'COMPLETED': return 'status-completed';
      case 'PLANNED': return 'status-planned';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  }
}