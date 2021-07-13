import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ContactUsComponent>) { }

  ngOnInit(): void {
  }

  public close() {
    this.dialogRef.close();
  }

}
