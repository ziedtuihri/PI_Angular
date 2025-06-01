import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EventService } from '../../../../services/Admin-Service/EventService';
import { EditEventDialogComponent } from './EditEventDialogComponent';
import { MatToolbar } from "@angular/material/toolbar";

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule,
    MatDialogModule,
    EditEventDialogComponent,
    MatToolbar
  ],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],

})
export class EventListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'titre', 'description', 'date', 'lieu','entreprise', 'status', 'actions'];
  events: any[] = [];
  isLoading = false;

  constructor(
    private eventService: EventService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  // Load events and automatically update the status based on date
  loadEvents(): void {
    this.isLoading = true;
    this.eventService.getAll().subscribe({
      next: (data) => {
        console.log('Received Events:', data);  // Log the data to inspect
        this.events = data.map(event => this.updateEventStatus(event));  // Map through events and update status
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading events', err);
        this.isLoading = false;
      }
    });
  }

  addEvent(): void {
    const dialogRef = this.dialog.open(EditEventDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.eventService.add(result).subscribe({
          next: (createdEvent) => {
            this.events.push(this.updateEventStatus(createdEvent));  // Add the new event with the status update
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error adding event', err);
            this.isLoading = false;
          }
        });
      }
    });
  }

  editEvent(event: any): void {
    const dialogRef = this.dialog.open(EditEventDialogComponent, {
      width: '400px',
      data: event
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        const payload = {
          ...result,
          entreprise: result.entreprise ? { id: result.entreprise.id } : null
        };
        this.eventService.update(result.id, payload).subscribe({
          next: () => {
            const index = this.events.findIndex(e => e.id === result.id);
            if (index !== -1) {
              this.events[index] = { ...this.updateEventStatus(result) };
            }
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error updating event', err);
            this.isLoading = false;
          }
        });
      }
    });
  }


  deleteEvent(id: number): void {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }
    this.isLoading = true;
    this.eventService.delete(id).subscribe({
      next: () => {
        this.events = this.events.filter(event => event.id !== id); // Remove from local list
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error deleting event', err);
        this.isLoading = false;
      }
    });
  }

  refreshList(): void {
    this.loadEvents();
  }

  goToDashboard(): void {
    this.router.navigate(['admin/profile']);
  }

  goToEntreprise(): void {
    this.router.navigate(['admin/entreprises']);
  }

  goToEvents(): void {
    this.router.navigate(['admin/evenements']);
  }

  goToOffrePFE(): void {
    this.router.navigate(['admin/offres']);
  }

  goToEncadrants(): void {
    this.router.navigate(['admin/encadrant']);
  }

  // Check if event's date has passed and update the status accordingly
  updateEventStatus(event: any): any {
    const eventDate = new Date(event.date);
    const today = new Date();
    if (eventDate < today) {
      event.status = 'inactive'; // Set status to inactive if the event date has passed
    } else {
      event.status = 'active'; // Otherwise, keep status as active
    }
    return event;
  }
}
