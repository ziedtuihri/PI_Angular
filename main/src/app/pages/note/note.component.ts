import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { CommonModule } from '@angular/common';
import { NoteService, UserNameDto } from '../../services/note.service';
=======
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
>>>>>>> de01570 (modif mariem+mahdi)

@Component({
  selector: 'app-note',
  standalone: true,
<<<<<<< HEAD
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

=======
  templateUrl: './note.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent implements OnInit {
  users: UserNameDto[] = [];
  evaluations: any[] = []; // Consider creating an interface for Evaluation to type this array
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
        const key = this.getFormKey(user.id, evaluation.idEvaluation!); // Assuming idEvaluation exists
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

    this.errorMessages = []; // Clear previous error messages

    for (const user of this.users) {
      for (const evaluation of this.evaluations) {
        const key = this.getFormKey(user.id, evaluation.idEvaluation!);
        const valeur = this.noteForm.get(key)?.value;

        // Only send notes that have a value entered
        if (valeur !== null && valeur !== undefined && valeur !== '') {
          const notePayload = {
            evaluationId: evaluation.idEvaluation!,
            // Assuming sprintId is available on evaluation object, or needs to be fetched/determined differently
            sprintId: evaluation.sprint ? evaluation.sprint.idSprint : 0, // Fallback to 0 if sprint or idSprint is null
            userId: user.id,
            valeur: valeur,
          };

          this.noteService.affecterNote(notePayload).subscribe({
            next: () => {
              console.log(
                `Note ajoutée: utilisateur ${user.id}, éval ${evaluation.idEvaluation}, valeur ${valeur}`
              );
              // Disable the control upon successful submission
              this.noteForm.get(key)?.disable();
            },
            error: (error: HttpErrorResponse) => {
              console.error('Erreur API affecterNote', error);
              if (
                error.error?.message?.includes('déjà été affectée') ||
                error.error?.message?.includes('already assigned')
              ) {
                const msg = `La note pour l'utilisateur ${user.firstName} ${user.lastName} et l'évaluation "${evaluation.titre}" a déjà été affectée.`; // Assuming evaluation.titre exists
                alert(msg);
                this.errorMessages.push(msg);
                this.noteForm.get(key)?.disable(); // Disable if already assigned
              } else if (error.status === 403) {
                alert(
                  `Erreur 403: accès refusé lors de l'ajout de la note pour ${user.firstName} ${user.lastName}. les notes sont deja saisies.`
                );
              } else {
                // This alert message seems contradictory for an error block.
                // It suggests success ("note ajouter avec succé") but is in the error handler.
                // It should likely be an error message or this branch should not exist in an error handler.
                // Keeping as per "ne touche rien" instruction.
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
>>>>>>> de01570 (modif mariem+mahdi)
