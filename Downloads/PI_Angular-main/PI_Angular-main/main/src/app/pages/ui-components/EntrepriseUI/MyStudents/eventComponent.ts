// src/app/components/events/events.component.ts

import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';

import { FullCalendarComponent } from '@fullcalendar/angular'; // FullCalendar angular component
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface FullCalendarEvent {
  id?: number;
  title: string;
  start: string;
  end?: string;
  color?: string;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit, OnDestroy {

  @ViewChild('calendar') calendarComponent?: FullCalendarComponent;

  events: FullCalendarEvent[] = [];
  idEntreprise: string = '1';  // Replace with your dynamic id logic
  private subscription?: Subscription;

  // FullCalendar options
  calendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],  // will be set dynamically
    height: '100vh', // Full screen height
    editable: false,
    selectable: true,
    eventColor: '#378006',
  };

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.fetchEvents();
    } else {
      console.warn('User not authenticated. Access denied.');
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private isAuthenticated(): boolean {
    // Replace with real auth logic or service call
    return true;
  }

  fetchEvents(): void {
    this.subscription = this.eventService.getEventsByEntrepriseId(this.idEntreprise)
      .subscribe({
        next: (data: Event[]) => {
          const now = new Date();

          this.events = data.map(ev => {
            const eventDate = new Date(ev.date);
            return {
              id: ev.id,
              title: ev.titre,
              start: ev.date,
              end: ev.date, // assuming single-day events; update if your API has end date
              color: eventDate < now ? '#ff9f89' : '#1e90ff'
            };
          });

          this.calendarOptions = {
            ...this.calendarOptions,
            events: this.events
          };
        },
        error: err => {
          console.error('Error loading events:', err);
        }
      });
  }

}
