import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import { CalendarService } from 'src/app/services/calendar-service.service';

@Component({
  selector: 'app-calendar-list',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar-list.component.html',
  styleUrls: ['./calendar-list.component.scss']
})
export class CalendarListComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
    eventColor: '#3788d8'
  };

  constructor(private calendarService: CalendarService) {}

  ngOnInit(): void {
    this.calendarService.getAll().subscribe(events => {
      const coloredEvents = events.map(event => ({
        ...event,
        color: event.title.includes('Sprint') ? '#e74c3c' : '#3498db'
      }));

      this.calendarOptions = {
        ...this.calendarOptions,
        events: coloredEvents
      };
    });
  }
}
