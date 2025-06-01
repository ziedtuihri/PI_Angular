import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReunionService } from 'src/app/services/ReunionService';

@Component({
  selector: 'app-reunion-event',
  imports: [CommonModule],
  templateUrl: './reunion-event.component.html',
  styleUrl: './reunion-event.component.scss'
})
export class ReunionEventComponent implements OnInit {

  constructor(
    private readonly reunionService: ReunionService,
  ) { }

  hours: string[] = [];
  weekDays: { name: string; date: string }[] = [];
  events: any[] = [];
  intervalId: any;
  notifiedEventIds: Set<number> = new Set();

  ngOnInit(): void {
    for (let h = 8; h <= 23; h++) {
      this.hours.push(`${h}:00`);
    }
    this.hours.push("00:00");

    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMonday = (dayOfWeek + 6) % 7;

    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday);

    this.weekDays = [];

    for (let i = 0; i < 7; i++) {
      const current = new Date(monday);
      current.setDate(monday.getDate() + i);

      this.weekDays.push({
        name: days[i],
        date: `${current.getDate()}/${current.getMonth() + 1}`,
      });
    }

    this.reunionService.getEvenement().subscribe({
      next: (data: any) => {
        const now = new Date();
        this.events = (Array.isArray(data) ? data : []).map(event => {
          const eventEnd = new Date(event.end);
          return {
            ...event,
            isPast: eventEnd < now  
          };
        });
        console.log('events', this.events);
        this.startReminder();
      },
      complete: () => { }
    });
  }

  startReminder() {
    this.intervalId = setInterval(() => {
      const now = new Date();
      console.log("Vérification des rappels à", now.toLocaleTimeString());

      this.events.forEach(event => {
        const eventStart = new Date(event.start);
        const eventStartTime = new Date(event.start);
        eventStartTime.setMinutes(eventStart.getMinutes() - 10);
        const isReminderTime =
          now.getHours() === eventStartTime.getHours() &&
          now.getMinutes() === eventStartTime.getMinutes();

        console.log(`Événement "${event.title}" rappel à ${eventStartTime.toLocaleTimeString()}`);

        if (isReminderTime) {
          console.log(`Rappel pour l'événement "${event.title}"`);
          alert(`Votre réunion "${event.title}" commence dans 10 minutes.`);
        }
      });
    }, 60000);
  }


  stopReminder() {
    clearInterval(this.intervalId);
  }

  getEvent(dayName: string, hour: string) {
    const day = this.weekDays.find(d => d.name === dayName);
    if (!day) return null;

    const [h] = hour.split(':').map(Number);

    return this.events.find(event => {
      const startDate = new Date(event.start);
      return (
        startDate.getDate() === parseInt(day.date.split('/')[0]) &&
        startDate.getMonth() + 1 === parseInt(day.date.split('/')[1]) &&
        startDate.getHours() === h
      );
    });
  }


 joinMeeting(event: any): void {
  if (event.type === 'EN_LIGNE' && event.link) {
    // Ouvre le lien de la réunion dans un nouvel onglet
    window.open(event.link, '_blank');
  } else if (event.type === 'EN_LIGNE' && !event.link) {
    alert("Le lien de la réunion n'est pas disponible.");
  } else {
    alert("Cet événement n'est pas en ligne.");
  }
}

}
