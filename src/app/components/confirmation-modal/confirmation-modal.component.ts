import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  public title: string = '';
  public content: string = '';

  constructor(public dialogRef: MatDialogRef<ConfirmationModalComponent>,  @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
   }

  ngOnInit(): void {
    this.title = this.data.title;
    this.content = this.data.content;
  }

  public close(isRemove : boolean = false){
    this.dialogRef.close(isRemove);
  }
}

