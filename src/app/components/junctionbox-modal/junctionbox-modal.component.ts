import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ConfiguratorService } from 'src/app/services/configurator.service';
@Component({
  selector: 'app-junctionbox-modal',
  templateUrl: './junctionbox-modal.component.html',
  styleUrls: ['./junctionbox-modal.component.scss']
})
export class JunctionboxModalComponent implements OnInit {
  public JunctionBoxFrom: FormGroup = this.formBuilder.group({
    systemName: ['', Validators.required],
    connection: ['', Validators.required]
  });
  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<JunctionboxModalComponent>,  @Inject(MAT_DIALOG_DATA) public data: any, private configuratorService: ConfiguratorService) { }

  public isJunctionBoxGroup: any;
 
  
  ngOnInit(): void {
  console.log(this.data);
  const assemblyData = this.configuratorService.getAssemblyData();
  //this.isJunctionBoxGroup = assemblyData['familyId'] == 2;
  this.isJunctionBoxGroup = true;
  this.JunctionBoxFrom.patchValue({
    systemName: this.data.system,
    connection: this.data.connection
  });

  }
  public onSubmit(): void {
    if (this.JunctionBoxFrom.valid) {
       console.log('junctionbox', this.JunctionBoxFrom.value);
       this.dialogRef.close(this.JunctionBoxFrom.value);
    }
    
  }

  public close(){
    this.dialogRef.close(false);
  }
}
// function Inject(MAT_DIALOG_DATA: any) {
//   throw new Error('Function not implemented.');
// }

// function MAT_DIALOG_DATA(MAT_DIALOG_DATA: any) {
//   throw new Error('Function not implemented.');
// }

// function ngOnInit() {
//   throw new Error('Function not implemented.');
// }

