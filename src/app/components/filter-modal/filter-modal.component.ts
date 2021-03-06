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
  public selectedFilter: FilterModel = { filters: [] };
  public preSelectedFilter: FilterModel;
  private element: any;
  public filterValue: any;
  public showLoader: boolean;
  public isReset: boolean = false;
  constructor(
    public dialModalRef: MatDialogRef<FilterModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private configuratorService: ConfiguratorService,
    private toastService: ToastService
  ) {
    dialModalRef.disableClose = true;
  }

  ngOnInit(): void {
    this.showLoader = true;
    let width = window.innerWidth / 2 + 10;
    this.dialModalRef.updatePosition({ right: width + 'px' });
    this.preSelectedFilter = this.data.filters;
    if (this.data.filters) {
      this.selectedFilter = this.data.filters;
    }

    let categoryId = this.data.categoryId.id;
    this.configuratorService.getComponentFilters(categoryId).subscribe(
      (response: any) => {
        if (response) {

          response.filters.forEach((element: any) => {
            element.values = element.values.map((value: any) => value.trim())
            element.values.sort(this.sortAlpheNumeric);
           element.values = [...new Set(element.values)]; 
          });
          this.filterValue = response;
          this.showLoader = false;
        }
      },
      (error: any) => {
        this.toastService.openSnackBar(error);
        this.showLoader = false;
      }
    );
  }

  public sortAlpheNumeric = (a: any, b: any) => {
    return a.toString().trim().localeCompare(b.toString().trim(), 'en', { numeric: true })
  };

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
              if (ele.values.length == 0) {
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
  }

  private addFilterValue(name: any, value: any) {
    const tempVal = {
      name: name,
      values: [value]
    };
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
      });
    }
    if (this.selectedFilter.filters.length > 0) {
      this.isReset = true;
    }
    this.selectedFilter.filters = [];
  }

  public checkSelected(name: string, value: string) {
    let checked: boolean = false;
    if (this.selectedFilter) {
      checked = this.selectedFilter.filters.some((filter) => {
        if (filter.name == name) {
          return filter.values?.includes(value);
        }
      });
    }
    return checked;
  }

  public getFilterBadgeCount(filterName: string, values: any) {
    let count = 0;
    this.selectedFilter.filters.some((filter) => {
      if (filter.name == filterName) {
        count = filter.values ? filter.values.length : 0;
        return true;
      }
    });
    return count;
    
    // values.forEach(element => {
      
    // });
  }

}

