import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfiguratorService } from 'src/app/services/configurator.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-assemblies',
  templateUrl: './assemblies.component.html',
  styleUrls: ['./assemblies.component.scss']
})
export class AssembliesComponent implements OnInit {
  @Input() groupId: number;
  @Output() assemblyDetails = new EventEmitter();
  public familyId: any;
  public companyId: any;
  public searchValue: any;

  public assembliesData: any[] = [];
  public assembliesOriginalData: any = [];

  public defaultAssemblies = false;
  public customAssemblies = false;
  public showLoader: boolean;
  public ImagesData: any;
  private selectedAssemblyData: any;
  private iconSrc: string = '';
  public baseUrl: string = '';
  @Output() isComponentLoader = new EventEmitter();

  constructor(private configuratorService: ConfiguratorService, private toastService: ToastService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.companyId = this.configuratorService.companyId;
    this.baseUrl = environment.url;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.groupId && changes.groupId.currentValue) {
      if (changes.groupId.currentValue['name'] === 'Custom Assemblies') {
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
      // this.getImages();
    },
      (error: any) => {
        this.toastService.openSnackBar(error);
        this.showLoader = false;
      }
    );
  }

  getImages() {
    this.configuratorService.getImages(this.companyId, this.familyId, this.defaultAssemblies, this.customAssemblies).subscribe((res: any) => {
      this.ImagesData = res;

      const ImageData = this.ImagesData.filter((img: any) => img.icon !== undefined)
      ImageData.map((img: any) => (img.icon) = 'data:image/jpeg;base64,' + img.icon)

      this.assembliesData = this.assembliesData.map((item, i) => Object.assign({}, item, ImageData[i]));

    },
      (error: any) => {
        this.toastService.openSnackBar(error);
      }
    );
  }

  filterAssembly(event: any) {
    this.assembliesData = this.assembliesOriginalData.filter((category: any) => {
      if(category['name'].toLowerCase().indexOf(this.searchValue.toLowerCase()) >= 0) {
        return true;
      } else if (category['abbreviation'] && category['abbreviation'].toLowerCase().indexOf(this.searchValue.toLowerCase()) >= 0) {
        return true;
      } else {
        return false;
      }
    });
  }


  public toggleHide(event: any) {
    this.defaultAssemblies = event.checked;
    this.getAssemblies();
  }

  /** Function to invoke Assembly Details by Id
   * @memberOf AssembliesComponent
   */
  public getAssemblyDetails(event:any) {
    this.isComponentLoader.emit(true);
    let id = event.option.value;
    if (event.option.value) {
      this.configuratorService.getAssemblyComponent(id).subscribe(res => {
        const assemblyInfo = res;
        this.selectedAssemblyData = {...res};
        this.assembliesOriginalData.forEach((assembly: any) => {
          if(assembly.id === id){
            if(assembly.icon){
              this.iconSrc = assembly.icon;
            } else {
              this.iconSrc = '';
            }
          }
        });
        this.getAssemblyById(id);
      },
        (error: any) => {
          this.toastService.openSnackBar(error);
          this.isComponentLoader.emit(false);
        }
      );
    } else {
      console.log('Some thing went wrong');
    }

  }

  public getAssemblyById(id: number) {
    this.configuratorService.getAssemblyById(id).subscribe((res: any) => {
      const groupName = this.configuratorService.getGroupNameById(res.familyId);
      this.selectedAssemblyData = {...this.selectedAssemblyData, ...res, groupName, icon:this.iconSrc};
      this.assemblyDetails.emit(this.selectedAssemblyData);
      this.isComponentLoader.emit(false);
      this.setAssemblyType(res);
    },
    (error: any) => {
      this.toastService.openSnackBar(error);
      this.isComponentLoader.emit(false);
    });
  }

  private setAssemblyType(res: any){
    let assemblyType: string;
    if(!res.companyId) {
      assemblyType = 'default';
    } else {
      if (res.used && res.used.length) {
        assemblyType = 'customused';
      } else {
        assemblyType = 'custom';
      }
    }
    sessionStorage.setItem('assemblyType', assemblyType);
  }

  public deleteAssembly(id: number) {
    const confirmationDialog = this.dialog.open(ConfirmationModalComponent, {
      data: {
        title: 'Delete Assembly',
        content: 'Should we delete this Assembly? '
      }
    });
    confirmationDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.configuratorService.deleteAssembly(id).subscribe(() => {
          this.getAssemblies();
        },
        (error: any) => {
          this.toastService.openSnackBar(error);
        });
      }
    });
  }

  
}
