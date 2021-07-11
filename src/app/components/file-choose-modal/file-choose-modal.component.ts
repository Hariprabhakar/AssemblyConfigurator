import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
@Component({
  selector: 'app-file-choose-modal',
  templateUrl: './file-choose-modal.component.html',
  styleUrls: ['./file-choose-modal.component.scss']
})
export class FileChooseModalComponent implements OnInit {
  public maxFileError: string;
  public isMaxFileError: boolean;
  public uploadedFiles: any;
  public filesToUpload: number;
  public tempUploads: any;
  public primaryImgNotSet: string;
  public isPrimaryImgNotSet: boolean;
  public maxImageSizeExceeded: boolean;
  public maxLimitExieedFiles: any;
  public isInValidFileExtension: boolean;
  public inValidFileExtension: any;
  public setDefaultBtn: boolean;
  public selectedID:number;
  public showCloseAlert: boolean;
  public showFirstView: boolean;
  public FileChooseFrom: FormGroup = this.formBuilder.group({
      fileupload: [''],
  });

  files: File[] = [];

  public FileChooseFrom1: FormGroup = this.formBuilder.group({ // this form is for first view
    fileupload1: [''],
  });
  public selectedImagedetailsToDelete: any;

  constructor(public fileChoose: MatDialogRef < FileChooseModalComponent > , @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private cd: ChangeDetectorRef,
  public dialog: MatDialog) {
      this.maxFileError = '';
      this.isMaxFileError = false;
      this.tempUploads = [];
      this.filesToUpload = 0;
      this.primaryImgNotSet = '';
      this.isPrimaryImgNotSet = false;
      this.isMaxFileError = false;
      this.maxImageSizeExceeded = false;
      this.maxLimitExieedFiles = [];
      this.isInValidFileExtension = false;
      this.inValidFileExtension = [];
      fileChoose.disableClose = true;
      this.setDefaultBtn = true;
      this.selectedID = -1;
      this.showCloseAlert = false;
      this.showFirstView = false;
      this.selectedImagedetailsToDelete = {
        file: {},
        index: 0
      }

  }

