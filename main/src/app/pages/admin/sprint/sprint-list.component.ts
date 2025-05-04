import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Sprint, SprintService } from '../../../services/sprint.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';

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
    DatePipe,
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './sprint-list.component.html',
  styleUrls: ['./sprint-list.component.scss'],
})
export class SprintListComponent implements OnInit, AfterViewInit {
  sprints: Sprint[] = [];
  displayedColumns: string[] = ['nom', 'dateDebut', 'dateFin', 'statut', 'actions'];
  dataSource = new MatTableDataSource<Sprint>(this.sprints);
  loading = true;
  errorMessage = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  searchControl = new FormControl('');
  pageSize = 5;
  pageIndex = 0;

  constructor(
    private sprintService: SprintService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSprints();
    this.setupSearch();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Assurez-vous que cette ligne est ici
  }

  loadSprints(): void {
    this.loading = true;
    this.sprintService.getAllSprints().subscribe({
      next: (sprints) => {
        this.sprints = sprints;
        this.dataSource.data = sprints;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des sprints.';
        console.error('Erreur chargement sprints', error);
        this.loading = false;
      },
    });
  }

  setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term: string | null) => {
          this.loading = true;
          if (term) {
            console.log('Recherche par terme:', term);
            return this.sprintService.searchSprints(term);
          } else {
            console.log('Rechargement de tous les sprints...');
            return this.sprintService.getAllSprints().pipe(
              tap(() => console.log('Tous les sprints ont été récupérés.'))
            );
          }
        })
      )
      .subscribe({
        next: (results) => {
          this.sprints = results;
          this.dataSource.data = results;
          this.dataSource.paginator = this.paginator; // Essayez d'assigner le paginator ici aussi après la recherche
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la recherche des sprints.';
          console.error('Erreur recherche sprints', error);
          this.loading = false;
        },
      });
  }

  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    // Si vous chargez les données depuis le serveur, vous devrez le faire ici
    // en utilisant this.pageSize et this.pageIndex.
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
          this.loadSprints();
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