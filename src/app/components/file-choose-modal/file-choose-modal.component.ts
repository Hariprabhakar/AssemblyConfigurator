import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
@Component({
  selector: 'app-file-choose-modal',
  templateUrl: './file-choose-modal.component.html',
  styleUrls: ['./file-choose-modal.component.scss']
})
export class FileChooseModalComponent implements OnInit { 

  // public FileChooseFrom: FormGroup = this.formBuilder.group({
  //   // inputText: ['', Validators.required], 
  //   // fileupload: ['', Validators.required], 
  //   // 0: ['', Validators.required], 
  //   // 1: ['', Validators.required], 
  //   // 2: ['', Validators.required], 
  //   fileUplod: this.formBuilder.array([
  //         // fileupload: ['', Validators.required], 
  //   ])
  // },{updateOn:'submit'});
  public fileObj : any;
  public maxFileError: string;
  public isMaxFileError: boolean;
  public uploadedFiles: any;
  public showSelectedFiles: boolean;
  public showUplodingFiles: boolean;
  public filesToUpload: number;
  public tempUploads: any;
  public FileChooseFrom: FormGroup =  this.formBuilder.group({
    fileupload: ['', Validators.required], 
    items: this.formBuilder.array([]),
  });
  constructor(public fileChoose: MatDialogRef<FileChooseModalComponent>,  @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,) {
     this.fileObj = {
      imageList: [],
      inputText: '',
    };
    this.maxFileError = '';
    this.isMaxFileError = false;
    this.uploadedFiles = [];
    this.showSelectedFiles = false; 
    this.showUplodingFiles = true;
    this.tempUploads = [];
    this.filesToUpload = 0;
   }

  ngOnInit(): void {
    // this.FileChooseFrom = this.formBuilder.group({
    //   fileupload: ['', Validators.required], 
    // })
    if (this.data.length === 0) {
      this.filesToUpload = 3;
    } else {
      this.showSelectedFiles = true
      this.filesToUpload = 3 - this.data.length;
    }
    
   
  
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




  public async handleFileInput(event: any)  {
    
    // this.fileToUpload = files.item(0);
    console.log('this.filesToUpload Before',  this.filesToUpload);
    this.filesToUpload = this.filesToUpload - event.target.files.length;
    console.log('this.filesToUpload After',  this.filesToUpload);

    
    const fileLength = event.target.files.length;
    if (fileLength < 4) {
      this.isMaxFileError = false;
      this.uploadedFiles = event.target.files;
      for (let i=0; i < event.target.files.length; i++) {
        console.log('in loop');
        this.items.push(this.formBuilder.control('', Validators.required)); 
      }
      // await this.getBase64(file)
    } else {
      this.maxFileError = 'User can upload only Maximum three files';
      this.isMaxFileError = true;
    }
    
  //   event.target.files.forEach((key:any, value:any) => {
  //     console.log('key', key);
  //     console.log('value', value);
  // });
  // const uploadedFiles = [];
  // const that = this;
  // Array.prototype.forEach.call(event.target.files, async function(file) { 
  //   let fileObj = {
  //     fileName: '', 
  //     fileName64bit: '', 
  //     systemName: '', 

  //   };
  //   const fileData = await that.getFileData(file);
  //   console.log('file', that.tempUploads);
  //   console.log('fileData', fileData);
  //  });

  

  const finalData = await this.tobase64Handler(event.target.files);
  this.tempUploads = this.tempUploads.concat(finalData);
  console.log('FormData', this.FileChooseFrom);
  console.log('finalData', finalData);
  console.log('this.tempUploads', this.tempUploads);
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
    const filePathsPromises:any = [];
    const that = this;

    Array.prototype.forEach.call(files, async function(file) {
      filePathsPromises.push(that.toBase64(file));
    });
    const filePaths = await Promise.all(filePathsPromises);
    const mappedFiles = filePaths.map((base64File) => (base64File));
    return mappedFiles;
  }

//   public getFileData(file: any) {
//     var that = this;
//     var reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = function () {
//       console.log(reader.result); 
//       // that.closePopup(reader.result);
//       const fileObj = {
//         fileName: file.name, 
//         fileName64Bit: reader.result
//       };
//       console.log('Excuted');
//       that.tempUploads(fileObj);
//     };
//     reader.onerror = function (error) {
//       console.log('Error: ', error);
//     };
//  }

 public closePopup(value:any) {
  //  this.fileChoose = value;
  let fileObj = {
    fileName: value,
    id: 0,
    inputtext: '' 

  }
  console.log('data', this.data);
  if (this.data.imageList !== null && this.data.imageList !== undefined) {
    fileObj.id= this.data.imageList.length + 1;
  } else {
    fileObj.id = 1;
  }

  this.fileObj.imageList.push(fileObj);
  // this.fileObj.filename = value || '';
  const inputFiledValue = this.FileChooseFrom.value;
  console.log('inputFiledValue', inputFiledValue);
  this.fileObj.inputText = inputFiledValue.inputText || '';
  // this.fileChoose.close(fileObj);
 }

 public onSubmit() {
  if (this.FileChooseFrom.valid) {
    let finalData:any = [];
    this.tempUploads.forEach((value:any, key:any) => {
      const obj = {
        fileName: '',
        fileName64Bit: '', 
        inputText: ''
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
    this.fileChoose.close(finalData);
}
 }

}
