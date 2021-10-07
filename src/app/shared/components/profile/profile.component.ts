import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: any, public dialogRef: MatDialogRef<ProfileComponent>) { }

  ngOnInit(): void {
    
  }

  public changed(){
    this.document.body.classList.toggle('light');
  }

  public close() {
    this.dialogRef.close();
  }
}
