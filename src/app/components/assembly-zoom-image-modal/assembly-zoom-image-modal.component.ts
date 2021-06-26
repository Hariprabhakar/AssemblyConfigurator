import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-assembly-zoom-image-modal',
  templateUrl: './assembly-zoom-image-modal.component.html',
  styleUrls: ['./assembly-zoom-image-modal.component.scss']
})
export class AssemblyZoomImageModalComponent implements OnInit {
  public zoomImage: any;
  constructor(private dialogRef: MatDialogRef<AssemblyZoomImageModalComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.zoomImage = this.data.addPosition;  
  }

}
