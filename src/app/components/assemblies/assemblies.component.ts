import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfiguratorService } from 'src/app/services/configurator.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { environment } from 'src/environments/environment';
import { MessageModalComponent } from '../message-modal/message-modal.component';
import { NavigationExtras, Router } from '@angular/router';
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
  public selectedOptions: any;
  public defaultAssemblies = false;
  public customAssemblies = false;
  public showLoader: boolean;
  public ImagesData: any;
  private selectedAssemblyData: any;
  private iconSrc: string = '';
  public baseUrl: string = '';
  @Output() isComponentLoader = new EventEmitter();
  private isDeleteClicked: boolean = false;

  constructor(private configuratorService: ConfiguratorService, private toastService: ToastService,
    public dialog: MatDialog, private router:Router) { }

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
      // on cancel or back select the current assembly in view
      const assemblyId = this.configuratorService.cancelRouteValues.assemblyId;
      if (assemblyId) {
        this.configuratorService.cancelRouteValues.assemblyId = '';
        this.assembliesData.some((assembly: any) => {
          if (assemblyId == assembly.id) {
            this.selectedOptions = [assembly.id];
            const event = {
              option: {
                value: assembly.id
              }
            }
            this.getAssemblyDetails(event)
            return true;
          }
        });
      }
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
    sessionStorage.setItem('selectedAssembly', id);
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
      if(this.isDeleteClicked) {
        this.isDeleteClicked = false;
        if(res.projects && res.projects.length) {
        this.cannotDeleteAssembly(res.projects);
        }  else {
          this.confirmDeleteAssembly(res.id);
        }
      }
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
      if (res.projects && res.projects.length) {
        assemblyType = 'customused';
      } else {
        assemblyType = 'custom';
      }
    }
    sessionStorage.setItem('assemblyType', assemblyType);
  }

  public cannotDeleteAssembly(projects: any) {
    const projectLists = projects.map((project: any) => {
      return  project.name;
    });
    const messageDialog = this.dialog.open(MessageModalComponent, {
      data: {
        title: 'Assembly is used in Projects',
        content: projectLists,
        isFromcomponent: false
      }
    });
  }

  public confirmDeleteAssembly(id: number) {
    const confirmationDialog = this.dialog.open(ConfirmationModalComponent, {
      data: {
        title: 'Delete Assembly',
        content: 'The Assembly will be deleted permanently. Do you want to continue? '
      }
    });
    confirmationDialog.afterClosed().subscribe(result => {
      if (result === true) {
        this.configuratorService.deleteAssembly(id).subscribe(() => {
          this.getAssemblies();
          this.toastService.openSnackBar('Assembly deleted successfully', 'success', 'success-snackbar');
        },
        (error: any) => {
          this.toastService.openSnackBar(error);
        });
      }
    });
  }

  public deleteAssembly(id: number) {
    this.isDeleteClicked = true;
    if(this.selectedAssemblyData && id === this.selectedAssemblyData.id) {      
        this.isDeleteClicked = false;
        if(this.selectedAssemblyData.projects && this.selectedAssemblyData.projects.length) {
        this.cannotDeleteAssembly(this.selectedAssemblyData.projects);
        }  else {
          this.confirmDeleteAssembly(this.selectedAssemblyData.id);
        }
    }
   }

   public duplicateAssembly(id: number){
    const navigationExtras: NavigationExtras = {
      queryParams: {
        edit: true,
        copy: true,
        id: id
      }
    }
    this.router.navigate(['/create-assembly'], navigationExtras);
   }
  
}
