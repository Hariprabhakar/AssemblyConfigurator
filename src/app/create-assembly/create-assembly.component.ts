import { Component, OnInit } from '@angular/core';
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
  
  constructor( private configuratorService: ConfiguratorService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.showOverlay = false;
    this.configuratorService.getFamilies().subscribe((res: any) => {
      this.families = res;
    },
    (error: any) => {
      this.toastService.openSnackBar(error);
    });
    
  }

  onCategoryChanged(val: any){
    this.categoryValue = val;
  }

  public removeOverlay() {
    this.showOverlay = !this.showOverlay;
  }

}
