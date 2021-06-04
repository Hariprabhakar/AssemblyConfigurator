import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfiguratorService } from 'src/app/services/configurator.service';

@Component({
  selector: 'app-category-components',
  templateUrl: './category-components.component.html',
  styleUrls: ['./category-components.component.scss']
})
export class CategoryComponentsComponent implements OnInit {
   @Input() public categoryValue: number;
  public displayedColumns: string[] = ['image', 'component', 'tag', 'phase', 'udm', 'add'];
  public componentDataSource: any;
  
  constructor(private configuratorService: ConfiguratorService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.categoryValue && changes.categoryValue.currentValue){
      const id = changes.categoryValue.currentValue.id;
      this.configuratorService.getComponents(this.configuratorService.companyId, id).subscribe((res: any) => {
        this.componentDataSource = new MatTableDataSource(res);
      });
    }    
}

  filterComponent(event: any){
    const filterValue = (event.target as HTMLInputElement).value;
    this.componentDataSource.filter = filterValue.trim().toLowerCase();    
  }

}
