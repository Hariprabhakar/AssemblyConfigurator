import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Pipe, SimpleChanges, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FileChooseModalComponent } from '../components/file-choose-modal/file-choose-modal.component';
import { AssemblyIconModalComponent } from '../components/assembly-icon-modal/assembly-icon-modal.component';
import { AssemblyZoomImageModalComponent } from '../components/assembly-zoom-image-modal/assembly-zoom-image-modal.component';
import { ConfiguratorService } from '../services/configurator.service';
import { JunctionboxModalComponent } from '../components/junctionbox-modal/junctionbox-modal.component';
import { Subscription } from 'rxjs';
import { ToastService } from '../shared/services/toast.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ConfirmationModalComponent } from '../components/confirmation-modal/confirmation-modal.component';
import { elementAt } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageModalComponent } from '../components/message-modal/message-modal.component';
import { SessionService } from '../shared/services/session.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {jsPDF} from 'jspdf';


export interface SaveAssemblyData {
  id: string;
  name: string;
  familyId: string;
  familyName: string;
  icon: string;
  images: Array<any>;
  components: Array<any>;
  abbreviation?: string;
  companyId?: string;
}
@Component({
  selector: 'app-custom-assembly',
  templateUrl: './custom-assembly.component.html',
  styleUrls: ['./custom-assembly.component.scss']
})
export class CustomAssemblyComponent implements OnInit, OnDestroy {
  public displayedColumns: string[] = ['sn', 'image', 'component', 'tag', 'phase', 'qty', 'uom'];
  public componentDataSource: any;
  @Input() public selectedComponent: any;
  @Input() public assemblyDetailsReadOnly: any;
  @Input() public showLoader: boolean;
  public componentsData: any;
  public componentTableData: any;
  public assemblydata: any;
  public groupName: any;
  public abbreviation: any;
  public imag64BitUrl: any;
  public imageObj: any;
  public imageThubList: any;
  public selectedItem: any;
  public iconSrc: any;
  public selectedConnections: string[] = [];
  public selectedSystem: string[] = [];
  private assemblysubscription: Subscription;
  private groupsubscription: Subscription;
  private componentObj: any = [];
  public saveLoader: boolean = false;
  public isEdit: boolean = false;
  public paramId: number = 0;
  public assemblyType: string | null;
  public isCopyAssembly: boolean = false;
  public baseUrl: string = '';
  public disableBtn: boolean = false;
  public downloadedImg: any;
  public initialLoad: boolean = true;
  public enableEdit: boolean = false;
  public duplicateAssembly: boolean = false;
  public originalIconSrc: any;
  public gridViewFlag: boolean = false;
  @Output() removedComponent = new EventEmitter();
  @ViewChild('table') table: MatTable<any>;
  @ViewChild('table',{read: ElementRef}) pdfTable: ElementRef;
  private saveAssemblyData: SaveAssemblyData = {
    id: '',
    name: '',
    familyId: '',
    familyName: '',
    icon: '',
    images: [],
    components: [],
    companyId: ''
  };
  constructor(
    public dialog: MatDialog,
    private configuratorService: ConfiguratorService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private sessionService: SessionService
  ) {
    this.imag64BitUrl = '';
    this.imageObj = [];

    this.imageThubList = [];
  }

