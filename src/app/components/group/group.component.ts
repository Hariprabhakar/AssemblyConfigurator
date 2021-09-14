import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { ActivatedRoute } from '@angular/router';
import { CreateTemplateModalComponent } from 'src/app/assembly-configurator/create-template-modal/create-template-modal.component';
import { TemplateSuccessModalComponent } from 'src/app/assembly-configurator/template-success-modal/template-success-modal.component';
import { ConfiguratorService } from 'src/app/services/configurator.service';
import { ToastService } from 'src/app/shared/services/toast.service';


@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  private groups: any;
  public groupList: any;
  public searchValue: any;
  public selectedOptions: any;
  @Output() groupChanged = new EventEmitter();
  @ViewChild(MatSelectionList) selectedGroup: MatSelectionList;
  public showLoader: boolean;
  constructor(private configuratorService:  ConfiguratorService, private toastService: ToastService,
    private route: ActivatedRoute, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.showLoader = true;
    this.configuratorService.getFamilies().subscribe((res: any) => {
      this.groups = [{id: null, name: 'Custom Assemblies'}, ...res ];
      this.configuratorService.setGroups(res);
      this.groupList = [...this.groups];
      this.showLoader = false;
      this.selectedGroup.selectionChange.subscribe((grp: MatSelectionListChange) => {          
        sessionStorage.setItem('selectedFamily', grp.option.value.id);
        this.selectedGroup.deselectAll();
        grp.option.selected = true;
        this.groupChanged.emit(grp.option.value);
    });
      const famildyId = this.configuratorService.cancelRouteValues.familyId;
      if (famildyId) {
        this.configuratorService.cancelRouteValues.familyId = '';
        this.groups.some((group: any) => {
          if (famildyId == group.id) {
            this.selectedOptions = [group];
            this.groupChanged.emit(group);
            return true;
          }
        });
    }
    },
    (error: any) => {
      this.toastService.openSnackBar(error);
      this.showLoader = false;
    });

  }

  public filterCategory() {
    this.groupList = this.groups.filter((category: any) => {
      return category['name'].toLowerCase().indexOf(this.searchValue.toLowerCase()) >= 0;
    });
  }

  public createTemplate() {
    const dialogRef = this.dialog.open(CreateTemplateModalComponent, {panelClass: 'create-template-modal',
      backdropClass: 'backdropBackground',
      width: '90%',
      height: '95%'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.showSuccessModal();
      }
    });
  }

  private showSuccessModal(){
    const dialogRef = this.dialog.open(TemplateSuccessModalComponent, {panelClass: 'create-template-modal',
      backdropClass: 'backdropBackground',
      width: '390px',
      height: '190px'
    });
  }

}
