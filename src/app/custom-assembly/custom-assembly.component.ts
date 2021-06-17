import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import { FileChooseModalComponent } from '../components/file-choose-modal/file-choose-modal.component';
import { AssemblyIconModalComponent } from '../components/assembly-icon-modal/assembly-icon-modal.component';
import { ConfiguratorService } from '../services/configurator.service';
@Component({
  selector: 'app-custom-assembly',
  templateUrl: './custom-assembly.component.html',
  styleUrls: ['./custom-assembly.component.scss']
})
export class CustomAssemblyComponent implements OnInit {

  public displayedColumns: string[] = ['sn','image', 'component', 'tag', 'phase','qty', 'uom'];
  public componentDataSource: any;
  @Input() public selectedComponent: any;
  public componentsData: any;
  public componentTableData: any;
  public assemblydata: any;
  public groupName: any;
  constructor( public dialog: MatDialog, private configuratorService: ConfiguratorService) { }

  ngOnInit(): void {
    this.componentsData = [];
    //this.assemblydata = this.configuratorService.getAssemblyData();
    //this.groupName = this.configuratorService.getSelectedGroupName();
  }
  uploadFile() { // Can be moved to right place
    const dialogRef = this.dialog.open(FileChooseModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  

  openAssembly() { // Can be moved to right place
    const dialogRef = this.dialog.open(AssemblyIconModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.selectedComponent && changes.selectedComponent.currentValue){
     this.componentsData.push({...changes.selectedComponent.currentValue, qty: 1});
     this.componentTableData = new MatTableDataSource(this.componentsData);
    }    
}

saveAssembly(){
  console.log(this.componentsData);
}
}
