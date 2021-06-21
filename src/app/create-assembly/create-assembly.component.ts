import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ConfiguratorService } from '../services/configurator.service';
import { ToastService } from '../shared/services/toast.service';

@Component({
  selector: 'app-create-assembly',
  templateUrl: './create-assembly.component.html',
  styleUrls: ['./create-assembly.component.scss']
})
export class CreateAssemblyComponent implements OnInit {

  public categoryValue: any;
  public families: any;
  public showOverlay: boolean;
  public selectedComponent: any;
  
  constructor( private configuratorService: ConfiguratorService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.showOverlay = true;
    this.configuratorService.getFamilies().subscribe((res: any) => {
      console.log('families List', res);
      this.families = res;
      this.setFamilies();
    },
    (error: any) => {
      this.toastService.openSnackBar(error);
    });
    
  }

  onCategoryChanged(val: any){
    this.categoryValue = val;
    console.log('in parent', this.categoryValue);
  }

  public removeOverlay() {
    this.showOverlay = !this.showOverlay;
  }

  public addComponent(event: any){
    this.selectedComponent = event;
    console.log(event);
  }

  private setFamilies(){
    let family: any = {};
    this.families.forEach((familyItem: any) => {
      family[familyItem.id] = familyItem.name;
    });
  }

}
