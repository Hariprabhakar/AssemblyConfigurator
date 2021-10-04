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
  public selectedCategory: any;
  private categoryName: string;
  public showLoader: boolean = false;
  constructor(public dialogRef: MatDialogRef<RequestNewComponent>, private formBuilder: FormBuilder, private configService: ConfiguratorService,
    private toastService: ToastService,
    // private subscription:Subscription
    ) {

    this.requestNewComponent = this.formBuilder.group({
      categoryId: ['', Validators.required],
      otherCategoryName: [''],
      componentName: ['', Validators.required],
      attributes: new FormArray([
        this.formBuilder.group({
          name: ['', Validators.required],
          value: ['', Validators.required]
        })
      ]),
      preferredManufacturers: new FormArray([
        this.formBuilder.group({
          preferredName: ['', Validators.required]
        })
      ]),
      images: ['', null],
      remarks: ['', null],
      companyId: [this.configService.companyId, null]
    });
  }

  ngOnInit(): void {
    this.showLoader = true;
    this.requestNewComponent.get('otherCategoryName')?.disable();
    this.configService.getCategories().subscribe((res: any) => {
      res.push({ id: 0, name: 'Other Category' });
      this.groups = res;
      this.showLoader = false;
      const indx = this.groups.findIndex((element: any) => {
        return element.id == this.configService.selectedCategory.id;
      });
      this.requestNewComponent.patchValue({
        categoryId: this.groups[indx]
      });
    });

    this.groupName?.valueChanges.subscribe((value: any) => {
      if (value.name === "Other Category") {
        this.requestNewComponent.get('otherCategoryName')?.enable();
        this.requestNewComponent.get('otherCategoryName')?.setValidators([Validators.required]);
        this.requestNewComponent.updateValueAndValidity();
        this.disableField = false;
      } else {
        this.requestNewComponent.get('otherCategoryName')?.disable();
        this.requestNewComponent.get('otherCategoryName')?.clearValidators();
        this.requestNewComponent.updateValueAndValidity();
        this.disableField = true;
      }
      this.categoryName = value.name;

    });
    
  }

  get forms() { return this.requestNewComponent.controls; }
  get attributes() { return this.forms.attributes as FormArray; }
  get attributeFormGroups() { return this.attributes.controls as FormGroup[]; }
  get preferredManufacturers() { return this.forms.preferredManufacturers as FormArray; }
  get preferredManufacturerGroup() { return this.preferredManufacturers.controls as FormGroup[]; }
  get groupName() { return this.requestNewComponent.get('categoryId') }

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
    this.preferredManufacturers.push(this.formBuilder.group({
      preferredName: ['', Validators.required]
    }))
  }

  public deleteAttrVal() {
    if(this.attributes.length > 1){
      this.attributes.removeAt(this.attributes.length-1);
    }

  }

  public deleteprefVal() {
    if(this.preferredManufacturers.length > 1){
      this.preferredManufacturers.removeAt(this.preferredManufacturers.length-1);
    }
  }

  public deleteImg(){
    this.imgValue = "";
  }

  public uploadedFile(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imgValue = reader.result as string;
        this.requestNewComponent.patchValue({
          images: reader.result
        });

      };
    }
  }

  public onSubmit() {
    let reqObj = { ...this.requestNewComponent.value }
    const preferredManufacturers = reqObj.preferredManufacturers.map((element: any) => {
      return element.preferredName;
    });
    reqObj.categoryName = this.categoryName;
    reqObj.categoryId = this.categoryName === 'Other Category' ? null : reqObj.categoryId.id;
    reqObj.preferredManufacturers = preferredManufacturers;
    const index = reqObj.images.indexOf('base64,') + 7;
    reqObj.images = [reqObj.images.substring(index)];
    if (this.configService.userId) {
      reqObj.userId = this.configService.userId;
    }
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
