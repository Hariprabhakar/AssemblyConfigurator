import { Component, ElementRef, HostListener, Input, OnInit, Output, SimpleChanges, ViewChild, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfiguratorService } from 'src/app/services/configurator.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { JunctionboxModalComponent } from '../junctionbox-modal/junctionbox-modal.component';
import { Subscription } from 'rxjs';
import { MessageModalComponent } from '../message-modal/message-modal.component';
import { ActivatedRoute } from '@angular/router';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';



@Component({
  selector: 'app-category-components',
  templateUrl: './category-components.component.html',
  styleUrls: ['./category-components.component.scss']
})
export class CategoryComponentsComponent implements OnInit {
  @Input() public categoryValue: number;
  @Input() public duplicateValue: any;
  @ViewChild('tagModal', { read: ElementRef, static: false }) tagModal: ElementRef
  @Output() selectedComponent = new EventEmitter();
  public displayedColumns: string[] = ['image', 'component', 'tag', 'phase', 'uom', 'add'];
  public componentDataSource: any;
  public tagModalPosition = {
    left: '',
    top: ''
  }
  public showAddTag: boolean = false;
  private tagFlag: boolean = false;
  public currentTagList: any;
  public tagValue: any;
  private selectedComponentId: number;
  private currentPhaseVal: any;
  public editableRowIndex: any;
  public showLoader: boolean;
  private recentEditedPhase: string;
  private recentEditedTag: string;
  public currentTagVal: any;
  public editableTagIndex: any;
  public isJunctionBox: boolean;
  private recentElement: any;
  public disable: any;
  public editedData: any;
  public disableBtn: any;
  private isJunctionBoxGroup: any;
  private assemblysubscription: Subscription;

  constructor(private configuratorService: ConfiguratorService, private route: ActivatedRoute, private toastService: ToastService, public dialog: MatDialog) {
    this.isJunctionBox = false;
    this.isJunctionBoxGroup = false;
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe((params: any) => {
      let paramId = params.id;
      if (paramId) {
        this.getAssemblyData(paramId);
      }
    });

    this.assemblysubscription = this.configuratorService.currentAssemblyValue.subscribe((data: any) => {

      if (data.familyId === 2) {
        this.isJunctionBoxGroup = true;
      } else {
        this.isJunctionBoxGroup = false;
      }
    });
  }

  openDialog(element: any) {
    const dialogRef = this.dialog.open(JunctionboxModalComponent, {
      backdropClass: 'backdropBackground',
      data: {
        componentName: element.name,
        isJunctionBox: this.isJunctionBox,
        isAdd: true
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.recentElement.connectionTypes = result.connection;
        this.recentElement.systems = result.systemName;
        this.recentElement.isJunctionBox = this.isJunctionBox;
        this.configuratorService.junctionBoxComponents.push(this.recentElement.id);
        this.selectedComponent.emit(this.recentElement);
      }
    });
  }


  public ngOnChanges(changes: SimpleChanges) {

    if (changes.categoryValue && changes.categoryValue.currentValue) {
      if (changes.categoryValue.currentValue?.name?.toLowerCase() === 'junction box') { // Junctionbox id is 7 and for mocking its kept of Data Jack
        this.isJunctionBox = true;
      } else {
        this.isJunctionBox = false;
      }

      const id = changes.categoryValue.currentValue.id;
      this.showLoader = true;
      this.configuratorService.getComponents(this.configuratorService.companyId, id).subscribe((res: any) => {

        this.configuratorService.dupElement && res.forEach((val: any) => {

          this.configuratorService.dupElement.forEach((value: any) => {
            if (val.id === value.id) {
              val.duplicate = value.duplicate;
            }
          });

        });

        res.forEach((val: any) => {
          this.configuratorService.removedElement.subscribe((response: any) => {

            if (response) {
              response.forEach((value: any) => {
                if (val.id === value.id) {
                  val.duplicate = value.duplicate;
                }

              });

            }
          });


        });

        this.componentDataSource = new MatTableDataSource(res);
        this.editableRowIndex = -1;
        this.showLoader = false;
      },
        (error: any) => {
          this.toastService.openSnackBar(error);
          this.showLoader = false;
        });
    }
  }


  filterComponent(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.componentDataSource.filter = filterValue.trim().toLowerCase();
  }

