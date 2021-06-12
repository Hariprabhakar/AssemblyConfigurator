import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-assembly',
  templateUrl: './custom-assembly.component.html',
  styleUrls: ['./custom-assembly.component.scss']
})
export class CustomAssemblyComponent implements OnInit {

  public displayedColumns: string[] = ['sn','image', 'component', 'tag', 'phase','qty', 'uom'];
  public componentDataSource: any;
  constructor() { }

  ngOnInit(): void {
  }

}
