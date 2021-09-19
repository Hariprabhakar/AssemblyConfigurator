import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ConfiguratorService } from 'src/app/services/configurator.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-request-new-comp',
  templateUrl: './request-new-comp.component.html',
  styleUrls: ['./request-new-comp.component.scss']
})
export class RequestNewComponent implements OnInit {

  public requestNewComponent: FormGroup = new FormGroup({});
  public disableField: boolean = true;

  public imgValue: any;
  public groups: any;
  public groupValue: any;
  private categoryName: string;
  public showLoader: boolean = false;
  constructor(public dialogRef: MatDialogRef<RequestNewComponent>, private formBuilder: FormBuilder, private configService: ConfiguratorService,
    private toastService: ToastService) {

    this.requestNewComponent = this.formBuilder.group({
      familyId: ['', Validators.required],
      otherName: [''],
      componentName: ['', Validators.required],
      attributes: new FormArray([
        this.formBuilder.group({
          name: ['', Validators.required],
          value: ['', Validators.required]
        })
      ]),
      preferredManufacturer: new FormArray([
        this.formBuilder.group({
          preferredName: ['', Validators.required]
        })
      ]),
      image: ['', null],
      remarks: ['', null],
      companyId: [this.configService.companyId, null]
    });
  }

  ngOnInit(): void {
    this.showLoader = true;
    this.requestNewComponent.get('otherName')?.disable()
    this.configService.getCategories().subscribe((res: any) => {
      res.push({ id: 0, name: 'Other Category' });
      this.groups = res;
      this.showLoader = false;
    });

    this.groupName?.valueChanges.subscribe((value: any) => {
      if (value.name === "Other Group") {
        this.requestNewComponent.get('otherName')?.enable();
        this.requestNewComponent.get('otherName')?.setValidators([Validators.required]);
        this.requestNewComponent.updateValueAndValidity();
        this.disableField = false;
      } else {
        this.requestNewComponent.get('otherName')?.disable();
        this.requestNewComponent.get('otherName')?.clearValidators();
        this.requestNewComponent.updateValueAndValidity();
        this.disableField = true;
      }
      this.categoryName = value.name;

    });
  }

  get forms() { return this.requestNewComponent.controls; }
  get attributes() { return this.forms.attributes as FormArray; }
  get attributeFormGroups() { return this.attributes.controls as FormGroup[]; }
  get preferredManufacturer() { return this.forms.preferredManufacturer as FormArray; }
  get preferredManufacturerGroup() { return this.preferredManufacturer.controls as FormGroup[]; }
  get groupName() { return this.requestNewComponent.get('familyId') }

  public close() {
    this.dialogRef.close(false);
  }

  public addAttributes() {

    this.attributes.push(this.formBuilder.group({
      name: ['', null],
      value: ['', null],
    }));

  }

  public addPreferredManuf() {
    this.preferredManufacturer.push(this.formBuilder.group({
      preferredName: ['', Validators.required]
    }))
  }

  public uploadedFile(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imgValue = reader.result as string;
        this.requestNewComponent.patchValue({
          image: reader.result
        });

      };
    }
  }

  public onSubmit() {
    let reqObj = { ...this.requestNewComponent.value }
    const preferredManufacturer = reqObj.preferredManufacturer.map((element: any) => {
      return element.preferredName;
    });
    reqObj.familyName = this.categoryName;
    reqObj.familyId = reqObj.familyId.id;
    reqObj.preferredManufacturer = preferredManufacturer;
    console.log(reqObj);
    this.showLoader = true;
    this.configService.requestComponent(reqObj).subscribe((res: any)=> {
      this.toastService.openSnackBar('Request sent successfully', 'success', 'success-snackbar');
      this.dialogRef.close();
      this.showLoader = false;      
    },
    (error) => {
      this.toastService.openSnackBar(error);
      this.showLoader = false; 
    });
  }
}
