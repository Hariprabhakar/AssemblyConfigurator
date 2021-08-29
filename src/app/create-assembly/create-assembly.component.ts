import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  public isComponentLoader: boolean = false;
  private isEdit: boolean = false;
  public removedComponents: any;
  private isDuplicate: boolean = false;
  
  constructor( private configuratorService: ConfiguratorService, private toastService: ToastService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.showOverlay = true;
    this.configuratorService.getFamilies().subscribe((res: any) => {
      this.families = res;
      this.configuratorService.families = res;
      this.setFamilies();
    },
    (error: any) => {
      this.toastService.openSnackBar(error);
    });

    this.route.queryParams.subscribe(params => {
      this.isEdit = params.edit;
      this.isDuplicate = params.copy;
    }
  );

  if (this.isEdit && !this.isDuplicate) {
    this.showOverlay = false;
  }
    
  }

  onCategoryChanged(val: any){
    this.categoryValue = val;
  }

  public removeOverlay() {
    this.showOverlay = !this.showOverlay;
  }

  public addComponent(event: any){
    this.selectedComponent = {...event};
  }

  public removeComponent(event: any){

    
    this.removedComponents = event;
  }

  private setFamilies(){
    let family: any = {};
    this.families.forEach((familyItem: any) => {
      family[familyItem.id] = familyItem.name;
    });
  }

}
