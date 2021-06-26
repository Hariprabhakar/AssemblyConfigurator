import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
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
  public filesToUpload: number;
  public tempUploads: any;
  public showAddBtn: boolean;
  public primaryImgNotSet: string;
  public isPrimaryImgNotSet: boolean;
  public maxImageSizeExceeded: boolean;
  public maxLimitExieedFiles: any;
  public isInValidFileExtension: boolean;
  public inValidFileExtension: any;
  public FileChooseFrom: FormGroup = this.formBuilder.group({
      fileupload: [''],
      items: this.formBuilder.array([]),
  });

  constructor(public fileChoose: MatDialogRef < FileChooseModalComponent > , @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private cd: ChangeDetectorRef) {
      this.fileObj = {
          imageList: [],
          inputText: '',
      };
      this.maxFileError = '';
      this.isMaxFileError = false;
      this.showSelectedFiles = false;
      this.tempUploads = [];
      this.filesToUpload = 0;
      this.showAddBtn = false;
      this.primaryImgNotSet = '';
      this.isPrimaryImgNotSet = false;
      this.isMaxFileError = false;
      this.maxImageSizeExceeded = false;
      this.maxLimitExieedFiles = [];
      this.isInValidFileExtension = false;
      this.inValidFileExtension = [];

  }

  ngOnInit(): void {
      this.updateViews(); //Function to update the view based on already uplodaed images in the page
  }

  get items(): FormArray { // Get Dynamically injected form fields
      return this.FileChooseFrom.get('items') as FormArray;
  }

  /** Function to Dynamically inject form fields
   * @memberOf FileChooseModalComponent
   */
  public addFormFields() {
      return this.formBuilder.group({
          fileupload: ['', Validators.required],
      })
  }

  
  /** Function to Handle file upload
   * @memberOf FileChooseModalComponent
   */
  public async handleFileInput(event: any) {
      this.filesToUpload = 5 - ((this.data.length || 0) + (this.tempUploads.length || 0));
      const fileLength = event.target.files.length;
      const maxfileLength = this.filesToUpload ;
      if (fileLength < (maxfileLength + 1)) {
        await this.getBase64ConvertedData(event.target.files);
        this.initVariables();
          for (let i = 0; i < event.target.files.length; i++) {
            let size = event.target.files[i].size; 
            let name = event.target.files[i].name; 
            const isSizeExeeded = this.isFilesizeExeeded(size);
            const isValidExtension = this.validateFileExtension(name);
            if (!isSizeExeeded && isValidExtension) { // Success Flow
              this.items.push(this.formBuilder.control('', Validators.required));
            } else { // Error Flow
              this.handleErrors(isSizeExeeded, isValidExtension, name);
            }
          }
          this.handleViews(); // Update veiws to show errors 
      } else {
          this.maxFileError = 'Maximum Five files can be uploaded';
          this.isMaxFileError = true;
      }
  }

  // Clear Error falgs for previously updated files 
  public clearPreviousErrors() {
    this.isMaxFileError = false;
    this.clearMaxFileSizeError();
    this.clearInvalidFileExtensionError();
  }

  // Clear Max File Sizse Error falgs for previously updated files 
  public clearMaxFileSizeError() {
    this.isMaxFileError = false;
    this.maxLimitExieedFiles = [];
  }
  
  // Clear Invalde File Sizse Error falgs for previously updated files 
  public clearInvalidFileExtensionError() {
    this.isInValidFileExtension = false;
    this.inValidFileExtension = [];
  }

  // Init Variables 
  public initVariables() {
    this.maxLimitExieedFiles = [];
    this.inValidFileExtension = [];
    this.showAddBtn = true;
    this.isMaxFileError = false;
  }

  // Function converts file to base64 formate 
  public async getBase64ConvertedData(files: any) {
    const finalData = await this.tobase64Handler(files);
    this.tempUploads = this.tempUploads.concat(finalData);
  }

  // Function converts file to base64 formate 
  public handleErrors(isSizeExeeded:any, isValidExtension:any, fileName:string) {
    if (isSizeExeeded) {
      this.maxLimitExieedFiles.push(fileName);
    }
    if (!isValidExtension) {
      this.inValidFileExtension.push(fileName);
    }
  }
  
  
  // Function to handle Views to show errors
  public handleViews() {
    if (this.maxLimitExieedFiles.length !== 0) {
      this.maxImageSizeExceeded = true;
    } 

    if ((this.maxLimitExieedFiles.length !== 0 && this.tempUploads.length === 0)) {
      this.showAddBtn = false;
    }

    if (this.inValidFileExtension.length !== 0) {
      this.isInValidFileExtension = true;
    }

    if ((this.inValidFileExtension.length !== 0 && this.tempUploads.length === 0)) {
      this.showAddBtn = false;
    }
  }

    
  /** Function to validate Max file size
   * @memberOf FileChooseModalComponent
   */
  public isFilesizeExeeded(size: any) {
    let isSizeExeeded = false;
    size = Math.round((size / 1024));
    isSizeExeeded = (size > 2048) ? true :false;
    return isSizeExeeded
    
  }

    /** Function to validate File type
   * @memberOf FileChooseModalComponent
   */
  public validateFileExtension(fileName: any) {
    let isValidExtension = true;
    const fname = fileName;
    const re = /(\.jpg|\.jpeg|\.gif|\.png|\.tif)$/i;
    if (!re.exec(fname)) {
      isValidExtension = false;
    }
    return isValidExtension;
  }

  /** Function to convert base64
   * @memberOf FileChooseModalComponent
   */
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

      Array.prototype.forEach.call((files), async function(file, key) {
        const size = files[key].size; 
        let name = files[key].name; 
        const isSizeExeeded = that.isFilesizeExeeded(size);
        const isValidExtension = that.validateFileExtension(name);
        if (!isSizeExeeded && isValidExtension) {
          filePathsPromises.push(that.toBase64(file));
        }
          
      });
      const filePaths = await Promise.all(filePathsPromises);
      const mappedFiles = filePaths.map((base64File) => (base64File));
      return mappedFiles;
  }

  /** Function to handle Add Images form
   * @memberOf FileChooseModalComponent
   */
  public onSubmit() {
      if (this.FileChooseFrom.valid) {
          this.clearMaxFileSizeError();
          this.clearInvalidFileExtensionError();
          let finalData: any = [];
          this.tempUploads.forEach((value: any, key: number) => {
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
          });
         finalData = finalData.concat(this.data);
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


  /** Function to handle close button
   * @memberOf FileChooseModalComponent
   */
  public closeUploadedFiles(file: any, index: number) {
      this.maxFileError = "";
      this.data = this.data.filter((value: any, key: number) => key !== index);
      this.cd.markForCheck();
      this.updateViews();
  }

  /** Function to handle close button
   * @memberOf FileChooseModalComponent
   */
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

  /** Function to update the view based on already uplodaed images in the page
   * @memberOf FileChooseModalComponent Component
   */
  public updateViews(){ 
    if(this.data.length === 1) {
      this.showSelectedFiles = true;
    } else if(this.data.length === 0) {
      this.filesToUpload = 5;
    } else {
        this.showSelectedFiles = true
        this.filesToUpload = 5 - this.data.length;
    }
  }

  
  /** Function to hanle radio button chnage
   * @memberOf FileChooseModalComponent Component
   */
  public radioChange(index:number) {
    this.data.forEach((value: any, key: number) => {
        if (index === key) {
          this.data[key].isPrimary = true;
        } else {
          this.data[key].isPrimary = false;
        }
    });
    this.isPrimaryImgNotSet = false;
  }

}