import { Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfiguratorService } from 'src/app/services/configurator.service';
import { ToastService } from 'src/app/shared/services/toast.service';

export interface FilterField {
  name?: string;
  values?: string[];
}

export interface FilterModel {
  filters: FilterField[];
}
@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss']
})
export class FilterModalComponent implements OnInit {

  public myModel = true;
  @ViewChildren('linkRef') linkRefs: QueryList<any> | undefined;
  public selectedFilter: FilterModel = { "filters": [] };
  public preSelectedFilter: FilterModel;
  private element: any;
  public filterValue = {
    "filters": [
      {
        "name": "Select Type",
        "values": ["Type a", "Type b"]
      },
      {
        "name": "Select Size",
        "values": ["Size a", "Size b"]
      },
      {
        "name": "Select Material",
        "values": ["Material a", "Material b"]
      },
      {
        "name": "other filter",
        "values": ["value 1", "value 2", "value 3", "value 4", "value 5", "value 6", "value 7", "value 8", "value 9", "value 10", "value 11", "value 12"]
      }
    ]
  }
  constructor(public dialModalRef: MatDialogRef<FilterModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private configuratorService: ConfiguratorService, private toastService: ToastService) {
    dialModalRef.disableClose = true;
  }

  ngOnInit(): void {
    let width = window.innerWidth / 2 + 10;
    this.dialModalRef.updatePosition({ right: width + 'px' });
    this.preSelectedFilter = this.data.filters;
    if (this.data.filters) {
      this.selectedFilter = this.data.filters;
    }
    
    let categoryId = this.data.categoryId.id;
    this.configuratorService.getComponentFilters(categoryId).subscribe((response: any) => {
      if (response) {
        this.filterValue = response;
      }
    },
      (error: any) => {
        this.toastService.openSnackBar(error);
      });

  }

  public list_change(event: any, name: any, value: any) {
    if (this.selectedFilter.filters.length === 0) {
      this.addFilterValue(name, value);
    } else {
      const isNameFound = this.selectedFilter.filters.some((ele: any, index: any) => {
        if (ele.name == name) {
          if (event.checked) {
            ele.values.push(value);
          } else {
            const valIndex = ele.values.findIndex((eleValue: any) => {
              return eleValue == value;
            });
            if (valIndex >= 0) {
              ele.values.splice(valIndex, 1);
              if(ele.values.length == 0){
                this.selectedFilter.filters.splice(index, 1);
              }
            }
          }
          return true;
        }
      });
      if (!isNameFound) {
        this.addFilterValue(name, value);
      }
    }
    console.log(this.selectedFilter.filters);
    
  }

  private addFilterValue(name: any, value: any) {
    const tempVal = {
      'name': name,
      'values': [value]
    }
    this.selectedFilter.filters.push(tempVal);
  }


  public close() {
    this.dialModalRef.close();
  }

  public applyFilter() {
    this.dialModalRef.close(this.selectedFilter);
  }

  public reset() {
    if (this.linkRefs) {
      let myCheckboxes = this.linkRefs.toArray();
      myCheckboxes.forEach((checkbox: any) => {
        checkbox._checked = false;
      })
    }
    this.selectedFilter.filters = [];

  }

  public checkSelected(name: string, value: string){
    let checked: boolean = false;
    if(this.selectedFilter){
      checked = this.selectedFilter.filters.some((filter)=>{
        if(filter.name == name){
         return filter.values?.includes(value);
        }
      });
    }
    return checked;
  }

}
