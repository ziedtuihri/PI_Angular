import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-entreprise-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './edit-entreprise-dialog.component.html',
  styleUrls: ['./edit-entreprise-dialog.component.css']
})
export class EditEntrepriseDialogComponent {
  entreprise: any;

  constructor(
    public dialogRef: MatDialogRef<EditEntrepriseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.entreprise = { ...data };
  }

  onSave(): void {
    this.dialogRef.close(this.entreprise);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
