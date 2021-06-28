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
  public isComponentLoader: boolean;
  constructor(public configuratorService: ConfiguratorService,) { }

  ngOnInit(): void {
  }

  ongroupChanged(val: any){
    this.groupValue = val;
  }

  /** Function to get data from app-assemblies component and will be passed in app-custom-assembly component
   * @memberOf AssemblyConfiguratorComponent
   */
  public getAssemblyDetails(data: any){
    this.assemblyDetails = data;
  }

  public isComponentLoading(isLoader: boolean){
    this.isComponentLoader = isLoader;
  }

}
