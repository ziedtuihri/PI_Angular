import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ai-quiz-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './ai-quiz-dialog.component.html',
  styleUrl: './ai-quiz-dialog.component.scss'
})
export class AiQuizDialogComponent {
  form = this.fb.group({ count: [5], prompt: [''] });

  constructor(
    private dialogRef: MatDialogRef<AiQuizDialogComponent>,
    private fb: FormBuilder
  ) {}

  submit() {
    this.dialogRef.close(this.form.value);
  }
}