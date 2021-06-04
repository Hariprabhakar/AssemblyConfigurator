import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ConfiguratorService } from 'src/app/services/configurator.service';

@Component({
  selector: 'app-assemblies',
  templateUrl: './assemblies.component.html',
  styleUrls: ['./assemblies.component.scss']
})
export class AssembliesComponent implements OnInit {
  @Input() groupId: number;
  public familyId: any = 1;
  public companyId: any = 1;
  public searchValue: any;

  public assembliesData: any[] = [];
  public assembliesOriginalData: any = [];

  public defaultAssemblies = false;
  public customAssemblies = false;
  public showLoader: boolean;
  public ImagesData: any;

  constructor( private configuratorService: ConfiguratorService ) { }

  ngOnInit(): void {
  
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.groupId && changes.groupId.currentValue){
      if(changes.groupId.currentValue['name'] === 'Custom Assemblies') {
        this.customAssemblies = true;
      } else {
        this.customAssemblies = false;
      }
      this.familyId = changes.groupId.currentValue.id;
      this.getAssemblies();
    }    
}

  getAssemblies() {
    this.showLoader = true;
    this.configuratorService.getAssemblies(this.companyId, this.familyId, this.defaultAssemblies, this.customAssemblies).subscribe(res => {
      this.assembliesOriginalData = res;
      this.assembliesData = [...this.assembliesOriginalData];
      this.showLoader = false;
      this.getImages();
    })
  }

  getImages() {
    this.configuratorService.getImages(this.companyId, this.familyId, this.defaultAssemblies, this.customAssemblies).subscribe((res: any) => {
      this.ImagesData = res;

      const ImageData = this.ImagesData.filter((img: any) => img.icon !== undefined)
      ImageData.map((img: any) => (img.icon) = 'data:image/jpeg;base64,' + img.icon)

      this.assembliesData = this.assembliesData.map((item, i) => Object.assign({}, item, ImageData[i]));

    })
  }

  filterAssembly(event: any){
    this.assembliesData = this.assembliesOriginalData.filter((category: any) => {
      return category['name'].toLowerCase().indexOf(this.searchValue.toLowerCase()) >= 0;
    });
  }


  public toggleHide(event: any){
    this.defaultAssemblies = event.checked;
    this.getAssemblies();
  }



}
