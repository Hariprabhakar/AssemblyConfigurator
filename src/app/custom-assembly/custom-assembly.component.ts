import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

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
  constructor() { }

  ngOnInit(): void {
    this.componentsData = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.selectedComponent && changes.selectedComponent.currentValue){
     this.componentsData.push(changes.selectedComponent.currentValue);
     this.componentTableData = new MatTableDataSource(this.componentsData);
    }    
}

}
