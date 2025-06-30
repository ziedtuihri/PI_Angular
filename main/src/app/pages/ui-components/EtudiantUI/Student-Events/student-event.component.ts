import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/Admin-Service/EventService';
import { ParticipationService } from 'src/app/services/Etudiant.Service/participation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle
} from '@angular/material/datepicker';
import {
  MatFormField,
  MatInput,
  MatLabel
} from '@angular/material/input';
import { MatToolbar } from '@angular/material/toolbar';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import {MatButtonToggleGroup, MatButtonToggleModule} from '@angular/material/button-toggle';


@Component({
  selector: 'app-student-event',
  templateUrl: './student-event.component.html',
  standalone: true,
  styleUrls: ['./student-event.component.css'],
  imports: [
    MatProgressSpinner,
    DatePipe,
    FormsModule,
    MatDatepickerToggle,
    MatLabel,
    MatFormField,
    MatDatepicker,
    MatDatepickerInput,
    MatToolbar,
    MatCard,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatCardActions,
    MatNativeDateModule,
    NgForOf,
    NgIf,
    MatInput,
    MatButton,
    MatButtonToggleGroup, MatButtonToggleModule

      ]
})
export class StudentEventComponent implements OnInit {
  events: Awaited<{
    date: Date | null;
    entreprise?: { id: number; nom: string };
    titre: string;
    hasApplied: boolean;
    description: string;
    id?: number;
    lieu: string;
    status?: string;

  }>[] = [];

  filteredEvents: typeof this.events = [];
  today = new Date();
  isLoading = false;

  studentEmail: string = 'student@example.com'; // Replace with actual auth when available

  filters = {
    title: '',
    company: '',
    startDateFrom: null as Date | null,
    startDateTo: null as Date | null
  };
  viewMode: 'all' | 'mine' = 'all'; // default is "All Events"
  constructor(
    private eventService: EventService,
    private participationService: ParticipationService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUpcomingEvents();
  }

  loadUpcomingEvents(): void {
    this.isLoading = true;

    this.eventService.getAll().subscribe({
      next: async (data) => {
        const mappedEvents = data
          .map(event => ({
            ...event,
            date: this.parseDateSafe(event.date),
            hasApplied: false // default
          }))
          .filter(event => event.date && event.date >= this.today);

        const statusChecks = mappedEvents.map(async event => {
          try {
            const applied = await this.participationService
              .hasStudentApplied(event.id ?? 0, this.studentEmail)
              .toPromise();
            event.hasApplied = applied ?? false; // fix for TS2322
          } catch (e) {
            console.error(`Error checking application for event ${event.id}`, e);
            event.hasApplied = false;
          }
          return event;
        });

        this.events = await Promise.all(statusChecks);
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading events', err);
        this.isLoading = false;
      }
    });
  }

  apply(event: any): void {
    this.participationService.applyToEvent(event.id, this.studentEmail).subscribe({
      next: () => {
        this.snackBar.open('Successfully applied to event!', 'Close', { duration: 3000 });
        event.hasApplied = true; // ✅ update UI without reload
      },
      error: (err) => {
        console.error('Apply error', err);
        this.snackBar.open('Application failed or already applied.', 'Close', { duration: 4000 });
      }
    });
  }


  applyFilters(): void {
    this.filteredEvents = this.events.filter(event => {
      const title = String(event.titre || '');
      const filterTitle = String(this.filters.title || '');

      const company = String(event.entreprise?.nom || '');
      const filterCompany = String(this.filters.company || '');

      const titleMatch = this.filters.title
        ? title.toLowerCase().includes(filterTitle.toLowerCase())
        : true;

      const companyMatch = this.filters.company
        ? company.toLowerCase().includes(filterCompany.toLowerCase())
        : true;

      const dateFromMatch = this.filters.startDateFrom
        ? event.date && event.date >= this.filters.startDateFrom
        : true;

      const dateToMatch = this.filters.startDateTo
        ? event.date && event.date <= this.filters.startDateTo
        : true;
      const viewModeMatch = this.viewMode === 'mine'
        ? event.hasApplied
        : true;

      return titleMatch && companyMatch && dateFromMatch && dateToMatch && viewModeMatch;
    });
  }

  parseDateSafe(date: any): Date | null {
    if (!date) return null;
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  cancelParticipation(event: any): void {
    this.participationService.getByEventId(event.id).subscribe({
      next: (participations) => {
        const target = participations.find(p => p.studentEmail === this.studentEmail);
        if (target) {
          this.participationService.deleteParticipation(target.id, this.studentEmail).subscribe({
            next: () => {
              this.snackBar.open('Participation canceled successfully.', 'Close', { duration: 3000 });
              event.hasApplied = false;
            },
            error: (err) => {
              console.error('Error canceling participation', err);
              this.snackBar.open('Failed to cancel participation.', 'Close', { duration: 4000 });
            }
          });
        } else {
          this.snackBar.open('Participation not found.', 'Close', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error('Error retrieving participation', err);
        this.snackBar.open('Failed to find participation.', 'Close', { duration: 4000 });
      }
    });
  }




  goToDashboard(): void {
    this.router.navigate(['student/dashboard']);
  }
}
