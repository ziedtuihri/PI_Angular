import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteService, UserNameDto } from '../../services/note.service';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {
  users: UserNameDto[] = [];

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.noteService.getUsersByRole().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs :', err);
      }
    });
  }
}

