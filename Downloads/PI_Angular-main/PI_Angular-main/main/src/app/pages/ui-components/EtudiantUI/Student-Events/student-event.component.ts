import { Component, OnInit } from '@angular/core';
import { EventService, Event } from 'src/app/services/Admin-Service/EventService';
import { ParticipationService } from 'src/app/services/Etudiant.Service/participation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {FormsModule} from "@angular/forms";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatToolbar} from "@angular/material/toolbar";
import {MatCard, MatCardActions, MatCardContent, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import { MatNativeDateModule } from '@angular/material/core';
import {MatButton} from "@angular/material/button";
@Component({
  selector: 'app-student-event',
  templateUrl: './student-event.component.html',
  standalone: true,
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
    MatButton
  ],
  styleUrls: ['./student-event.component.css']
})
export class StudentEventComponent implements OnInit {
  events: {
    date: Date | null;
    entreprise?: { id: number; nom: string };
    titre: string;
    description: string;
    id?: number;
    lieu: string;
    status?: string
  }[] = [];
  filteredEvents: {
    date: Date | null;
    entreprise?: { id: number; nom: string };
    titre: string;
    description: string;
    id?: number;
    lieu: string;
    status?: string
  }[] = [];
  today = new Date();
  isLoading = false;
  studentEmail: string = 'student@example.com'; // Replace manually or later via Auth

  filters = {
    title: '',
    company: '',
    startDateFrom: null as Date | null,
    startDateTo: null as Date | null
  };

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
      next: (data) => {
        this.events = data
          .map(event => ({
            ...event,
            date: this.parseDateSafe(event.date)
          }))
          .filter(event => event.date && event.date >= this.today);

        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading events', err);
        this.isLoading = false;
      }
    });
  }

  apply(eventId: number): void {
    this.participationService.applyToEvent(eventId, this.studentEmail).subscribe({
      next: () => {
        this.snackBar.open('Successfully applied to event!', 'Close', { duration: 3000 });
        this.loadUpcomingEvents();
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
        ? (event.date && new Date(event.date) >= this.filters.startDateFrom)
        : true;

      const dateToMatch = this.filters.startDateTo
        ? (event.date && new Date(event.date) <= this.filters.startDateTo)
        : true;

      return titleMatch && companyMatch && dateFromMatch && dateToMatch;
    });
  }




  parseDateSafe(date: any): Date | null {
    if (!date) return null;
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  goToDashboard(): void {
    this.router.navigate(['student/dashboard']);
  }

  protected readonly ParticipationService = ParticipationService;
}
