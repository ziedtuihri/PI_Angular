import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NoteService, UserNameDto } from '../../services/note.service';
import { EvaluationService } from '../../services/evaluation.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-note',
  standalone: true,
  templateUrl: './note.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent implements OnInit {
  users: UserNameDto[] = [];
  evaluations: any[] = [];

  noteForm: FormGroup = this.fb.group({});
  formReady = false;
  errorMessages: string[] = [];

  constructor(
    private fb: FormBuilder,
    private noteService: NoteService,
    private evaluationService: EvaluationService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadEvaluations();
  }

  loadUsers() {
    this.noteService.getUsersByRole().subscribe({
      next: (users) => {
        this.users = users;
        this.tryCreateFormControls();
      },
      error: (err) => {
        console.error('Erreur chargement utilisateurs', err);
      },
    });
  }

  loadEvaluations() {
    this.evaluationService.getAll().subscribe({
      next: (evaluations) => {
        this.evaluations = evaluations;
        this.tryCreateFormControls();
      },
      error: (err) => {
        console.error('Erreur chargement évaluations', err);
      },
    });
  }

  tryCreateFormControls() {
    if (this.users.length === 0 || this.evaluations.length === 0) {
      return;
    }

    for (const user of this.users) {
      for (const evaluation of this.evaluations) {
        const key = this.getFormKey(user.id, evaluation.idEvaluation!);
        if (!this.noteForm.contains(key)) {
          this.noteForm.addControl(
            key,
            this.fb.control('', [
              Validators.required,
              Validators.min(0),
              Validators.max(20),
            ])
          );
        }
      }
    }

    this.formReady = true;
  }

  getFormKey(userId: number, evalId: number): string {
    return `note_${userId}_${evalId}`;
  }

  onSubmit() {
    if (this.noteForm.invalid) {
      alert('Veuillez remplir toutes les notes correctement (0 à 20).');
      return;
    }

    this.errorMessages = [];

    for (const user of this.users) {
      for (const evaluation of this.evaluations) {
        const key = this.getFormKey(user.id, evaluation.idEvaluation!);
        const valeur = this.noteForm.get(key)?.value;

        if (valeur !== null && valeur !== undefined && valeur !== '') {
          const notePayload = {
            evaluationId: evaluation.idEvaluation!,
            sprintId: evaluation.sprint ? evaluation.sprint.idSprint : 0,
            userId: user.id,
            valeur: valeur,
          };

          console.log(notePayload);

          this.noteService.affecterNote(notePayload).subscribe({
            next: () => {
              console.log(
                `Note ajoutée: utilisateur ${user.id}, éval ${evaluation.idEvaluation}, valeur ${valeur}`
              );
              this.noteForm.get(key)?.disable();
            },
            error: (error: HttpErrorResponse) => {
              console.error('Erreur API affecterNote', error);

              if (
                error.error?.message?.includes('déjà été affectée') ||
                error.error?.message?.includes('already assigned')
              ) {
                const msg = `La note pour l'utilisateur ${user.firstName} ${user.lastName} et l'évaluation "${evaluation.titre}" a déjà été affectée.`;
                alert(msg);
                this.errorMessages.push(msg);
                this.noteForm.get(key)?.disable();
              } else if (error.status === 403) {
                alert(
                  `Erreur 403: accès refusé lors de l'ajout de la note pour ${user.firstName} ${user.lastName}. les notes sont deja saisies.`
                );
              } else {
                alert(
                  ` note ajouter avec succé pour ${user.firstName} ${user.lastName} et l'évaluation "${evaluation.titre}".`
                );
              }
            },
          });
        }
      }
    }
  }
}
