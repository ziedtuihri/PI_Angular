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
      },
      complete: () => { }
    });
    this.startReminder();

  }

  startReminder(): void {
    this.intervalId = setInterval(() => {
      const now = new Date();
      console.log("Vérification des rappels à", now.toLocaleTimeString());

      this.events.forEach(event => {
        const eventStart = new Date(event.start);
        const diffInMs = eventStart.getTime() - now.getTime();
        const diffInMinutes = Math.floor(diffInMs / 60000);

        console.log(`Événement "${event.title}" commence dans ${diffInMinutes} minutes`);

        if (diffInMinutes === 10 && !this.notifiedEventIds.has(event.id)) {
          this.notifiedEventIds.add(event.id);
          alert(`Votre réunion "${event.title}" commence dans 10 minutes.`);
        }
      });
    }, 60000); 
  }

  joinMeeting(event: any): void {
    console.log("joinMeeting called with event:", event);
    if (event.type === 'EN_LIGNE' && event.link) {
      window.open(event.link, '_blank');
    } else if (event.type === 'EN_LIGNE' && !event.link) {
      alert("Le lien de la réunion n'est pas disponible.");
    } else {
      alert("Cet événement n'est pas en ligne.");
    }
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


}
