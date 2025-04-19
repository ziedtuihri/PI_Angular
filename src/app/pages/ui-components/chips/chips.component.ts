import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReunionService } from 'src/app/services/ReunionService';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class AppChipsComponent implements OnInit {


  constructor(private readonly reunionService: ReunionService) { }

  hours: string[] = [];
  weekDays: { name: string; date: string }[] = [];
  events: any[] = [];


  ngOnInit(): void {


    for (let h = 8; h <= 18; h++) {
      this.hours.push(`${h}:00`);
    }

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
        this.events = Array.isArray(data) ? data : [];
      },

      complete: () => {
      }
    });
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
    if (event.link) {
      window.open(event.link, '_blank');
    } else {
      alert("Lien de réunion non disponible.");
    }
  }

}

