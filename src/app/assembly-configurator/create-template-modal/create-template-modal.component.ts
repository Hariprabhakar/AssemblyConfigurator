import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ConfiguratorService } from 'src/app/services/configurator.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { environment } from 'src/environments/environment';



// const ELEMENT_DATA: any = [
//   {image: '', asslemblyName: 'Tims Assembly 1', group: 'In-wall Devices', system: 'power', connectionType: 'MC Cable', latestUpdate: '2/9/21 9.43pm', id: 1},
//   {image: '', asslemblyName: 'Tims Assembly 2', group: 'In-wall Devices', system: 'power', connectionType: 'MC Cable', latestUpdate: '2/9/21 9.43pm', id: 2},
//   {image: '', asslemblyName: 'Tims Assembly 3', group: 'In-wall Devices', system: 'power', connectionType: 'MC Cable', latestUpdate: '2/9/21 9.43pm', id: 3},
//   {image: '', asslemblyName: 'Tims Assembly 4', group: 'In-wall Devices', system: 'Lightening', connectionType: 'MC Cable', latestUpdate: '2/9/21 9.43pm', id: 4},
//   {image: '', asslemblyName: 'Tims Assembly 5', group: 'In-wall Devices', system: 'power', connectionType: 'MC Cable', latestUpdate: '2/9/21 9.43pm', id: 5},
//   {image: '', asslemblyName: 'Tims Assembly 6', group: 'In-wall Devices', system: 'power', connectionType: 'MC Cable', latestUpdate: '2/9/21 9.43pm', id: 6},
//   {image: '', asslemblyName: 'Tims Assembly 7', group: 'Junction Box', system: 'power', connectionType: 'MC Cable', latestUpdate: '2/9/21 9.43pm', id: 7}
// ];

const ELEMENT_DATA: any = [
  {
      "id": 430,
      "name": "3-Way Rigid Trapeze Brace with Beam Clamp",
      "familyId": 1,
      "familyName": "Conduit Raceway",
      "companyId": 1,
      "iconLocation": "assets/img/SVG_electrical_symbol/3RTB-1.svg",
      "systems": "",
      "connectionTypes": ""
  },
  {
      "id": 463,
      "name": "4-Way Cable BSH Pipe",
      "familyId": 1,
      "familyName": "Conduit Raceway",
      "companyId": 1,
      "iconLocation": "assets/img/SVG_electrical_symbol/4CBP-2.svg",
      "systems": "",
      "connectionTypes": ""
  },
  {
      "id": 464,
      "name": "4-Way Cable BSH Pipe with Beam Clamp",
      "familyId": 1,
      "familyName": "Conduit Raceway",
      "companyId": 1,
      "iconLocation": "assets/img/SVG_electrical_symbol/4CBP-1.svg",
      "systems": "",
      "connectionTypes": ""
  },
  {
      "id": 465,
      "name": "4-Way T-Cable Brace",
      "familyId": 1,
      "familyName": "Conduit Raceway",
      "companyId": 1,
      "iconLocation": "assets/img/SVG_electrical_symbol/4TCB-2.svg",
      "systems": "",
      "connectionTypes": ""
  },
  {
      "id": 466,
      "name": "4-Way T-Cable Brace with Beam Clamp",
      "familyId": 1,
      "familyName": "Conduit Raceway",
      "companyId": 1,
      "iconLocation": "assets/img/SVG_electrical_symbol/4TCB-1.svg",
      "systems": "",
      "connectionTypes": ""
  },
  {
      "id": 10027,
      "name": "SLAMX",
      "abbreviation": "SLA",
      "familyId": 1,
      "familyName": "Conduit Raceway",
      "companyId": 1,
      "systems": "",
      "connectionTypes": "",
      "updatedDate": "2021-09-13T06:16:19.846419"
  },
  {
      "id": 10014,
      "name": "asd",
      "abbreviation": "asad",
      "familyId": 1,
      "familyName": "Conduit Raceway",
      "companyId": 1,
      "systems": "",
      "connectionTypes": "",
      "updatedDate": "2021-09-06T04:11:43.021026"
  }
]

@Component({
  selector: 'app-create-template-modal',
  templateUrl: './create-template-modal.component.html',
  styleUrls: ['./create-template-modal.component.scss']
})
export class CreateTemplateModalComponent implements OnInit {

  public displayedColumns: string[] = [ 'image', 'asslemblyName', 'group', 'system', 'connectionType', 'latestUpdate'];
  public dataSource: any = new MatTableDataSource<any>(ELEMENT_DATA);
  public dataSourceDuplicate = ELEMENT_DATA;
  public selection = new SelectionModel<any>(true, []);
  public groups: any[];
  public sortOptions = ['Latest', 'Oldest']
  public totalAssemblies: number;
  public templateName: string;
  public selectedGroup: string;
  public selectedSort: string;
  public baseUrl: string = '';
  public showLoader: boolean = false;

  constructor(public dialogRef: MatDialogRef<CreateTemplateModalComponent>, private configuratorService: ConfiguratorService,
    private toastService: ToastService) { }

  ngOnInit(): void {
    this.totalAssemblies = ELEMENT_DATA.length;
    this.groups = this.configuratorService.getGroups();
    this.groups.unshift({id:0, name:'All'});
    this.selectedGroup = this.groups[0].name;
    this.selectedSort = this.sortOptions[0];
    this.baseUrl = environment.url;
    this.getAssemblies();
  }
 
private getAssemblies() {
  this.showLoader = true;
  this.configuratorService.getAssemblies(this.configuratorService.companyId, 0, false, true).subscribe((res: any) => {
    this.dataSource = new MatTableDataSource<any>(res);
    this.dataSourceDuplicate = res;
    this.showLoader = false;
  },
    (error: any) => {
      this.toastService.openSnackBar(error);
      this.showLoader = false;
    }
  );
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
        this.dataSource.data.forEach((row: any) => this.selection.select(row));
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
      companyId: this.configuratorService.companyId,
      assemblyIds: [this.selection.selected.map((ele: any) => {
        return ele.id
      })]
    }
    this.showLoader = true;
    console.log(req);
    this.configuratorService.createTemplate(req).subscribe((res)=>{
      this.showLoader = false;
      this.dialogRef.close(true);
    },
    (err: any) => {
      this.showLoader = false;
      this.toastService.openSnackBar(err);
    });
    
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
    this.dataSourceDuplicate.sort((data1: any, data2: any)=>{
      var key1 = new Date(data1.updatedDate);
      var key2 = new Date(data2.updatedDate);
      // equal items sort equally
      if (key1 === key2) {
        return 0;
      }
      // nulls sort after anything else
      else if (!data1.updatedDate) {
        return 1;
      }
      else if (!data2.updatedDate) {
        return -1;
      }
      // otherwise, if we're ascending, lowest sorts first
      else if (value === 'Latest') {
        return key1 < key2 ? 1 : -1;
      }
      // if descending, highest sorts first
      else {
        return key1 < key2 ? -1 : 1;
      }

    });
    this.dataSource = new MatTableDataSource<any>(this.dataSourceDuplicate);
  }

}