  ngOnInit(): void {
    this.baseUrl = environment.url;
    this.componentsData = [];
    this.configuratorService.junctionBoxComponents = [];
    this.groupName = '';
    this.abbreviation = '';
    this.assemblydata = {};
    this.iconSrc = '';
    this.initialLoad = true;
    if (!this.assemblyDetailsReadOnly) {
      this.assemblysubscription = this.configuratorService.currentAssemblyValue.subscribe((data: any) => {
        this.assemblydata = data;
        if (data.iconLocation) {
          if (this.initialLoad) {
            // this.getBase64Image(this.baseUrl + data.iconLocation, (data: any) => {
            //   this.iconSrc = data;
            //   this.originalIconSrc = data;
            // })
            this.converBase64FromUrl(data.iconLocation).then((result: any) => {
              this.iconSrc = this.sanitizer.bypassSecurityTrustResourceUrl(result);
              this.originalIconSrc = this.sanitizer.bypassSecurityTrustResourceUrl(result);
            });
            this.initialLoad = false;
          }
        }
      });
      this.groupsubscription = this.configuratorService.groupNameObservable.subscribe((groupName: any) => {
        this.groupName = groupName;
      });
    }

    this.route.queryParams.subscribe((params) => {
      this.isEdit = params.edit;
      this.duplicateAssembly = params.copy;
      this.paramId = params.id;
      if (this.paramId) {
        this.getAssemblyData();
      }
    });
    if (this.isEdit) {
      this.assemblyType = sessionStorage.getItem('assemblyType');
      if (this.assemblyType && this.assemblyType === 'custom') {
        this.isCopyAssembly = false;
      } else {
        this.isCopyAssembly = true;
      }
    }
  }

  /**
   * Function on edit assembly flow
   */
  public getAssemblyData() {
    const id = this.paramId;
    this.configuratorService.getAssemblyComponent(id).subscribe(
      (res: any) => {
        const assemblyInfo = res;
        //this.iconSrc = res.icon ? 'data:image/jpeg;base64,'+res.icon: '';
        if (res.components) {
          console.log('COMPONENTS', res);
          this.componentsData = res.components;
          this.componentTableData = new MatTableDataSource(this.componentsData);
          this.selectedConnections = this.getUniqueSystemConnection('connectionTypes');
          this.selectedSystem = this.getUniqueSystemConnection('systems');
          this.configuratorService.junctionBoxComponents = res.components.map((component: any) => {
            return component.id;
          });
        }
        const images = res.images;
        this.imageThubList = [];
        if (images && images.length !== 0) {
          images.forEach((image: any, idx: number) => {
            // this.converBase64FromUrl(image.imageLocation)
            //   .then((result: any) => {
            //     let imgCopy = {
            //       // fileName64Bit: 'data:image/jpeg;base64,'+image.image,
            //       fileName64Bit: this.sanitizer.bypassSecurityTrustResourceUrl(result),
            //       isPrimary: image.isPrimary,
            //       inputText: image.name || ''
            //     }
            //     this.imageThubList.push(imgCopy);
            //     if(image.isPrimary){
            //       this.selectedItem = this.imageThubList[idx];
            //       // this.imag64BitUrl ='data:image/jpeg;base64,'+image.image;
            //       this.imag64BitUrl = this.sanitizer.bypassSecurityTrustResourceUrl(result);
            //     }
            //   });
            this.getBase64Image(this.baseUrl + image.imageLocation, (result: any) => {
              let imgCopy = {
                // fileName64Bit: 'data:image/jpeg;base64,'+image.image,
                fileName64Bit: result,
                isPrimary: image.isPrimary,
                inputText: image.name || ''
              };
              this.imageThubList.push(imgCopy);
              if (image.isPrimary) {
                this.selectedItem = this.imageThubList[idx];
                // this.imag64BitUrl ='data:image/jpeg;base64,'+image.image;
                this.imag64BitUrl = result;
              }
            });
          });

          // images.forEach((image: any, idx: number) => {
          //   let imgCopy = {
          //     // fileName64Bit: 'data:image/jpeg;base64,'+image.image,
          //     fileName64Bit: this.baseUrl + image.imageLocation,
          //     isPrimary: image.isPrimary,
          //     inputText: image.name || ''
          //   }
          //   this.imageThubList.push(imgCopy);
          //   if(image.isPrimary){
          //     this.selectedItem = this.imageThubList[idx];
          //     // this.imag64BitUrl ='data:image/jpeg;base64,'+image.image;
          //     this.imag64BitUrl = this.baseUrl + image.imageLocation;
          //   }
          // });
        } else {
          this.imag64BitUrl = '';
        }
      },
      (error: any) => {
        this.toastService.openSnackBar(error);
      }
    );
  }