  ngOnInit(): void {
      this.updateViews(); //Function to update the view based on already uplodaed images in the page
      let isDefaultSet = this.data.filter((value: any, key: number) => value.isDefault === true);
      isDefaultSet = isDefaultSet.length !== 0 ? true : false;
      if (this.data.length === 0) {
        this.showFirstView = true;
      } 
      if (!isDefaultSet && this.data.length !== 0) {
        this.data[0].isDefault = true;
      }
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

  onSelect(event:any) {
    this.files.push(...event.addedFiles);
    this.handleFileUpload(event?.addedFiles);
  }
  
  onRemove(event:any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  
  /** Function to Handle file upload
   * @memberOf FileChooseModalComponent
   */
  public async handleBrowseFiles(event: any) {
     this.handleFileUpload(event?.target?.files);
  }



  /** Function to Handle file upload
   * @memberOf FileChooseModalComponent
   */
   public async handleFileUpload(files: any) {
    this.showFirstView = false;
      this.filesToUpload = 5 - ((this.data.length || 0) + (this.tempUploads.length || 0));
      const fileLength = files.length;
      const maxfileLength = this.filesToUpload ;
      if (fileLength < (maxfileLength + 1)) {
        await this.getBase64ConvertedData(files);
        this.initVariables();
          for (let i = 0; i < files.length; i++) {
            let size = files[i].size; 
            let name = files[i].name; 
            const isSizeExeeded = this.isFilesizeExeeded(size);
            const isValidExtension = this.validateFileExtension(name);
            if (!isSizeExeeded && isValidExtension) { // Success Flow
              // this.items.push(this.formBuilder.control('', Validators.required));
              console.log('on file select', 'add to this.data');
              this.onSubmit();
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

    this.isMaxFileError = false;
  }

  // Function converts file to base64 formate 
  public async getBase64ConvertedData(files: any) {
    const finalData:any = await this.tobase64Handler(files);
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

    // if ((this.maxLimitExieedFiles.length !== 0 && this.tempUploads.length === 0)) {

    // }

    if (this.inValidFileExtension.length !== 0) {
      this.isInValidFileExtension = true;
    }

    // if ((this.inValidFileExtension.length !== 0 && this.tempUploads.length === 0)) {

    // }
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
                  fileName64Bit: reader.result,
                  inputText: file.name.substring(0,file.name.indexOf('.'))
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
     // if (this.FileChooseFrom.valid) {
          this.clearMaxFileSizeError();
          this.clearInvalidFileExtensionError();
        //  let finalData: any = [];
        //   this.tempUploads.forEach((value: any, key: number) => {
        //       const obj = {
        //           fileName: '',
        //           fileName64Bit: '',
        //           inputText: '',
        //           isPrimary: false
        //       };
        //       obj.fileName = value.fileName,
        //           obj.fileName64Bit = value.fileName64Bit,
        //           obj.inputText = this.FileChooseFrom.value.items[key]
        //       finalData.push(obj);
        //   });
        //  finalData = finalData.concat(this.data);
         if (this.data.length === 0) {
          this.tempUploads[0].isDefault = true;
         }
          this.data = this.data.concat(this.tempUploads);
          this.updateViews();

          // this.FileChooseFrom.reset();

          // const control = <FormArray>this.FileChooseFrom.controls['items'];
          // for(let i = control.length-1; i >= 0; i--) {
          //   control.removeAt(i)
          // }
          this.tempUploads = [];
          // this.fileChoose.close(finalData);
    //  } 

  }


  /** Function to handle close button
   * @memberOf FileChooseModalComponent
   */
  public closeUploadedFiles(file: any, index: number) {
     this.selectedImagedetailsToDelete.file = file;
     this.selectedImagedetailsToDelete.index = index;
     // confirmation dialog
     const confirmationDialog = this.dialog.open(ConfirmationModalComponent, {
      data: {
        title: 'Delete Image',
        content: 'Are you sure you want to Delete Image?? '
      }
    });
    confirmationDialog.afterClosed().subscribe(result => {
      if (result === true) {
       this.cancelBtnYesActionClick();
      }
    });
    // this.showCloseAlert = true;
  }

  /** Function to handle close button
   * @memberOf FileChooseModalComponent
   */
  public closeBtnClick() {
    this.maxFileError = "";

    let isPrimarySet = this.data.filter((value: any, key: number) => value.isDefault === true);
    isPrimarySet = isPrimarySet.length !== 0 ? true : false;
      if (!isPrimarySet) {
        this.primaryImgNotSet = "Please set primary image";
        this.isPrimaryImgNotSet = true;
      } else {
        this.fileChoose.close(this.data);
      }
  }

  /** Function to update the view based on already uplodaed images in the page
   * @memberOf FileChooseModalComponent Component
   */
  public updateViews(){ 
    // if(this.data.length === 1) {
    //   // this.showSelectedFiles = true;
    // } else 
    if(this.data.length === 0) {
      this.filesToUpload = 5;
    } else {
        // this.showSelectedFiles = true;
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


  public setDefaultImage() {
    this.data.forEach((value: any, key: number) => {
      if (key === this.selectedID) {
        this.data[this.selectedID].isDefault = true;
      } else {
        this.data[key].isDefault = false;
      }
    });
    this.setDefaultBtn = true;
  }

  public selectCard(file: any, index: number) {
    this.selectedID = index;
    
    if (file?.isDefault) {
      this.setDefaultBtn = true;
    } else {
      this.setDefaultBtn = false;
    }
    
  }

  public cancelBtnClick(){
    this.showCloseAlert = true;
  }

  public cancelBtnYesActionClick(){
    const index = this.selectedImagedetailsToDelete.index;
    const file = this.selectedImagedetailsToDelete.file;
    this.maxFileError = "";
      this.data = this.data.filter((value: any, key: number) => key !== index);
      this.cd.markForCheck();
      if (file?.isDefault) {
        
        try {
          this.data[index].isDefault = true;
        } catch {
          const data = this.data[0];
          if (data) { 
            this.data[0].isDefault = true;
          }
        }
      }
      
      this.updateViews();
      this.showCloseAlert = false;
  }

  public cancelBtnNoActionClick(){
    this.showCloseAlert = false;
  }

 


}