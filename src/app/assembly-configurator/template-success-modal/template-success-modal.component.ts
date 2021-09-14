import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-template-success-modal',
  templateUrl: './template-success-modal.component.html',
  styleUrls: ['./template-success-modal.component.scss']
})
export class TemplateSuccessModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TemplateSuccessModalComponent>) {
    this.dialogRef.disableClose = true;
   }

  ngOnInit(): void {
  }

  public close() {
    this.dialogRef.close();
  }
  
}
