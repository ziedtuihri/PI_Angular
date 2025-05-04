import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { TacheService } from '../../../services/tache.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Tache {
  idTache: number;
  nom: string;
  dateDebut: string;
  dateFin: string;
  statut: string;
  sprint?: { idSprint: number; nom: string };
}

@Component({
  selector: 'app-listtache',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './listtache.component.html',
  styleUrl: './listtache.component.scss',
})
export class ListtacheComponent implements OnInit {
  displayedColumns: string[] = ['nom', 'dateDebut', 'dateFin', 'statut', 'sprint', 'actions'];
  dataSource = new MatTableDataSource<Tache>([]);
  loading = true;
  errorMessage = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private tacheService: TacheService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTaches();
  }

  loadTaches(): void {
    this.loading = true;
    this.tacheService.getAllTaches().subscribe({
      next: (taches) => {
        this.dataSource.data = taches;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la récupération des tâches.';
        console.error(error);
        this.loading = false;
      },
    });
  }

  addTache(): void {
    this.router.navigate(['/taches/add']);
  }

  editTache(id: number): void {
    this.router.navigate(['/taches/edit', id]);
  }

  viewTacheDetails(id: number): void {
    this.router.navigate(['/taches/details', id]);
  }

  deleteTache(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      this.tacheService.deleteTache(id).subscribe({
        next: () => {
          this.loadTaches();
          this.snackBar.open('Tâche supprimée avec succès', 'Fermer', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('Erreur lors de la suppression de la tâche', 'Fermer', { duration: 3000 });
          console.error(error);
        },
      });
    }
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