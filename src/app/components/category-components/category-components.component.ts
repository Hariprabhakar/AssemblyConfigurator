import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfiguratorService } from 'src/app/services/configurator.service';

@Component({
  selector: 'app-category-components',
  templateUrl: './category-components.component.html',
  styleUrls: ['./category-components.component.scss']
})
export class CategoryComponentsComponent implements OnInit {

  displayedColumns: string[] = ['image', 'component', 'tag', 'phase', 'udm', 'add'];
  componentDataSource: any;
  constructor(private configuratorService: ConfiguratorService) { }

  ngOnInit(): void {
    this.configuratorService.getComponents().subscribe((res: any) => {
      this.componentDataSource = new MatTableDataSource(res);
    });
  }

  filterComponent(event: any){
    const filterValue = (event.target as HTMLInputElement).value;
    this.componentDataSource.filter = filterValue.trim().toLowerCase();    
  }

}
