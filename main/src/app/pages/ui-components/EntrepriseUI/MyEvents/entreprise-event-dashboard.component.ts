import {ParticipationService} from "../../../../services/Etudiant.Service/participation.service";
 import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Event } from 'src/app/models/event.model';
import { EventEntrepriseService } from 'src/app/services/Entreprise.Service/entreprise-event.service';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { EditEventDialogComponent, EditEventDialogData } from './edit-event-dialog.component';
import {DatePipe} from "@angular/common";
import {MatNativeDateModule} from "@angular/material/core";
import {Router} from "@angular/router";



interface EventWithParticipations extends Event {
  participations?: {
    id: number;
    etudiantEmail: string;
    status: string;
  }[];
}
@Component({
  selector: 'app-event-entreprise',
  templateUrl: './entreprise-event-dashboard.component.html',
  styleUrls: ['./entreprise-event-dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    EditEventDialogComponent,
    DatePipe,
    MatNativeDateModule,
  ],
})
export class EventEntrepriseComponent implements OnInit {
  events: EventWithParticipations[] = [];
  isLoading = false;

  constructor(
    private eventService: EventEntrepriseService,
    private participationService: ParticipationService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEventsWithParticipations();
  }

  loadEventsWithParticipations(): void {
    this.isLoading = true;
    this.eventService.getByEntrepriseId(1).subscribe({
      next: (data) => {
        const events: EventWithParticipations[] = data;
        const fetchParticipations = events.map((event) =>
          this.participationService.getByEventId(event.id!).toPromise().then((participations) => {
            event.participations = participations;
          })
        );

        Promise.all(fetchParticipations).then(() => {
          this.events = events;
          this.isLoading = false;
        }).catch(() => {
          this.isLoading = false;
        });
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  updateParticipationStatus(participationId: number, status: string): void {
    this.participationService.updateStatus(participationId, status).subscribe({
      next: () => this.loadEventsWithParticipations(),
      error: (err) => console.error('Error updating status:', err),
    });
  }

  openEditDialog(event?: Event): void {
    const dialogRef = this.dialog.open(EditEventDialogComponent, {
      width: '400px',
      data: {
        event: event || null,
        isNew: !event,
      } as EditEventDialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      if (result.action === 'save') {
        if (result.event.id) {
          this.eventService.update(result.event.id, result.event).subscribe(() => this.loadEventsWithParticipations());
        } else {
          this.eventService.create(result.event).subscribe(() => this.loadEventsWithParticipations());
        }
      } else if (result.action === 'delete') {
        this.eventService.delete(result.event.id!).subscribe(() => this.loadEventsWithParticipations());
      }
    });
  }

  goToDashboard(): void {
    this.router.navigate(['entreprise/dashboard']);
  }
}
