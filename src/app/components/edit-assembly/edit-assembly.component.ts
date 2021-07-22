import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ConfiguratorService } from 'src/app/services/configurator.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import {MatDialog} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-assembly',
  templateUrl: './edit-assembly.component.html',
  styleUrls: ['./edit-assembly.component.scss']
})
export class EditAssemblyComponent implements OnInit, OnDestroy {

  @Input() public families: any;
  @Output() assemblyDataAdded = new EventEmitter();

  public createAssemblyFrom: FormGroup;
  public submitted = false;
  private prevAssemblyName: string;
  public suggestions: any;
  public showSuggestion: boolean;
  private assemblyId: number;
  public disableGroupDropdown: boolean = false;
  public isEditAssembly: boolean = false;
  private resetSubscription: Subscription;
  private paramId: number;

  constructor(private formBuilder: FormBuilder, private configuratorService: ConfiguratorService, private toastService: ToastService,
    public dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.createAssemblyFrom = this.formBuilder.group({
      name: ['', Validators.required],
      familyId: ['', Validators.required],
      abbreviation: ['', Validators.required],
    });
    this.showSuggestion = false;

    this.route.queryParams.subscribe(params => {
      if(params.id) {
        this.isEditAssembly = true;
        this.paramId = params.id;
        this.getAssemblyData(params.id);
      }        
    });

    this.resetSubscription = this.configuratorService.resetValueObservable.subscribe((groupName: any) => {
      if(this.paramId) {
        this.getAssemblyData(this.paramId);
      }
    });

  }

  private getAssemblyData(id: number){

    this.configuratorService.getAssemblyById(id).subscribe((res: any) => {
      this.createAssemblyFrom.patchValue({
        name: res.name,
        familyId: res.familyId,
        abbreviation: res.abbreviation,
      });
      if (this.isEditAssembly) {
        this.setFormValue();
      }
      this.configuratorService.setAssemblyData(res);
      this.updateGroupName(res['familyId']);
      this.disableGroupDropdown = true;
    },
    (error: any) => {
      this.toastService.openSnackBar(error);
    });
  }

  public onSubmit(): void {
    if (this.createAssemblyFrom.invalid) {
      return;
    }
    this.createAssembly();
  }

  public enableForm() {
    this.submitted = false;
    this.assemblyDataAdded.emit();
  }

  public createSuggestion(event: any) {
    let currVal: any = event.target.value;
    if (event.target.value !== this.prevAssemblyName) {
      let suggArr = [];
      currVal = currVal.toUpperCase().split(' ');

      if (currVal.length > 1) {
        suggArr.push(currVal.map((val: string) => {
          return val.slice(0, 1);
        }).join(''));

        suggArr.push((currVal[0].slice(0, 2) + currVal[1].slice(0, 1)));
      }

      suggArr.push(currVal[0].slice(0, 3));
      this.validateSuggestions(suggArr);
    }

    this.prevAssemblyName = event.target.value;
    if (this.isEditAssembly) {
      this.setFormValue();
    }
  }

  public fillAbbr(abbr: any) {
    this.createAssemblyFrom.patchValue({
      abbreviation: abbr
    });
    if (this.isEditAssembly) {
      this.setFormValue();
    }
  }

  private validateSuggestions(suggArr: string[]) {
    const reqObj = {
      "abbreviations": suggArr
    }
    this.configuratorService.getSuggestions(reqObj).subscribe((res: any) => {
      this.suggestions = res;  
      this.showSuggestion = true;    
    },
    (error) => {
      this.toastService.openSnackBar(error);
    }
    );
  }

  private createAssembly() {
    const isUpdate: boolean = this.assemblyId ? true : false;

    this.configuratorService.createAssembly(this.createAssemblyFrom.value, isUpdate, this.assemblyId).subscribe((res: any)=>{
      this.assemblyId = res['id'];
      this.submitted = true;
      this.disableGroupDropdown = true;
      this.showSuggestion = false;
      this.assemblyDataAdded.emit();
      this.configuratorService.setAssemblyData(res);
      this.updateGroupName(res['familyId']);
    },
    (error) => {
      this.toastService.openSnackBar(error);
    });
  }

  private updateGroupName(familyId: number) {
    const families = this.families || this.configuratorService.families;
    if(families) {
      families.forEach((element: any) => {
        if(element.id === familyId) {     
          this.configuratorService.currentGroupName(element.name);
        }
      }); 
    }   
  }

  public setFormValue() {
    this.configuratorService.setAssemblyFormValue(this.createAssemblyFrom.value);
  }

  ngOnDestroy() {
    if(this.resetSubscription) {
      this.resetSubscription.unsubscribe();
    }
  }
  
}
