import { Component, OnInit } from '@angular/core';
import { ConfiguratorService } from 'src/app/services/configurator.service';

@Component({
  selector: 'app-assemblies',
  templateUrl: './assemblies.component.html',
  styleUrls: ['./assemblies.component.scss']
})
export class AssembliesComponent implements OnInit {

  familyId: any = 1;
  companyId: any = 1;

  assembliesData: any[] = [];
  assembliesOriginalData: any = [];

  defaultAssemblies = false;
  customAssemblies = false;

  constructor( private configuratorService: ConfiguratorService ) { }

  ngOnInit(): void {
    this.getAssemblies(this.companyId, 1, this.defaultAssemblies, this.customAssemblies);
  }

  getAssemblies(companyId: number, familyId: number, defaultAssemblies: boolean, customAssemblies: boolean) {
    this.configuratorService.getAssemblies(companyId, familyId, defaultAssemblies, customAssemblies).subscribe(res => {
      this.assembliesOriginalData = res;
      this.assembliesData = [...this.assembliesOriginalData];
      // this.getImages(companyId, familyId, defaultAssemblies, customAssemblies);
    })
  }

  filterComponent(event: any){
  
  }



}
