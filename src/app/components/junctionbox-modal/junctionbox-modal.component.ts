import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-junctionbox-modal',
  templateUrl: './junctionbox-modal.component.html',
  styleUrls: ['./junctionbox-modal.component.scss']
})
export class JunctionboxModalComponent implements OnInit {
  public JunctionBoxFrom: FormGroup = this.formBuilder.group({
    systemName: ['', Validators.required],
    connectionFill: ['', Validators.required]
  });;
  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<JunctionboxModalComponent>) { }
  
  ngOnInit(): void {


  }
  public onSubmit(): void {
    if (this.JunctionBoxFrom.valid) {
       console.log('junctionbox', this.JunctionBoxFrom.value);
       this.dialogRef.close(this.JunctionBoxFrom.value);
    }
    
  }
}
