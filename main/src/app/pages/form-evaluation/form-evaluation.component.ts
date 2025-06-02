import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EvaluationService, Evaluation } from '../../services/evaluation.service';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-form-evaluation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
       MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatCheckboxModule,
        MatNativeDateModule,
        MatSnackBarModule,
        MatDatepickerModule

  ],
  templateUrl: './form-evaluation.component.html',
  styleUrls: ['./form-evaluation.component.scss'],
})
export class FormEvaluationComponent {
  evaluationService = inject(EvaluationService);
  dialogRef = inject(MatDialogRef<FormEvaluationComponent>);
  data = inject(MAT_DIALOG_DATA) as { evaluationToEdit: Evaluation };
  minDate: Date = new Date();
   // empêche la sélection de dates passées


  evaluationToEdit: Evaluation = { ...this.data.evaluationToEdit };

  onSubmit(): void {
    if (!this.evaluationToEdit.idEvaluation) {
      //this.toastr.error('ID de l’évaluation manquant', 'Erreur');
      return;
    }

    this.evaluationService.update(this.evaluationToEdit.idEvaluation, this.evaluationToEdit).subscribe({
      next: () => {
        //this.toastr.success('Évaluation modifiée avec succès ✅', 'Succès');
        this.dialogRef.close('updated');
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour de l’évaluation :', err);

      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

