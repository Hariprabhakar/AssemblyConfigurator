import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ConfiguratorService } from 'src/app/services/configurator.service';

@Component({
  selector: 'app-edit-assembly',
  templateUrl: './edit-assembly.component.html',
  styleUrls: ['./edit-assembly.component.scss']
})
export class EditAssemblyComponent implements OnInit {

  @Input() public families: any;
  @Output() assemblyDataAdded = new EventEmitter();

  public createAssemblyFrom: FormGroup;
  public submitted = false;
  private prevAssemblyName: string;
  public suggestions: any;
  public showSuggestion: boolean;
  private assemblyId: number;

  constructor(private formBuilder: FormBuilder, private configuratorService: ConfiguratorService) { }

  ngOnInit(): void {
    this.createAssemblyFrom = this.formBuilder.group({
      name: ['', Validators.required],
      familyId: ['', Validators.required],
      abbreviation: ['', Validators.required],
    });
    this.showSuggestion = false;
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
  }

  public fillAbbr(abbr: any) {
    this.createAssemblyFrom.patchValue({
      abbreviation: abbr
    });
  }

  private validateSuggestions(suggArr: string[]) {
    const reqObj = {
      "companyId": this.configuratorService.companyId,
      "abbreviations": suggArr
    }
    this.configuratorService.getSuggestions(reqObj).subscribe((res: any) => {
      this.suggestions = res;  
      this.showSuggestion = true;    
    },
    (error) => {
      console.log(error);
    }
    );
  }

  private createAssembly() {
    const isUpdate: boolean = this.assemblyId ? true : false;

    this.configuratorService.createAssembly(this.createAssemblyFrom.value, isUpdate).subscribe((res: any)=>{
      this.assemblyId = res['id'];
      this.submitted = true;
      this.showSuggestion = false;
      this.assemblyDataAdded.emit();
      this.configuratorService.setAssemblyData(res);
    },
    (error) => {
      console.log(error);
    });
  }

}
