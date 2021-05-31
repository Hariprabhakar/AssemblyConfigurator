import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-assembly',
  templateUrl: './create-assembly.component.html',
  styleUrls: ['./create-assembly.component.scss']
})
export class CreateAssemblyComponent implements OnInit {

  public devices: any = [
    {value: 'device1', viewValue: 'In-wall devices'},
    {value: 'device2', viewValue: 'In-wall devices'},
    {value: 'device3', viewValue: 'In-wall devices'}
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
