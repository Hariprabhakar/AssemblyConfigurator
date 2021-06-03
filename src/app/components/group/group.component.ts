import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { ConfiguratorService } from 'src/app/services/configurator.service';


@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  private groups: any;
  public groupList: any;
  public searchValue: any;
  @Output() groupChanged = new EventEmitter();
  @ViewChild(MatSelectionList) selectedGroup: MatSelectionList;
  public showLoader: boolean;
  constructor(private configuratorService:  ConfiguratorService) { }

  ngOnInit(): void {
    this.showLoader = true;
    this.configuratorService.getFamilies().subscribe((res: any) => {
      this.groups = [...res, {id: null, name: 'Custom Assemblies'} ];
      this.groupList = [...this.groups];
      this.showLoader = false;
      this.selectedGroup.selectionChange.subscribe((grp: MatSelectionListChange) => {          
        
        this.selectedGroup.deselectAll();
        grp.option.selected = true;
        this.groupChanged.emit(grp.option.value);
    });
    })

    
  }

  public filterCategory() {
    this.groupList = this.groups.filter((category: any) => {
      return category['name'].toLowerCase().indexOf(this.searchValue.toLowerCase()) >= 0;
    });
  }

}
