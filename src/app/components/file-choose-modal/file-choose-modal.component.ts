import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-file-choose-modal',
  templateUrl: './file-choose-modal.component.html',
  styleUrls: ['./file-choose-modal.component.scss']
})
export class FileChooseModalComponent implements OnInit {
  public FileChooseFrom: FormGroup = this.formBuilder.group({
    inputText: ['', Validators.required], 
    fileupload: ['', Validators.required], 
  });
  public fileObj : any;

  constructor(public fileChoose: MatDialogRef<FileChooseModalComponent>,  @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,) {
     this.fileObj = {
      imageList: [],
      inputText: '',
    };
    
   }

  ngOnInit(): void {
  }

  public async handleFileInput(event: any)  {
    // this.fileToUpload = files.item(0);
    console.log('this.fileToUpload', event);
    const file = event.target.files[0];
    console.log(await this.getBase64(file));
  }

  public getBase64(file: any) {
    var that = this;
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result); 
      that.closePopup(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }

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
    console.log('value', this.fileObj); 
    this.fileObj.imageList[0].inputText = this.FileChooseFrom.value.inputText;
    this.fileChoose.close(this.fileObj);
}
 }

}
