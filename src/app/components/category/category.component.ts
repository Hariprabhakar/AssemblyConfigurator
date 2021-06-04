import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { ConfiguratorService } from '../../services/configurator.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  private categories: any;
  public categoryList: any;
  public searchValue: any;
  public showLoader: boolean;
  @Output() categoryChanged = new EventEmitter();
  @ViewChild(MatSelectionList) selectedCategory: MatSelectionList;

  constructor(private configuratorService: ConfiguratorService) { }

  ngOnInit(): void {
    this.showLoader = true;
    this.configuratorService.getCategories().subscribe((res) => {
      this.categories = res;
      this.categoryList = res;
      this.showLoader = false;
      this.selectedCategory.selectionChange.subscribe((grp: MatSelectionListChange) => {          
        
        this.selectedCategory.deselectAll();
        grp.option.selected = true;
        this.categoryChanged.emit(grp.option.value);
    });
    })
  }

  public filterCategory() {
    this.categoryList = this.categories.filter((category: { name: (string | undefined)[]; }) => {
      return category.name.indexOf(this.searchValue) >= 0;
    });
  }

}
