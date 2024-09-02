import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-product-modal',
  standalone: true,
  imports: [
    MatDialogModule,
  ],
  templateUrl: './delete-product-modal.component.html',
  styleUrl: './delete-product-modal.component.scss'
})
export class DeleteProductModalComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number, name: string }
  ) { }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
