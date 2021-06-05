import { Component, ElementRef, HostListener, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfiguratorService } from 'src/app/services/configurator.service';

@Component({
  selector: 'app-category-components',
  templateUrl: './category-components.component.html',
  styleUrls: ['./category-components.component.scss']
})
export class CategoryComponentsComponent implements OnInit {
   @Input() public categoryValue: number;
   @ViewChild('tagModal', { read: ElementRef, static: false }) tagModal: ElementRef
  public displayedColumns: string[] = ['image', 'component', 'tag', 'phase', 'udm', 'add'];
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
  public editPhase: boolean = false;
  private currentPhaseVal: any;
  
  constructor(private configuratorService: ConfiguratorService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.categoryValue && changes.categoryValue.currentValue){
      const id = changes.categoryValue.currentValue.id;
      this.configuratorService.getComponents(this.configuratorService.companyId, id).subscribe((res: any) => {
        this.componentDataSource = new MatTableDataSource(res);
        this.editPhase = false;
      });
    }    
}

  filterComponent(event: any){
    const filterValue = (event.target as HTMLInputElement).value;
    this.componentDataSource.filter = filterValue.trim().toLowerCase();    
  }
  
  public showTagModal(event: any, row: any){
   let top;
    this.selectedComponentId = row.id;
    if(row.tag){
      this.currentTagList = row.tag.split(',');
    } else {
      this.currentTagList = [];
    }
    
    this.showAddTag = true;
    this.tagFlag = true;
    top = event.pageY - event.offsetY;
    const topMargin = window.innerHeight - top;
    if( topMargin < 280){
      const diff = 280 - topMargin;
      top = top - diff;
    }
    this.tagModalPosition.left = event.pageX - event.offsetX + 'px';
    this.tagModalPosition.top = top + 'px';
    
  }

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
    this.configuratorService.addTagToComponent(this.selectedComponentId,this.tagValue);
  }

  public clearTagVal() {
    this.tagValue = '';
  }

  public enableEditPhase(){
    this.editPhase = true;
  }

  public updatePhase(event: any){
   const phaseVal = event.target.value;
   this.editPhase = false;
   if(phaseVal !== '' && phaseVal !== this.currentPhaseVal){
     this.configuratorService.updatePhase(this.selectedComponentId, phaseVal).subscribe((res) => {
       console.log(res);
       
     })
   }
  }

  public phaseClicked(row: any){
    this.currentPhaseVal = row.phase;
    this.selectedComponentId = row.id;
  }
}
