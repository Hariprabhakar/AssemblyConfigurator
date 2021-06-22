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
  public imag64BitUrl: String;
  public imageObj: any;
  public imageThubList: any;
  public selectedItem: any;
  constructor( public dialog: MatDialog, private configuratorService: ConfiguratorService) {
    this.imag64BitUrl = '';
    this.imageObj = {};
    this.imageThubList = [];
   }

  ngOnInit(): void {
    this.componentsData = [];
  }

  imageSelection(fileName64Bit:any, activeItem:any) {
    this.imag64BitUrl = fileName64Bit;
    this.selectedItem = activeItem;
  }

  
  openFileChooseModal() { // Can be moved to right place
    const fileChoose = this.dialog.open(FileChooseModalComponent, {
      data: this.imageThubList});
    fileChoose.afterClosed().subscribe(result => {
      if (result !== true) {
        const isArray = Array.isArray(result);
        if (isArray && result.length !== 0) {
          this.imageThubList = result;
          this.selectedItem = this.imageThubList[0];
          this.imag64BitUrl = this.imageThubList[0].fileName64Bit;
        } else {
          this.imageThubList = [];
          this.deleteImage(0);
        }
      }
  
    });
  }
  
  deleteImage(index: any) {
    this.imageThubList = this.imageThubList.filter((value:any, key:any) => key !== index);
    if (index != 0) {
      this.selectedItem = this.imageThubList[index-1];
      this.imag64BitUrl = this.imageThubList[index-1].fileName64Bit;
    } else if(this.imageThubList.length === 0) {
      this.selectedItem = this.imageThubList[0];
      // this.imag64BitUrl = this.imageThubList[0].fileName64Bit;
      this.imag64BitUrl = '';
    } else {
      this.selectedItem = this.imageThubList[0];
      this.imag64BitUrl = this.imageThubList[0].fileName64Bit;
    }

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
