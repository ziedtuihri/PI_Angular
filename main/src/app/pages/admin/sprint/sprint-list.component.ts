// sprint-list.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { Sprint, SprintService } from '../../../services/sprint.service'; // Assurez-vous que le chemin est correct
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-sprint-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    DatePipe, // Importez DatePipe si vous l'utilisez dans le template
  ],
  templateUrl: './sprint-list.component.html',
  styleUrls: ['./sprint-list.component.scss'],
})
export class SprintListComponent implements OnInit {
  sprints: Sprint[] = [];
  displayedColumns: string[] = ['nom', 'dateDebut', 'dateFin', 'statut', 'actions'];
  loading = true;
  errorMessage = '';
  dataSource = new MatTableDataSource<Sprint>(this.sprints);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private sprintService: SprintService, private router: Router) {}

  ngOnInit(): void {
    this.loadSprints();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadSprints(): void {
    this.loading = true;
    this.sprintService.getAllSprints().subscribe({
      next: (sprints) => {
        this.sprints = sprints;
        this.dataSource = new MatTableDataSource<Sprint>(this.sprints);
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des sprints.';
        console.error('Erreur chargement sprints', error);
        this.loading = false;
      },
    });
  }

  editSprint(id: number): void {
    this.router.navigate(['/sprints', id, 'edit']);
  }

  viewEtudiants(id: number): void {
    this.router.navigate(['/sprints', id, 'etudiants', 'manage']);
  }

  deleteSprint(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce sprint ?')) {
      this.sprintService.deleteSprint(id).subscribe({
        next: () => {
          this.loadSprints(); // Refresh the list after deletion
        },
        error: (error) => {
          console.error('Erreur suppression sprint', error);
          this.errorMessage = 'Erreur lors de la suppression du sprint.';
        },
      });
    }
  }

  addSprint(): void {
    this.router.navigate(['/sprints', 'add']);
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