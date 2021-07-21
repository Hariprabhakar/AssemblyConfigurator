import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-message-modal',
  templateUrl: './message-modal.component.html',
  styleUrls: ['./message-modal.component.scss']
})
export class MessageModalComponent implements OnInit {

  public title: string = '';
  public projectLists: any;
  public isDuplicateComponentMsg: boolean = false;

  constructor(public dialogRef: MatDialogRef<MessageModalComponent>,  @Inject(MAT_DIALOG_DATA) public data: any) {
    dialogRef.disableClose = true;
   }

  ngOnInit(): void {
    this.title = this.data.title;
    this.projectLists = this.data.content;
    this.isDuplicateComponentMsg = this.data.isFromcomponent;
  }

  public close(){
    this.dialogRef.close();
  }

}
