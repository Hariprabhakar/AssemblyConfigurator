import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FileChooseModalComponent } from '../components/file-choose-modal/file-choose-modal.component';
import { AssemblyIconModalComponent } from '../components/assembly-icon-modal/assembly-icon-modal.component';
import { AssemblyZoomImageModalComponent } from '../components/assembly-zoom-image-modal/assembly-zoom-image-modal.component';
import { ConfiguratorService } from '../services/configurator.service';
import { JunctionboxModalComponent } from '../components/junctionbox-modal/junctionbox-modal.component';
import { Subscription } from 'rxjs';
import { ToastService } from '../shared/services/toast.service';
import { Router } from '@angular/router';
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
  public componentsData: any;
  public componentTableData: any;
  public assemblydata: any;
  public groupName: any;
  public imag64BitUrl: String;
  public imageObj: any;
  public imageThubList: any;
  public selectedItem: any;
  public iconSrc: any;
  public selectedConnections: string[] = [];
  public selectedSystem: string[] = [];
  private assemblysubscription: Subscription;
  private groupsubscription: Subscription;
  private componentObj: any = [];
  private saveAssemblyData = {
    id: '',
    name: '',
    familyId: '',
    familyName: '',
    icon: '',
    images: [],
    components: []
  }
  constructor(public dialog: MatDialog, private configuratorService: ConfiguratorService, 
    private toastService: ToastService, private router:Router) {
    this.imag64BitUrl = '';
    this.imageObj = [];

    this.imageThubList = [];
  }

  ngOnInit(): void {
    this.componentsData = [];
    this.groupName = '';
    this.assemblydata = {};
    if (!this.assemblyDetailsReadOnly) {
      this.assemblysubscription = this.configuratorService.currentAssemblyValue.subscribe((data: any) => {
        this.assemblydata = data;
      });
      this.groupsubscription = this.configuratorService.groupNameObservable.subscribe((groupName: any) => {
        this.groupName = groupName;
      });
    }
  }

  imageSelection(fileName64Bit: any, activeItem: any) {
    this.imag64BitUrl = fileName64Bit;
    this.selectedItem = activeItem;
  }


  openFileChooseModal() { // Can be moved to right place
    const fileChoose = this.dialog.open(FileChooseModalComponent, {
      data: this.imageThubList
    });
    fileChoose.afterClosed().subscribe(result => {
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
      const imgBase64 = imgData.fileName64Bit.replace('data:image/jpeg;base64,', '');
      const img = {
        name: imgData.inputText,
        image: imgBase64,
        isPrimary: imgData.isPrimary
      }
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

  openAssembly() { // Can be moved to right place
    const dialogRef = this.dialog.open(AssemblyIconModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.iconSrc = result;
      }
    });
  }
  openZoomImg() { // Can be moved to right place
    if (this.imag64BitUrl) {
      const dialogRef = this.dialog.open(AssemblyZoomImageModalComponent, {
        height: '445px',
        data: { addPosition: this.imag64BitUrl }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedComponent && changes.selectedComponent.currentValue) {
      if (this.assemblyDetailsReadOnly) {
        this.updateRightPanel(changes);
      } else {

        console.log('this.componentsData', this.componentsData);

        const isComponentDuplicate: boolean = this.componentsData.some((component: any) => {
          return component.id == changes.selectedComponent.currentValue.id;
        });
        if (!isComponentDuplicate) {
          const currentValue = changes.selectedComponent.currentValue;
         
          const isSystemArr = this.checkArray(currentValue.systems);
          const isConnectionArr = this.checkArray(currentValue.connectionTypes);
          if (isSystemArr || isConnectionArr) {
            if (currentValue.connectionTypes) {
              this.selectedConnections = [...this.selectedConnections, ...currentValue.connectionTypes]
            }
            if (currentValue.systems) {
              this.selectedSystem = [...this.selectedSystem, ...currentValue.systems]
            }
          } 
          else {
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
  public updateRightPanel(changes:any) {
    const currentValue = changes.selectedComponent.currentValue;
    const images = currentValue?.images;
    if (images && images.length !== 0) {
      this.imageThubList = images;
      this.selectedItem = images[0];
      this.imag64BitUrl = images[0].fileName64Bit;
    }
    this.groupName = currentValue.groupName;
    this.assemblydata.id = currentValue.id
    this.assemblydata.name = currentValue.name;
    this.assemblydata.familyId = currentValue.familyId;
    this.iconSrc = currentValue.icon;
    this.componentsData = [];
    this.componentsData = currentValue.components;
    this.componentTableData = new MatTableDataSource(this.componentsData);
  }

  public saveAssembly() {
    this.saveAssemblyData.images = this.imageObj;
    this.buildComponents();
    let iconBase64 = ''
    if (this.iconSrc) {
      iconBase64 = this.iconSrc.replace('data:image/png;base64,', '');
    }
    this.saveAssemblyData.icon = iconBase64;
    this.saveAssemblyData.id = this.assemblydata.id;
    this.saveAssemblyData.familyName = this.groupName;
    this.saveAssemblyData.name = this.assemblydata.name;
    this.saveAssemblyData.familyId = this.assemblydata.familyId;
    this.saveAssemblyComponents();
  }

  private saveAssemblyComponents() {
    this.configuratorService.saveAssemblyComponents(this.saveAssemblyData, this.assemblydata.id).subscribe((res: any) => {
      console.log(res);
      this.router.navigate(['/assembly-configurator']);
    },
      (error: any) => {
        this.toastService.openSnackBar(error);
        // this.showLoader = false;
      }
    );
  }

  private buildComponents(): any {
    this.componentObj = [];
    this.componentTableData._data.value.forEach((component: any) => {
      if (component.qty > 0) {
        const componentData = {
          id: component.id,
          qty: component.qty,
          uom: component.uom || '',
          systems: component.systems || [],
          connectionTypes: component.connectionTypes || []
        }
        this.componentObj.push(componentData);
      }
    });
    this.saveAssemblyData.components = this.componentObj;
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
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        if(this.checkArray(result.connection)){
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
    if(name === 'systems') {
      this.selectedSystem = this.getUniqueSystemConnection(name);
    }
    if(name === 'connectionTypes') {
      this.selectedConnections = this.getUniqueSystemConnection(name);
    }
    
  }

  private getUniqueSystemConnection(name: string){
    let selectedItem: string[] = [];
    this.componentTableData._data.value.forEach((component: any) => {
      if (component[name]) {
        selectedItem = [...selectedItem, ...component[name]]
      }
    });
    selectedItem = [...new Set(selectedItem)];
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
    this.componentTableData.filter = filterValue.trim().toLowerCase();
  }

  public ngOnDestroy() {
    if(this.assemblysubscription) {
      this.assemblysubscription.unsubscribe();
    }
    if (this.groupsubscription) {
      this.groupsubscription.unsubscribe();
    }    
  }

  public quantityChange(event: any) {
    console.log(event.target.value);
    const value = parseInt(event.target.value);
    if(value === 0) {
      
    }
  }

  public checkArrayEmpty(value: string[]): boolean {
    value.length == 1 
    const isEmpty = value.some((val: string)=>{
      return val == '';
    });
    if(value.length == 1 && isEmpty) {
      return true;
    } else {
      return false;
    }
  }

}
