import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-assembly',
  templateUrl: './edit-assembly.component.html',
  styleUrls: ['./edit-assembly.component.scss']
})
export class EditAssemblyComponent implements OnInit {

  public devices: any = [
    {value: 'device1', viewValue: 'In-wall devices'},
    {value: 'device2', viewValue: 'In-wall devices'},
    {value: 'device3', viewValue: 'In-wall devices'}
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
