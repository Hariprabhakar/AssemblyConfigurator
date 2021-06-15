import { Component, ElementRef, HostListener, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfiguratorService } from 'src/app/services/configurator.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import {MatDialog} from '@angular/material/dialog';
import { JunctionboxModalComponent } from '../junctionbox-modal/junctionbox-modal.component';
import { AssemblyIconModalComponent } from '../assembly-icon-modal/assembly-icon-modal.component';

@Component({
  selector: 'app-category-components',
  templateUrl: './category-components.component.html',
  styleUrls: ['./category-components.component.scss']
})
export class CategoryComponentsComponent implements OnInit {
   @Input() public categoryValue: number;
   @ViewChild('tagModal', { read: ElementRef, static: false }) tagModal: ElementRef
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
  public showLoader:boolean;
  private recentEditedPhase: string;
  private recentEditedTag: string;
  public currentTagVal: any;
  public editableTagIndex: any;
  public isJunctionBox: boolean;

  constructor(private configuratorService: ConfiguratorService, private toastService: ToastService,  public dialog: MatDialog) { 
    this.isJunctionBox = false;
  }

  ngOnInit(): void {
  
  }

  openDialog() {
    const dialogRef = this.dialog.open(JunctionboxModalComponent, {
      backdropClass: 'backdropBackground'
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
  }
  openAssembly() { // Can be moved to right place
    const dialogRef = this.dialog.open(AssemblyIconModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges', this.categoryValue);
    if(changes.categoryValue && changes.categoryValue.currentValue){
      if (changes.categoryValue.currentValue.id === 9) { // Junctionbox id is 7 and for mocking its kept of Data Jack
        this.isJunctionBox = true;
      } else {
        this.isJunctionBox = false;
      }
      
      const id = changes.categoryValue.currentValue.id;
      this.showLoader = true;
      this.configuratorService.getComponents(this.configuratorService.companyId, id).subscribe((res: any) => {
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

/**/
isDialogOpen() {
  const getAssemblyData = this.configuratorService.getAssemblyData();
  console.log('getAssemblyData', getAssemblyData);  
   if (getAssemblyData !== undefined && getAssemblyData?.familyId && getAssemblyData.familyId === 2) {
     this.openDialog();
   } else if(this.isJunctionBox) {
     this.openDialog();
   }

}

  filterComponent(event: any){
    const filterValue = (event.target as HTMLInputElement).value;
    this.componentDataSource.filter = filterValue.trim().toLowerCase();    
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
    if(!(this.tagModal && this.tagModal.nativeElement.contains(event.target))) {
      if (!this.tagFlag) {
        this.showAddTag = false;
        this.clearTagVal();
      }
      this.tagFlag = false;
    } 
  }

  public addTag(){
    if(this.tagValue) {
      this.configuratorService.addTagToComponent(this.selectedComponentId,this.tagValue).subscribe((res: any) => {
        this.componentDataSource.data.forEach((element: any) => {
          if(element.id == res['componentId']){
            element.tag = element.tag? element.tag + ','+ res.tag : res.tag;
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

  public updatePhase(event: any){
    if(this.recentEditedPhase !== event.target.value){
      this.recentEditedPhase = event.target.value;

      if(this.recentEditedPhase !== '' && this.recentEditedPhase !== this.currentPhaseVal){
        this.configuratorService.updatePhase(this.selectedComponentId, this.recentEditedPhase).subscribe((res) => {
          console.log(res);
          this.editableRowIndex = -1;
          
        },
        (error: any) => {
          this.toastService.openSnackBar(error);
        });
      }
    }
  }

  public updateTag(event: any){
    if(this.recentEditedTag !== event.target.value){
      this.recentEditedTag = event.target.value;

      if(this.recentEditedTag !== '' && this.recentEditedTag !== this.currentTagVal){
        this.configuratorService.addTagToComponent(this.selectedComponentId,this.recentEditedTag).subscribe((res: any) => {
          this.editableTagIndex = -1;
        },
        (error: any) => {
          this.toastService.openSnackBar(error);
        });
      }
    }
  }

  public phaseClicked(row: any, rowIndex: number){
    this.currentPhaseVal = row.phase;
    this.selectedComponentId = row.id;
    this.editableRowIndex = rowIndex;
  }

  public tagClicked(row: any, rowIndex: number){
    this.currentTagVal = row.tag;
    this.selectedComponentId = row.id;
    this.editableTagIndex = rowIndex;
  }
}
