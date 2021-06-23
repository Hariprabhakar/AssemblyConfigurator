import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
@Component({
  selector: 'app-file-choose-modal',
  templateUrl: './file-choose-modal.component.html',
  styleUrls: ['./file-choose-modal.component.scss']
})
export class FileChooseModalComponent implements OnInit {
  public fileObj: any;
  public maxFileError: string;
  public isMaxFileError: boolean;
  public uploadedFiles: any;
  public showSelectedFiles: boolean;
  public showUplodingFiles: boolean;
  public filesToUpload: number;
  public tempUploads: any;
  public showAddBtn: boolean;
  public primaryImgNotSet: string;
  public isPrimaryImgNotSet: boolean;
  public FileChooseFrom: FormGroup = this.formBuilder.group({
      fileupload: [''],
      items: this.formBuilder.array([]),
  });
  public showEditPrimaryImage: boolean;
  constructor(public fileChoose: MatDialogRef < FileChooseModalComponent > , @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, ) {
      this.fileObj = {
          imageList: [],
          inputText: '',
      };
      this.maxFileError = '';
      this.isMaxFileError = false;
      this.showSelectedFiles = false;
      this.showUplodingFiles = true;
      this.tempUploads = [];
      this.filesToUpload = 0;
      this.showEditPrimaryImage = false;
      this.showAddBtn = false;
      this.primaryImgNotSet = '';
      this.isPrimaryImgNotSet = false;

  }

  ngOnInit(): void {
      if (this.data.length === 0) {
          this.filesToUpload = 3;
      } else {
          this.showSelectedFiles = true
          this.filesToUpload = 3 - this.data.length;
      }
      this.updateViews();
  }

  get items(): FormArray {
      return this.FileChooseFrom.get('items') as FormArray;
  }

  public addFormFields() {
      return this.formBuilder.group({
          fileupload: ['', Validators.required],
      })
  }

  public createItem() {
      return this.formBuilder.control({
          0: ['', Validators.required],
      })
  }


  public async handleFileInput(event: any) {
     
      this.filesToUpload = 3 - ((this.data.length || 0) + (this.tempUploads.length || 0));
      this.isMaxFileError = false;
      const fileLength = event.target.files.length;
      const maxfileLength = 3 - ((this.data.length || 0) + (this.tempUploads.length || 0));
      if (fileLength < (maxfileLength + 1)) {
         this.showAddBtn = true;
          this.isMaxFileError = false;
          const finalData = await this.tobase64Handler(event.target.files);
          this.tempUploads = this.tempUploads.concat(finalData);
          console.log('FormData', this.FileChooseFrom);
          console.log('finalData', finalData);
          console.log('this.tempUploads', this.tempUploads);
          for (let i = 0; i < event.target.files.length; i++) {
            console.log('in loop');
            this.items.push(this.formBuilder.control('', Validators.required));
        }
      } else {
          this.maxFileError = 'User can upload only Maximum three files';
          this.isMaxFileError = true;
      }


  }

  public toBase64(file: any) {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
              const fileObj = {
                  fileName: file.name,
                  fileName64Bit: reader.result
              };
              resolve(fileObj);
          }
          reader.onerror = error => reject(error);
      });
  };

  async tobase64Handler(files: any) {
      const filePathsPromises: any = [];
      const that = this;

      Array.prototype.forEach.call(files, async function(file) {
          filePathsPromises.push(that.toBase64(file));
      });
      const filePaths = await Promise.all(filePathsPromises);
      const mappedFiles = filePaths.map((base64File) => (base64File));
      return mappedFiles;
  }


  public onSubmit() {

      if (this.FileChooseFrom.valid) {
          let finalData: any = [];
          this.tempUploads.forEach((value: any, key: any) => {
              const obj = {
                  fileName: '',
                  fileName64Bit: '',
                  inputText: '',
                  isPrimary: false
              };
              obj.fileName = value.fileName,
                  obj.fileName64Bit = value.fileName64Bit,
                  obj.inputText = this.FileChooseFrom.value.items[key]
              finalData.push(obj);
              console.log('key', key);
              console.log('value', value);
          });
          finalData = finalData.concat(this.data);
          console.log('finalvalue', finalData);
          console.log('this.data', this.data);
          this.data = finalData;
          this.updateViews();
          this.showAddBtn = false;
          this.FileChooseFrom.reset();

          const control = <FormArray>this.FileChooseFrom.controls['items'];
          for(let i = control.length-1; i >= 0; i--) {
            control.removeAt(i)
          }
          this.tempUploads = [];
          // this.fileChoose.close(finalData);
      } 

  }



  public closeUploadedFiles(file: any, index: number) {
      this.maxFileError = "";
      this.data = this.data.filter((value: any, key: number) => key !== index);
      this.updateViews();
  }

  public closeTempFiles(file: any, index: number) {
    this.tempUploads = this.tempUploads.filter((value: any, key: number) => key !== index);
    this.updateViews();
  }

  public closeBtnClick() {
    this.maxFileError = "";

    let isPrimarySet = this.data.filter((value: any, key: number) => value.isPrimary === true);
    isPrimarySet = isPrimarySet.length !== 0 ? true : false;
    if (!isPrimarySet) {
      this.primaryImgNotSet = "Please set primary image";
      this.isPrimaryImgNotSet = true;
    } else {
      this.fileChoose.close(this.data);
    }
    this.showAddBtn = false;
  }

  public updateViews(){
    let isPrimarySet = this.data.filter((value: any, key: number) => value.isPrimary === true);
    isPrimarySet = isPrimarySet.length !== 0 ? true : false;
    if(this.data.length === 1) {
      this.showSelectedFiles = true;
      this.data[0].isPrimary = true;
      this.showEditPrimaryImage = false;
    } else if (this.data.length !== 0) {
      this.showSelectedFiles = true;
      this.showEditPrimaryImage = isPrimarySet ? false : true;
    } else {
      this.showEditPrimaryImage = false;
    }
  }

  public radioChange(index:number) {
    this.data.forEach((value: any, key: any) => {
        if (index === key) {
          this.data[key].isPrimary = true;
        } else {
          this.data[key].isPrimary = false;
        }
    });
    this.showEditPrimaryImage = false;
    this.isPrimaryImgNotSet = false;
  }

  public chnagePrimaryBtn() {
    this.data.forEach((value: any, key: any) => {
      this.data[key].isPrimary = false;
    });
    this.showEditPrimaryImage = true;
  }
 
}