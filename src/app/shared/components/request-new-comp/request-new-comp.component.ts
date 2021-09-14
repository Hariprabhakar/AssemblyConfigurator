import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators,FormArray } from '@angular/forms';
import { ConfiguratorService } from  'src/app/services/configurator.service';

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
  constructor(public dialogRef: MatDialogRef<RequestNewComponent>,private formBuilder: FormBuilder,private configService:ConfiguratorService) {

    this.requestNewComponent = this.formBuilder.group({
      groupName: ['', Validators.required],
      otherName: ['', Validators.required],
      componentName: ['', Validators.required],
      attributes: new FormArray([
        this.formBuilder.group({
          attributeName: ['', Validators.required],
          attributeValue: ['', Validators.required]
        })
      ]),
      preferredManuf: new FormArray([
        this.formBuilder.group({
          preferredName: ['', Validators.required]
        })
      ]),
      fileUpload:['', Validators.required],
      showImage:['',Validators.required],
      remarksField:['',Validators.required]
    });
  }

  ngOnInit(): void {
    this.requestNewComponent.get('otherName')?.disable()
console.log('CONTROLS', this.requestNewComponent.controls);
this.configService.getFamilies().subscribe((res: any)=>{

  console.log('FAMILY', res);
  res.push({id: 11, name:'Other Group'});
  this.groups = res;

});

this.groupName?.valueChanges.subscribe((value: any)=>{


  if(value === "Other Group"){
    this.requestNewComponent.get('otherName')?.enable();
    this.disableField = false;
  }else{
    this.requestNewComponent.get('otherName')?.disable();
    this.disableField = true;
  }

});
  }

  get forms() { return this.requestNewComponent.controls; }
  get attributes() { return this.forms.attributes as FormArray; }
  get attributeFormGroups() { return this.attributes.controls as FormGroup[]; }
  get preferredManufacturer () { return this.forms.preferredManuf as FormArray; }
  get preferredManufacturerGroup() { return this.preferredManufacturer.controls as FormGroup[];}
  get groupName() { return this.requestNewComponent.get('groupName')}

  public close(){
    console.log('C L O S E D');
    this.dialogRef.close(false);
  }

  public addAttributes(){

    this.attributes.push(this.formBuilder.group({
      attributeName: ['', Validators.required],
      attributeValue: ['', Validators.required],
    }));

  }

  public addPreferredManuf(){

    this.preferredManufacturer.push(this.formBuilder.group({
      preferredName: ['', Validators.required]
    }))
  }

  public uploadedFile(event: any){

    console.log('EVENT', event);
    console.log('IMG', this.requestNewComponent.controls.showImage.value);

    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imgValue = reader.result as string;
        this.requestNewComponent.patchValue({
          showImage: reader.result
        });

      };
    }
  }

  public onSubmit(){

    console.log('FORM VALUES',this.requestNewComponent.value);
  }
}
