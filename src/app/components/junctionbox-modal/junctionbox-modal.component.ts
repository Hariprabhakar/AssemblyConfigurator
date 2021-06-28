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
    systemName: [''],
    connection: ['']
  });
  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<JunctionboxModalComponent>,  @Inject(MAT_DIALOG_DATA) public data: any, private configuratorService: ConfiguratorService) {
    dialogRef.disableClose = true;
   }

  public isJunctionBoxGroup: any;
  public connectionTypes = [{
    name: '1/2" EMT',
    value: '1/2" EMT'
  },
  {
    name: '3/4" EMT',
    value: '3/4" EMT'
  },
  {
    name: '1" EMT',
    value: '1" EMT'
  },
  {
    name: '1 1/4" EMT',
    value: '1 1/4" EMT'
  },
  {
    name: '1 1/2" EMT',
    value: '1 1/2" EMT'
  },
  {
    name: 'MC Cable',
    value: 'MC Cable'
  }];

  public systems = [{
    name: 'Power',
    value: 'Power'
  },
  {
    name: 'Data',
    value: 'Data'
  },
  {
    name: 'Lighting',
    value: 'Lighting'
  },
  {
    name: 'Fire Alarm',
    value: 'Fire Alarm'
  },
  {
    name: 'Communication',
    value: 'Communication'
  },
  {
    name: 'Security',
    value: 'Security'
  },
  {
    name: 'Mechanical',
    value: 'Mechanical'
  },
  {
    name: 'Telephone / POT',
    value: 'Telephone / POT'
  }];
  
  ngOnInit(): void {
  const assemblyData = this.configuratorService.getAssemblyData();
  this.isJunctionBoxGroup = assemblyData['familyId'] == 2;
  // this.isJunctionBoxGroup = false;
  if (!this.data.isAdd) {
    if (this.isJunctionBoxGroup) {
      this.JunctionBoxFrom.patchValue({
        systemName: this.data.system,
        connection: this.data.connection
      });
    } else {
      this.JunctionBoxFrom.patchValue({
        systemName: this.data.system[0],
        connection: this.data.connection[0]
      });
    }
  }

  }

  public onSubmit(): void {
    if (this.JunctionBoxFrom.valid) {
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

