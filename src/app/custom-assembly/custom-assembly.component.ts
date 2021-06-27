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
  constructor(public dialog: MatDialog, private configuratorService: ConfiguratorService, private toastService: ToastService) {
    this.imag64BitUrl = '';
    this.imageObj = [];

    this.imageThubList = [];
  }

  ngOnInit(): void {
    this.componentsData = [];
    this.groupName = '';
    this.assemblydata = undefined;
    this.assemblysubscription = this.configuratorService.currentAssemblyValue.subscribe((data: any) => {
      this.assemblydata = data;
    });
    this.groupsubscription = this.configuratorService.groupNameObservable.subscribe((groupName: any) => {
      this.groupName = groupName;
    });
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
    const dialogRef = this.dialog.open(AssemblyZoomImageModalComponent, {
      height: '445px',
      data: { addPosition: this.imag64BitUrl }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
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
         
          const isSystemArr = this.checkArray(currentValue.connection);
          const isConnectionArr = this.checkArray(currentValue.connection);
          if (isSystemArr || isConnectionArr) {
            if (currentValue.connection) {
              this.selectedConnections = [...this.selectedConnections, ...currentValue.connection]
            }
            if (currentValue.system) {
              this.selectedSystem = [...this.selectedSystem, ...currentValue.system]
            }
          } 
          else {
            if (currentValue.connection) {
              currentValue.connection = [currentValue.connection];
            }
            if (currentValue.system) {
              currentValue.system = [currentValue.system];
            }
          }
          this.componentsData.push({ ...currentValue, qty: 1 });
          this.selectedConnections = [...new Set(this.selectedConnections)];
          this.selectedSystem = [...new Set(this.selectedSystem)];
          this.componentTableData = new MatTableDataSource(this.componentsData);
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
    const images = changes.selectedComponent.currentValue?.images;
    if (images && images.length !== 0) {
      this.imageThubList = images;
      this.selectedItem = images[0];
      this.imag64BitUrl = images[0].fileName64Bit;
    }
    this.componentsData = [];
    this.componentsData = changes.selectedComponent.currentValue.components;
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
      const componentData = {
        id: component.id,
        qty: component.qty,
        uom: component.uom || '',
        systems: [

        ],
        connectionTypes: [

        ]
      }
      this.componentObj.push(componentData);
    });
    this.saveAssemblyData.components = this.componentObj;
  }

  public editConnectionSystem(element: any) {
    const dialogRef = this.dialog.open(JunctionboxModalComponent, {
      backdropClass: 'backdropBackground',
      data: {
        componentName: element.name,
        isJunctionBox: true,
        system: element.system,
        connection: element.connection,
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
          element.connection = result.connection;
          element.system = result.systemName;
        } else {
          element.connection = [result.connection];
          element.system = [result.systemName];
          // this.selectedSystem = [result.systemName];
          // this.selectedConnections = [result.connection];
        }
        this.selectedConnections = this.getUniqueSystemConnection('connection');
        this.selectedSystem = this.getUniqueSystemConnection('system');        
      }
    });
  }

  public deleteConnectionSystem(element: any, name: string) {
    element[name] = [];
    if(name === 'system') {
      this.selectedSystem = this.getUniqueSystemConnection(name);
    }
    if(name === 'connection') {
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
    this.assemblysubscription.unsubscribe();
    this.groupsubscription.unsubscribe();
  }

}