  imageSelection(fileName64Bit: any, activeItem: any) {
    this.imag64BitUrl = fileName64Bit;
    this.selectedItem = activeItem;
  }

  openFileChooseModal() {
    // Can be moved to right place
    const fileChoose = this.dialog.open(FileChooseModalComponent, { panelClass: 'filechoose', data: this.imageThubList });
    fileChoose.afterClosed().subscribe((result) => {
      if (result !== true) {
        const isArray = Array.isArray(result);
        if (isArray && result.length !== 0) {
          this.imageThubList = result;
          this.selectedItem = this.imageThubList[0];
          this.imag64BitUrl = this.imageThubList[0].fileName64Bit;
          this.createImageObj(result);
        } else {
          this.imageThubList = [];
          this.deleteImage(0);
        }
      }

      // if (Object.keys(result).length !== 0) {
      //   if (Object.keys(this.imageObj).length !== 0) {
      //     this.imageObj.inputText = result.inputText;
      //     this.imageObj.imageList.push(result.imageList[0]);
      //   } else {
      //     this.imageObj = result;
      //   }

      //   const firstImage = this.imageObj.imageList.filter((image:any) => image.id == 1);
      //   this.imag64BitUrl = firstImage[0].fileName;
      //   const thumbImage = this.imageObj.imageList.filter((image:any) => image.id != 1);
      //   if (thumbImage.length !== 0) {
      //     this.imageThubList = thumbImage;
      //   }

      //   console.log('this.imageList', this.imageObj);
      // }
    });
  }

  public createImageObj(obj: any) {
    this.imageObj = [];
    obj.forEach((imgData: any) => {
      if (imgData.fileName64Bit.changingThisBreaksApplicationSecurity) {
        imgData.fileName64Bit = imgData.fileName64Bit.changingThisBreaksApplicationSecurity;
      }
      const imgBase64 = this.removeString(imgData.fileName64Bit);

      const img = {
        name: imgData.inputText || '',
        image: imgBase64,
        isPrimary: imgData.isPrimary || imgData.isDefault || false
      };
      this.imageObj.push(img);
    });
  }

  deleteImage(index: any) {
    this.imageThubList = this.imageThubList.filter((value: any, key: any) => key !== index);
    if (index != 0) {
      this.selectedItem = this.imageThubList[index - 1];
      this.imag64BitUrl = this.imageThubList[index - 1].fileName64Bit;
    } else if (this.imageThubList.length === 0) {
      this.selectedItem = this.imageThubList[0];
      // this.imag64BitUrl = this.imageThubList[0].fileName64Bit;
      this.imag64BitUrl = '';
    } else {
      this.selectedItem = this.imageThubList[0];
      this.imag64BitUrl = this.imageThubList[0].fileName64Bit;
    }
  }

