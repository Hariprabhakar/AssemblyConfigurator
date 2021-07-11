import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { ConfiguratorService } from 'src/app/services/configurator.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-assembly-icon-modal',
  templateUrl: './assembly-icon-modal.component.html',
  styleUrls: ['./assembly-icon-modal.component.scss']
})
export class AssemblyIconModalComponent implements OnInit {
  private companyId: any;
  public assembliesData: any;
  private familyId: any;
  public icon: any;
  public imageSrc: any;
  public selectedValue: any;
  public selectedShape: any;
  public iconText: any;
  public existingAssembly: any;
  public addIcon: boolean = false;
  public enableAdd: boolean = true;
  public isAssemblyNameError: boolean = false;
  public symbolTextError = false;
  public symbolShapeError = false;
  public abbreviationError = false;
  public abbreviation: string;
  public iconImages: any = [
    {
      name: 'Star',
      value: 'star'
    },
    {
      name: 'Circle',
      value: 'circle'
    },
    {
      name: 'Oval',
      value: 'oval'
    },
    {
      name: 'Square',
      value: 'square'
    },
    {
      name: 'Rectangle',
      value: 'rectangle'
    },
    {
      name: 'Triangle',
      value: 'triangle'
    },
    {
      name: 'Polygon',
      value: 'polygon'
    }
  ];
  constructor(private configuratorService: ConfiguratorService, private toastService: ToastService, public dialogRef: MatDialogRef<AssemblyIconModalComponent>) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.companyId = this.configuratorService.companyId;
    // this.familyId = this.configuratorService.getAssemblyData().familyId;
    this.familyId = 1;
    this.abbreviation = this.configuratorService.getAssemblyData()?.abbreviation;
    if(!this.abbreviation) {
      this.abbreviation = this.configuratorService.getAssemblyFormValue()?.abbreviation;
    }
    this.getAssemblies();
  }

  getAssemblies() {
    this.configuratorService.getAssemblies(this.companyId, this.familyId, false, false).subscribe(
      (res) => {
        this.assembliesData = res;
      },
      (error: any) => {
        this.toastService.openSnackBar(error);
      }
    );
  }

  public preview() {
    switch (this.selectedValue) {
      case '1':
        if (this.abbreviation) {
          this.createDeviceIdIcon();
        } else {
          this.abbreviationError = true;
        }
        break;
      case '2':
        if (this.existingAssembly) {
          this.chooseExistingIcon();
        } else {
          this.isAssemblyNameError = true;
        }
        break;
      case '3':
        if (this.selectedShape && this.iconText) {
          this.createWithShape();
        } else {
          if (!this.selectedShape) {
            this.symbolShapeError = true;
          }
          if (!this.iconText) {
            this.symbolTextError = true;
          }
        }
        break;
      default:
        break;
    }
  }

  private createDeviceIdIcon() {
    this.createIcon(this.abbreviation, 'circle');
  }

  private chooseExistingIcon() {
    let isAssemblyIcon = this.assembliesData.some((assembly: any) => {
      if (assembly.id == this.existingAssembly && assembly.icon) {
        this.imageSrc = 'data:image/jpeg;base64,' + assembly.icon;
        return true;
      } else {
        return false;
      }
    });

    if (this.addIcon && isAssemblyIcon) {
      this.dialogRef.close(this.imageSrc);
    }
    this.addIcon = false;
  }

  private createWithShape() {
    this.createIcon(this.iconText, this.selectedShape);
  }

  createIcon(text: string, shape: string) {
    this.icon = document.createElement('canvas');
    let width: number = 100;
    this.icon.width = width;
    this.icon.height = width;
    this.icon.style.width = width;
    this.icon.style.height = width;
    const iconImage = this.icon.getContext('2d');
    iconImage.fillStyle = '#262626';
    const image = new Image();
    image.onload = (_) => {
      if (shape == 'oval' || shape == 'rectangle') {
        iconImage.drawImage(image, 0, 15, width, 70); // left,top,height,width
      } else {
        iconImage.drawImage(image, 0, 0, width, width); // left,top,height,width
      }
      iconImage.textBaseline = 'middle';
      iconImage.textAlign = 'center';
      iconImage.font = 'bold 24px sans-serif';
      iconImage.fillStyle = '#787878';
      iconImage.fillText(text, width / 2, width / 2);
      this.imageSrc = this.icon.toDataURL('image/jepg', 0.9);
      if (this.addIcon) {
        this.dialogRef.close(this.imageSrc);
        this.addIcon = false;
      }
    };
    image.src = `assets/images/${shape}.svg`;
  }

  public closeModal() {
    this.addIcon = true;
    this.preview();
  }

  public cancelModal() {
    this.dialogRef.close(false);
  }

  public radioChange(event: MatRadioChange) {
    this.enableAdd = false;
    this.isAssemblyNameError = false;
    this.symbolTextError = false;
    this.symbolShapeError = false;
    this.abbreviationError = false;
  }

  public getExistingAssemblyName(id: number) {
    if (this.assembliesData) {
      const assemblydata = this.assembliesData.find((assembly: any) => {
        return assembly.id == id;
      });
      return assemblydata?.name;
    }
  }
}
