import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfiguratorService } from 'src/app/services/configurator.service';



const ELEMENT_DATA: any = [
  {image: '', asslemblyName: 'Tims Assembly 1', group: 'In-wall Devices', system: 'power', connectionType: 'MC Cable', latestUpdate: '2/9/21 9.43pm', id: 1},
  {image: '', asslemblyName: 'Tims Assembly 2', group: 'In-wall Devices', system: 'power', connectionType: 'MC Cable', latestUpdate: '2/9/21 9.43pm', id: 2},
  {image: '', asslemblyName: 'Tims Assembly 3', group: 'In-wall Devices', system: 'power', connectionType: 'MC Cable', latestUpdate: '2/9/21 9.43pm', id: 3},
  {image: '', asslemblyName: 'Tims Assembly 4', group: 'In-wall Devices', system: 'Lightening', connectionType: 'MC Cable', latestUpdate: '2/9/21 9.43pm', id: 4},
  {image: '', asslemblyName: 'Tims Assembly 5', group: 'In-wall Devices', system: 'power', connectionType: 'MC Cable', latestUpdate: '2/9/21 9.43pm', id: 5},
  {image: '', asslemblyName: 'Tims Assembly 6', group: 'In-wall Devices', system: 'power', connectionType: 'MC Cable', latestUpdate: '2/9/21 9.43pm', id: 6},
  {image: '', asslemblyName: 'Tims Assembly 7', group: 'Junction Box', system: 'power', connectionType: 'MC Cable', latestUpdate: '2/9/21 9.43pm', id: 7}
];

@Component({
  selector: 'app-create-template-modal',
  templateUrl: './create-template-modal.component.html',
  styleUrls: ['./create-template-modal.component.scss']
})
export class CreateTemplateModalComponent implements OnInit {

  public displayedColumns: string[] = [ 'image', 'asslemblyName', 'group', 'system', 'connectionType', 'latestUpdate'];
  public dataSource = new MatTableDataSource<any>(ELEMENT_DATA);
  public dataSourceDuplicate = ELEMENT_DATA;
  public selection = new SelectionModel<any>(true, []);
  public groups: any[];
  public sortOptions = ['Latest', 'Oldest']
  public totalAssemblies: number;
  public templateName: string;
  public selectedGroup: string;
  public selectedSort: string;

  constructor(public dialogRef: MatDialogRef<CreateTemplateModalComponent>,private configuratorService: ConfiguratorService) { }

  ngOnInit(): void {
    this.totalAssemblies = ELEMENT_DATA.length;
    this.groups = this.configuratorService.getGroups();
    this.groups.unshift({id:0, name:'All'});
    this.selectedGroup = this.groups[0].name;
    this.selectedSort = this.sortOptions[0];
  }
 



  public isAllSelected() {
    console.log(this.selection);
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  public masterToggle() {
     console.log(this.selection);
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  public selectRow(row: any) {
    this.selection.toggle(row);
    console.log(this.selection.selected);
  }

  public close() {
    this.dialogRef.close();
  }

  public create(){
    const req = {
      templateName: this.templateName,
      assemblies: [this.selection.selected.map((ele: any) => {
        return ele.id
      })]
    }
    console.log(req);
    // this.configuratorService.createTemplate(req).subscribe((res)=>{

    // },
    // (err: any) => {

    // });
    this.dialogRef.close(true);
  }

  public filterComponent(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public ongroupChange(value: string){
    let data: any;
    if(value !== 'All') {
      data = this.dataSourceDuplicate.filter((ele: any)=>{
        return ele.group.toLowerCase() === value.trim().toLowerCase();
      });
    } else {
      data = this.dataSourceDuplicate;
    }
    
    this.dataSource = new MatTableDataSource<any>(data);
  }

  public validate(){
    return !this.templateName || this.selection.selected.length <= 0;
  }

  public onSortChange(value: any){
    console.log(value);
  }

}
