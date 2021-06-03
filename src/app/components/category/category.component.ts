import { Component, OnInit, ViewChild } from '@angular/core';
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

  constructor(private configuratorService: ConfiguratorService) { }

  ngOnInit(): void {
    this.showLoader = true;
    this.configuratorService.getCategories().subscribe((res) => {
      this.categories = res;
      this.categoryList = res;
      this.showLoader = false;
    })
  }

  public filterCategory() {
    this.categoryList = this.categories.filter((category: { name: (string | undefined)[]; }) => {
      return category.name.indexOf(this.searchValue) >= 0;
    });
  }

}
