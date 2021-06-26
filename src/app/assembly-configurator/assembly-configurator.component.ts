import { Component, OnInit } from '@angular/core';
import { ConfiguratorService } from '../services/configurator.service';
@Component({
  selector: 'app-assembly-configurator',
  templateUrl: './assembly-configurator.component.html',
  styleUrls: ['./assembly-configurator.component.scss']
})
export class AssemblyConfiguratorComponent implements OnInit {
  public groupValue: any;
  public selectedComponent: any;
  public assemblyDetails: any;
  constructor(public configuratorService: ConfiguratorService,) { }

  ngOnInit(): void {
  }

  ongroupChanged(val: any){
    this.groupValue = val;
  }
  
  public getAssemblyDetails(data: any){
    this.assemblyDetails = data;
    console.log('assemblyDetails', this.assemblyDetails);
  }

}
