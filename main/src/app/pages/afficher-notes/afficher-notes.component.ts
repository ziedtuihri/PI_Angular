import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteService } from "../../services/note.service";

@Component({
  selector: 'app-afficher-notes',
  standalone: true,
  imports: [CommonModule], // ✅ ajoute CommonModule ici
  templateUrl: './afficher-notes.component.html',
  styleUrls: ['./afficher-notes.component.scss']
})
export class AfficherNotesComponent {

  notesGrouped: { userName: string, notes: { sprintName: string, valeur: number }[] }[] = [];

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    this.noteService.getNoteDisplay().subscribe(notes => {
      const groupMap: { [key: string]: { userName: string, notes: { sprintName: string, valeur: number }[] } } = {};
      for (const note of notes) {
        if (!groupMap[note.userName]) {
          groupMap[note.userName] = { userName: note.userName, notes: [] };
        }
        groupMap[note.userName].notes.push({
          sprintName: note.sprintNom,
          valeur: note.valeur
        });
      }

      this.notesGrouped = Object.values(groupMap);
    });
  }
}
