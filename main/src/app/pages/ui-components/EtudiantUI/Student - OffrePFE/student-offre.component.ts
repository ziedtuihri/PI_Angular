// src/app/components/student-offre/student-offre.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { OffreStudentService } from 'src/app/services/Etudiant.Service/offre-student.service';
import { CandidatureService } from 'src/app/services/Entreprise.Service/candidature.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from "@angular/router";
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-student-offre',
  standalone: true,
  templateUrl: './student-offre.component.html',
  styleUrls: ['./student-offre.component.css'],
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSnackBarModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
  ]
})
export class StudentOffreComponent implements OnInit {
  displayedColumns = ['id', 'titre', 'localisation', 'dateDebut', 'dateFin', 'candidatureCount', 'actions'];
  offres: any[] = [];
  filteredOffres: any[] = [];
  isLoading = false;
  today = new Date();
  studentEmail = 'student@example.com'; // Replace with actual auth logic
  appliedOfferIds: Set<number> = new Set<number>();
  filters: {
    competence: string;
    company: string;
    startDateFrom: Date | null;
    startDateTo: Date | null;
  } = {
    competence: '',
    company: '',
    startDateFrom: null,
    startDateTo: null,
  };

  constructor(
    private offreService: OffreStudentService,
    private candidatureService: CandidatureService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAppliedOffers();
    this.loadUpcomingOffres();
  }

  loadAppliedOffers() {
    this.candidatureService.getAppliedOffersByStudent(this.studentEmail).subscribe({
      next: (appliedOffers) => {
        this.appliedOfferIds = new Set(appliedOffers.map(o => o.id));
      },
      error: () => {
        this.appliedOfferIds = new Set();
      }
    });
  }


  loadUpcomingOffres() {
    this.isLoading = true;
    this.offreService.getAll().subscribe({
      next: (data) => {
        this.offres = data
          .map(offre => ({
            ...offre,
            dateDebut: this.parseDateSafe(offre.dateDebut),
            dateFin: this.parseDateSafe(offre.dateFin),
          }))
          .filter(offre => offre.dateDebut && offre.dateDebut >= this.today && offre.disponible);

        this.offres.forEach(offre => {
          this.candidatureService.getCandidatureCountByOffre(offre.id).subscribe({
            next: (count) => {
              offre.candidatureCount = count;
            },
            error: () => {
              offre.candidatureCount = 0;
            }
          });
        });

        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading offers', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters() {
    this.filteredOffres = this.offres.filter(offre => {
      const competenceMatch = this.filters.competence
        ? (offre.competences && typeof offre.competences === 'string' && offre.competences.toLowerCase().includes(this.filters.competence.toLowerCase()))
        : true;

      const companyMatch = this.filters.company
        ? (offre.entreprise && offre.entreprise.nom && typeof offre.entreprise.nom === 'string' && offre.entreprise.nom.toLowerCase().includes(this.filters.company.toLowerCase()))
        : true;

      const startDateFromMatch = this.filters.startDateFrom
        ? (offre.dateDebut instanceof Date && offre.dateDebut >= this.filters.startDateFrom)
        : true;

      const startDateToMatch = this.filters.startDateTo
        ? (offre.dateDebut instanceof Date && offre.dateDebut <= this.filters.startDateTo)
        : true;

      return competenceMatch && companyMatch && startDateFromMatch && startDateToMatch;
    });
  }

  apply(offreId: number): void {
    this.candidatureService.applyCandidature(offreId, this.studentEmail).subscribe({
      next: () => {
        this.snackBar.open('Applied successfully!', 'Close', { duration: 3000 });
        this.appliedOfferIds.add(offreId);  // mark as applied
      },
      error: (err) => {
        console.error('Apply error', err);
        this.snackBar.open('You have already applied For This Application. Please wait until the Company review your Profile.', 'Close', { duration: 4000 });
      }
    });
  }



  private parseDateSafe(date: any): Date | null {
    if (!date) return null;
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  goToDashboard() {
    this.router.navigate(['student/dashboard']);
  }
}
