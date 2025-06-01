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

@Component({
  selector: 'app-event-entreprise',
  templateUrl: './entreprise-event-dashboard.component.html',
  styleUrls: ['./entreprise-event-dashboard.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
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
    CommonModule
  ]
})
export class EventEntrepriseComponent implements OnInit {
  events: Event[] = [];
  isLoading = false;

  constructor(
    private eventService: EventEntrepriseService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.eventService.getByEntrepriseId(1).subscribe({
      next: (data) => {
        this.events = data;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  goToDashboard() {
    this.router.navigate(['entreprise/dashboard']);
  }

  openEditDialog(event?: Event): void {
    const dialogRef = this.dialog.open(EditEventDialogComponent, {
      width: '400px',
      data: {
        event: event || null,
        isNew: !event
      } as EditEventDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;

      if (result.action === 'save') {
        if (result.event.id) {
          this.eventService.update(result.event.id, result.event).subscribe(() => this.loadEvents());
        } else {
          this.eventService.create(result.event).subscribe(() => this.loadEvents());
        }
      } else if (result.action === 'delete') {
        this.eventService.delete(result.event.id!).subscribe(() => this.loadEvents());
      }
    });
  }
}
