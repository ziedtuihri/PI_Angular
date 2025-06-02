import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteService, NoteDisplayDto } from '../../services/note.service'; // Import NoteDisplayDto

@Component({
  selector: 'app-afficher-notes',
  standalone: true,
  imports: [CommonModule], // ✅ CommonModule is correctly added here
  templateUrl: './afficher-note.component.html',
  styleUrls: ['./afficher-note.component.scss'],
})
export class AfficherNotesComponent implements OnInit {
  // Define a more specific type for notesGrouped for better type safety
  notesGrouped: { userName: string; notes: { sprintName: string; valeur: number }[] }[] = [];

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    this.noteService.getNoteDisplay().subscribe((notes: NoteDisplayDto[]) => {
      // Use NoteDisplayDto for the incoming notes array for better type inference
      const groupMap: {
        [key: string]: { userName: string; notes: { sprintName: string; valeur: number }[] };
      } = {};

      for (const note of notes) {
        if (!groupMap[note.userName]) {
          groupMap[note.userName] = { userName: note.userName, notes: [] };
        }
        groupMap[note.userName].notes.push({
          sprintName: note.sprintNom,
          valeur: note.valeur,
        });
      }
      this.notesGrouped = Object.values(groupMap);
    });
  }
}