  openAssembly() {
    // Can be moved to right place
    const dialogRef = this.dialog.open(AssemblyIconModalComponent, { 
      panelClass: 'my-panel', 
      backdropClass: 'backdropBackground',
      data: {
        icon: this.iconSrc
      }

    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.iconSrc = result;
      }
    });
  }
  openZoomImg() {
    // Can be moved to right place
    if (this.imag64BitUrl) {
      const dialogRef = this.dialog.open(AssemblyZoomImageModalComponent, {
        height: '445px',
        data: { addPosition: this.imag64BitUrl }
      });
      dialogRef.afterClosed().subscribe((result) => {});
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log('CHANGES FROM COMPONENT',changes);
    if (changes.selectedComponent && changes.selectedComponent.currentValue) {
      if (this.assemblyDetailsReadOnly) {
        this.updateRightPanel(changes);
      } else {
        const isComponentDuplicate: boolean = this.componentsData.some((component: any) => {
          return component.id == changes.selectedComponent.currentValue.id;
        });
        if (!isComponentDuplicate) {
          const currentValue = changes.selectedComponent.currentValue;

          const isSystemArr = this.checkArray(currentValue.systems);
          const isConnectionArr = this.checkArray(currentValue.connectionTypes);
          if (isSystemArr || isConnectionArr) {
            if (currentValue.connectionTypes) {
              this.selectedConnections = [...this.selectedConnections, ...currentValue.connectionTypes];
            }
            if (currentValue.systems) {
              this.selectedSystem = [...this.selectedSystem, ...currentValue.systems];
            }
          } else {
            if (currentValue.connectionTypes) {
              currentValue.connectionTypes = [currentValue.connectionTypes];
            }
            if (currentValue.systems) {
              currentValue.systems = [currentValue.systems];
            }
          }
          this.componentsData.push({ ...currentValue, qty: 1 });
          this.componentTableData = new MatTableDataSource(this.componentsData);
          this.selectedConnections = this.getUniqueSystemConnection('connectionTypes');
          this.selectedSystem = this.getUniqueSystemConnection('systems');
          this.selectedConnections = [...new Set(this.selectedConnections)];
          this.selectedSystem = [...new Set(this.selectedSystem)];
        } else {
          const messageDialog = this.dialog.open(MessageModalComponent, {
            data: {
              title: 'Component already added.',
              content: '',
              isFromcomponent: true
            }
          });
        }
        // else {
        //   console.log('this.componentsData', this.componentsData);
        //   const isComponentDuplicate: boolean = this.componentsData.some((component: any) => {
        //     return component.id == changes.selectedComponent.currentValue.id;
        //   });
        //   if (!isComponentDuplicate) {
        //     this.componentsData.push({ ...changes.selectedComponent.currentValue, qty: 1 });
        //     this.componentTableData = new MatTableDataSource(this.componentsData);
        //     console.log('this.componentTableData', this.componentTableData);
        //   }
        // }
      }
    }
  }

  /** Function to update the data for assembly-configurator Ready only Mode
   * @memberOf CustomAssemblyComponent
   */
  public updateRightPanel(changes: any) {
    this.enableEdit = true;
    this.imageThubList = [];
    this.imag64BitUrl = '';
    const currentValue = changes.selectedComponent.currentValue;
    const images = currentValue?.images;
    if (images && images.length !== 0) {
      images.forEach((image: any, idx: number) => {
        let imgCopy = {
          // fileName64Bit: 'data:image/jpeg;base64,'+image.image,
          fileName64Bit: this.baseUrl + image.imageLocation,
          isPrimary: image.isPrimary,
          inputText: image.name || ''
        };
        this.imageThubList.push(imgCopy);
        if (image.isPrimary) {
          this.selectedItem = this.imageThubList[idx];
          // this.imag64BitUrl ='data:image/jpeg;base64,'+image.image;
          this.imag64BitUrl = this.baseUrl + image.imageLocation;
        }
      });
    }
    this.groupName = currentValue.groupName;
    this.assemblydata.id = currentValue.id;
    this.assemblydata.name = currentValue.name;
    this.assemblydata.familyId = currentValue.familyId;
    this.assemblydata.abbreviation = currentValue.abbreviation;
    this.iconSrc = currentValue.iconLocation ? this.baseUrl + currentValue.iconLocation : currentValue.icon;
    this.componentsData = [];
    this.componentsData = currentValue.components;
    this.componentTableData = new MatTableDataSource(this.componentsData);
    this.selectedConnections = this.getUniqueSystemConnection('connectionTypes');
    this.selectedSystem = this.getUniqueSystemConnection('systems');
    this.selectedConnections = [...new Set(this.selectedConnections)];
    this.selectedSystem = [...new Set(this.selectedSystem)];
  }

  public saveAssembly() {
    this.saveAssemblyData.images = this.imageObj;
    this.buildComponents();
    let iconBase64 = this.iconSrc;
    if (iconBase64) {
      if (iconBase64.changingThisBreaksApplicationSecurity) {
        iconBase64 = iconBase64.changingThisBreaksApplicationSecurity;
      }
      iconBase64 = this.removeString(iconBase64);
    }
    this.saveAssemblyData.icon = iconBase64;
    this.saveAssemblyData.id = this.assemblydata.id;
    this.saveAssemblyData.companyId = this.sessionService.decrypt(sessionStorage.getItem('companyId') || '');
    this.saveAssemblyData.familyName = this.groupName;
    this.saveAssemblyData.name = this.assemblydata.name;
    this.saveAssemblyData.familyId = this.assemblydata.familyId;
    this.saveAssemblyComponents();
    this.saveLoader = true;
    let emptyDup: any = [];
    this.configuratorService.removedComponents(emptyDup);
    this.configuratorService.dupElement = [];
  }

  public getUpdatedAssemblyData() {
    if (this.imageThubList.length && !this.imageObj.length) {
      this.createImageObj(this.imageThubList);
    }
    if (!this.duplicateAssembly) {
      let assemblyValue = this.configuratorService.getAssemblyFormValue();
      if (!assemblyValue) {
        assemblyValue = this.configuratorService.getAssemblyData();
      }

      for (let val in assemblyValue) {
        assemblyValue[val] = assemblyValue[val].toString().trim();
      }
      const assemblyId = this.isCopyAssembly ? 0 : this.assemblydata.id;
      const isUpdate = this.isCopyAssembly ? false : true;
      this.configuratorService.createAssembly(assemblyValue, isUpdate, assemblyId).subscribe(
        (res: any) => {
          this.configuratorService.setAssemblyData(res);
          this.assemblydata.familyId = assemblyValue.familyId;
          this.assemblydata.name = assemblyValue.name;
          this.assemblydata.abbreviation = assemblyValue.abbreviation;
          this.saveAssembly();
        },
        (error) => {
          this.toastService.openSnackBar(error);
        }
      );
    } else {
      this.saveAssembly();
    }
  }

  private saveAssemblyComponents(): void {
    // const saveAssemblyLocal = this.isEdit ? this.isCopyAssembly ?'saveAssemblyComponents':'updateAssemblyComponents' : 'saveAssemblyComponents';
    this.configuratorService.saveAssemblyComponents(this.saveAssemblyData, this.assemblydata.id).subscribe(
      (res: any) => {
        this.saveLoader = false;
        this.configuratorService.cancelRouteValues = {
          familyId: this.assemblydata.familyId,
          assemblyId: this.assemblydata.id
        };
        this.router.navigate(['/assembly-configurator']);
        this.toastService.openSnackBar('Assembly saved successfully', 'success', 'success-snackbar');
      },
      (error: any) => {
        this.saveLoader = false;
        this.toastService.openSnackBar(error);
        // this.showLoader = false;
      }
    );
  }

  private buildComponents(): any {
    this.componentObj = [];
    if (this.componentTableData) {
      this.componentTableData._data.value.forEach((component: any, index: number) => {
        if (component.qty > 0) {
          const componentData = {
            sequence: index + 1,
            id: component.id,
            qty: component.qty,
            uom: component.uom || '',
            systems: component.systems || [],
            connectionTypes: component.connectionTypes || []
          };
          this.componentObj.push(componentData);
        }
      });
      this.componentObj.forEach((comp: any) => {
        this.configuratorService.dupElement &&
          this.configuratorService.dupElement.forEach((val: any) => {
            comp.duplicate = val.duplicate;
          });
      });
      this.saveAssemblyData.components = this.componentObj;
    }
  }

  public editConnectionSystem(element: any) {
    const dialogRef = this.dialog.open(JunctionboxModalComponent, {
      backdropClass: 'backdropBackground',
      data: {
        componentName: element.name,
        isJunctionBox: true,
        system: element.systems,
        connection: element.connectionTypes,
        isAdd: false
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.checkArray(result.connection)) {
          result.connection = result.connection || [];
          result.systemName = result.systemName || [];

          // const missingConnection = this.getMissingValues(element.connection, result.connection);
          // this.selectedConnections = this.selectedConnections.filter((ele: any) => {
          //   return !missingConnection.includes(ele);
          // });
          // this.selectedConnections = [...this.selectedConnections, ...result.connection]
          // this.selectedConnections = [...new Set(this.selectedConnections)];

          // const missingSystem = this.getMissingValues(element.system, result.systemName);
          // this.selectedSystem = this.selectedSystem.filter((ele: any) => {
          //   return !missingSystem.includes(ele);
          // });
          // this.selectedSystem = [...this.selectedSystem, ...result.systemName]
          // this.selectedSystem = [...new Set(this.selectedSystem)];
          element.connectionTypes = result.connection;
          element.systems = result.systemName;
        } else {
          element.connectionTypes = [result.connection];
          element.systems = [result.systemName];
          // this.selectedSystem = [result.systemName];
          // this.selectedConnections = [result.connection];
        }
        this.selectedConnections = this.getUniqueSystemConnection('connectionTypes');
        this.selectedSystem = this.getUniqueSystemConnection('systems');
      }
    });
  }

  public deleteConnectionSystem(element: any, name: string) {
    element[name] = [];
    if (name === 'systems') {
      this.selectedSystem = this.getUniqueSystemConnection(name);
    }
    if (name === 'connectionTypes') {
      this.selectedConnections = this.getUniqueSystemConnection(name);
    }
  }

  private getUniqueSystemConnection(name: string) {
    let selectedItem: string[] = [];
    this.componentTableData._data.value.forEach((component: any) => {
      if (component[name]) {
        selectedItem = [...selectedItem, ...component[name]];
      }
    });
    selectedItem = [...new Set(selectedItem)];
    selectedItem = selectedItem.filter((item: any) => {
      return item != '';
    });
    return selectedItem;
  }

  public getMissingValues(initialVaue: string[] = [], newValue: string[]) {
    return initialVaue.filter((ele: string) => {
      return !newValue.includes(ele);
    });
  }

  public checkArray(val: any): boolean {
    return Array.isArray(val);
  }

  public filterComponent(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.componentTableData) {
      this.componentTableData.filter = filterValue.trim().toLowerCase();
    }
  }

  public ngOnDestroy() {
    if (this.assemblysubscription) {
      this.assemblysubscription.unsubscribe();
    }
    if (this.groupsubscription) {
      this.groupsubscription.unsubscribe();
    }
  }

  public quantityChange(event: any, row: any) {
    const value = parseInt(event.target.value);
    if (value === 0) {
      const confirmationDialog = this.dialog.open(ConfirmationModalComponent, {
        data: {
          title: 'Remove Component',
          content: 'Should we remove this component from the assembly?'
        }
      });
      confirmationDialog.afterClosed().subscribe((result) => {
        if (result === true) {
          this.removeComponentData(row.id);
        } else {
          row.qty = 1;
        }
      });
    }
  }

  private removeComponentData(id: number) {
    //this.configuratorService.isDuplicate = false;

    const componentData = this.componentsData.filter((component: any) => {
      return component.id !== id;
    });
    this.configuratorService.junctionBoxComponents = this.configuratorService.junctionBoxComponents.filter((compId: number) => {
      return compId !== id;
    });
    this.configuratorService.dupElement.forEach((val: any) => {
      if (id === val.id) {
        val.duplicate = false;
      }
    });

    this.configuratorService.removedComponents(this.configuratorService.dupElement);

    this.componentsData = componentData;
    this.componentTableData = new MatTableDataSource(this.componentsData);
  }

  public checkArrayEmpty(value: string[]): boolean {
    // value.length == 1
    if (value == undefined || value == null) {
      return true;
    }
    const isEmpty = value.some((val: string) => {
      return val == '';
    });
    if (value.length == 1 && isEmpty) {
      return true;
    } else {
      return true;
    }

  }

  public editAssembly() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        edit: true,
        id: this.assemblydata.id
      }
    };
    this.router.navigate(['/create-assembly'], navigationExtras);
  }

  public checkJunctionBox(row: any) {
    if (row?.categoryName?.toLowerCase() === 'junction box' || row.isJunctionBox == true) {
      return true;
    }
    return false;
  }

  public cancelEdit() {
    const fileChoose = this.dialog.open(ConfirmationModalComponent, {
      data: {
        title: 'Cancel',
        content: 'The assembly creation process will be terminated. Do you want to proceed?'
      }
    });

    fileChoose.afterClosed().subscribe((result) => {
      if (result) {
        this.configuratorService.cancelRouteValues = {
          familyId: this.assemblydata.familyId,
          assemblyId: this.assemblydata.id
        };

        let emptyDup: any = [];
        this.configuratorService.removedComponents(emptyDup);
        this.configuratorService.dupElement = [];

        this.configuratorService.removedComponents(this.configuratorService.dupElement);
        this.router.navigate(['/assembly-configurator']);
      }
    });
  }

  public resetAssembly() {
    this.iconSrc = this.originalIconSrc;
    if (this.isEdit) {
      console.log('EDIT MODE');
      this.getAssemblyData();
      this.configuratorService.resetAssemblyData('true');

      console.log('EDITED COMP', this.configuratorService.editedComponentData);

      this.configuratorService.dupElement.forEach((dupVal: any) => {
        if (this.configuratorService.editedComponentData.indexOf(dupVal) == -1) {
          dupVal.duplicate = false;
        }
      });

      console.log('ADDED', this.configuratorService.dupElement);
      this.configuratorService.removedComponents(this.configuratorService.dupElement);
    } else {
      this.configuratorService.dupElement.forEach((value: any) => {
        value.duplicate = false;
      });
      this.configuratorService.removedComponents(this.configuratorService.dupElement);
      this.componentsData = [];
      this.imageThubList = [];
      this.selectedItem = [];
      this.imag64BitUrl = '';
      this.componentTableData = new MatTableDataSource(this.componentsData);
      this.selectedConnections = this.getUniqueSystemConnection('connectionTypes');
      this.selectedSystem = this.getUniqueSystemConnection('systems');
    }
  }

  private removeString(base64: string) {
    const index = base64.indexOf('base64,') + 7;
    return base64.substring(index);
  }

  private async converBase64FromUrl(imageUrl: any) {
    const url = this.baseUrl + imageUrl;
    var res = await fetch(url);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener(
        'load',
        function () {
          resolve(reader.result);
        },
        false
      );

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });
  }

  dropTable(event: CdkDragDrop<any>) {
    // const prevIndex = this.componentTableData.findIndex((d: any) => d === event.item.data);
    // moveItemInArray(this.componentTableData, prevIndex, event.currentIndex);
    // this.table.renderRows();
    moveItemInArray(this.componentsData, event.previousIndex, event.currentIndex);
    this.componentTableData = new MatTableDataSource(this.componentsData);
    // this.table.renderRows();
  }

  getBase64Image(src: any, callback: any) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      let dataURL;
      canvas.height = img.naturalHeight;
      canvas.width = img.naturalWidth;
      if (ctx) {
        ctx.drawImage(img, 0, 0);
      }
      dataURL = canvas.toDataURL();
      callback(dataURL);
    };

    img.src = src;
    if (img.complete || img.complete === undefined) {
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
      img.src = src;
    }
  }

  public imageReceived() {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');

    canvas.width = this.downloadedImg.width;
    canvas.height = this.downloadedImg.height;

    context ? context.drawImage(this.downloadedImg, 0, 0) : null;

    try {
      localStorage.setItem('saved-image-example', canvas.toDataURL('image/png'));
    } catch (err) {
      console.log('Error: ' + err);
    }
  }

  public gridView() {
    let address = window.location.href;
    if (this.isEdit) {
      this.gridViewFlag = false;
    } else if (address.endsWith('create-assembly')) {
      this.gridViewFlag = false;
    } else {
      this.gridViewFlag ? (this.gridViewFlag = false) : (this.gridViewFlag = true);
    }
  }

  public  exportPdf(){

    const doc = new jsPDF('l','pt',[920,720]);



    const generatePdf = this.pdfTable.nativeElement;
    console.log('MNATIVE', generatePdf);
    doc.html(generatePdf,{
    callback:(doc)=>{

      doc.setFont("helvetica");
      doc.setFontSize(9);

      doc.save('export.pdf')}
    });
    // doc.save('export.pdf');
  }
}
