import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assembly-configurator',
  templateUrl: './assembly-configurator.component.html',
  styleUrls: ['./assembly-configurator.component.scss']
})
export class AssemblyConfiguratorComponent implements OnInit {
  public groupValue: any;
  constructor() { }

  ngOnInit(): void {
  }

  ongroupChanged(val: any){
    this.groupValue = val;
  }
}