  addComponent(element: any) {
    this.recentElement = element;
    this.checkDuplicate(element);
    //this.disableBtn = element.id;

    //this.disable.push(element.id);
    //console.log('ADDED',this.disable);

    const getAssemblyData = this.configuratorService.getAssemblyData();
    // if (getAssemblyData !== undefined && getAssemblyData?.familyId && getAssemblyData.familyId === 2) {
    //   this.openDialog(element);
    // }  


    if (this.isJunctionBox) {
      const existingComponents = this.configuratorService.junctionBoxComponents;
      if (!existingComponents.includes(element.id)) {
        this.openDialog(element);
      } else {

        this.disableBtn = true;
        const messageDialog = this.dialog.open(MessageModalComponent, {
          data: {
            title: 'Component already added.',
            content: '',
            isFromcomponent: true
          }
        });
      }
    } else {
      this.selectedComponent.emit(element);
    }

  }

  // public showTagModal(event: any, row: any){
  //  let top;
  //   this.selectedComponentId = row.id;
  //   if(row.tag){
  //     this.currentTagList = row.tag.split(',');
  //   } else {
  //     this.currentTagList = [];
  //   }

  //   this.showAddTag = true;
  //   this.tagFlag = true;
  //   top = event.pageY - event.offsetY;
  //   const topMargin = window.innerHeight - top;
  //   if( topMargin < 280){
  //     const diff = 280 - topMargin;
  //     top = top - diff;
  //   }
  //   this.tagModalPosition.left = event.pageX - event.offsetX + 'px';
  //   this.tagModalPosition.top = top + 'px';

  // }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!(this.tagModal && this.tagModal.nativeElement.contains(event.target))) {
      if (!this.tagFlag) {
        this.showAddTag = false;
        this.clearTagVal();
      }
      this.tagFlag = false;
    }
  }

  public addTag() {
    if (this.tagValue) {
      this.configuratorService.addTagToComponent(this.selectedComponentId, this.tagValue).subscribe((res: any) => {
        this.componentDataSource.data.forEach((element: any) => {
          if (element.id == res['componentId']) {
            element.tag = element.tag ? element.tag + ',' + res.tag : res.tag;
          }
          this.showAddTag = false;
        });
      },
        (error: any) => {
          this.toastService.openSnackBar(error);
        });
    }

  }

  public clearTagVal() {
    this.tagValue = '';
  }

  public updatePhase(event: any) {
    if (this.recentEditedPhase !== event.target.value) {
      this.recentEditedPhase = event.target.value;

      if (this.recentEditedPhase !== '' && this.recentEditedPhase !== this.currentPhaseVal) {
        const phaseObj = {
          phase: this.recentEditedPhase
        };
        this.configuratorService.updatePhase(this.selectedComponentId, phaseObj).subscribe((res) => {
          this.editableRowIndex = -1;

        },
          (error: any) => {
            this.toastService.openSnackBar(error);
          });
      }
    }
  }

  public updateTag(event: any) {
    if (this.recentEditedTag !== event.target.value) {
      this.recentEditedTag = event.target.value;

      if (this.recentEditedTag !== '' && this.recentEditedTag !== this.currentTagVal) {
        const tag = {
          tag: this.recentEditedTag
        }
        this.configuratorService.addTagToComponent(this.selectedComponentId, tag).subscribe((res: any) => {
          this.editableTagIndex = -1;
        },
          (error: any) => {
            this.toastService.openSnackBar(error);
          });
      }
    }
  }

  public phaseClicked(row: any, rowIndex: number) {
    this.currentPhaseVal = row.phase;
    this.selectedComponentId = row.id;
    this.editableRowIndex = rowIndex;
  }

  public tagClicked(row: any, rowIndex: number) {
    this.currentTagVal = row.tag;
    this.selectedComponentId = row.id;
    this.editableTagIndex = rowIndex;
  }

  public showFilterModal() {

    const dialogRef = this.dialog.open(FilterModalComponent, {
      backdropClass: 'backdropBackground',
      data: {
        categoryId: 1
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(true);
        
      }
    });
  }

  public checkDuplicate(element: any) {

    !(element.duplicate) && (element.duplicate = true);

    this.configuratorService.dupElement.push(element);


  }

  public getAssemblyData(id: any) {

    this.configuratorService.getAssemblyComponent(id).subscribe((response: any) => {
      if (response) {
        this.editedData = response.components;
        this.editedData.forEach((val: any) => {

          this.checkDuplicate(val);
        });

      }


    });
  }

}
