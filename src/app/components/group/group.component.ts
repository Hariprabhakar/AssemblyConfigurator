import { Component, OnInit } from '@angular/core';
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

  constructor(private configuratorService:  ConfiguratorService) { }

  ngOnInit(): void {
    this.configuratorService.getFamilies().subscribe((res: any) => {
      this.groups = res;
      this.groupList = res;
    })
  }

  public filterCategory() {
    this.groupList = this.groups.filter((category: any) => {
      return category['name'].toLowerCase().indexOf(this.searchValue.toLowerCase()) >= 0;
    });
  }

}
