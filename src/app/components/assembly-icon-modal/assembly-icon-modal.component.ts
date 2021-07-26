import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfiguratorService } from 'src/app/services/configurator.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { environment } from 'src/environments/environment';

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
  public baseUrl: string = '';
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
  constructor(private configuratorService: ConfiguratorService, private toastService: ToastService, public dialogRef: MatDialogRef<AssemblyIconModalComponent>,
    public sanitizer: DomSanitizer) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.companyId = this.configuratorService.companyId;
    this.baseUrl = environment.url;
    // this.familyId = this.configuratorService.getAssemblyData().familyId;
    // this.familyId = 1;
    this.abbreviation = this.configuratorService.getAssemblyData()?.abbreviation;
    if (!this.abbreviation) {
      this.abbreviation = this.configuratorService.getAssemblyFormValue()?.abbreviation;
    }
    this.getAssemblies();
  }

  getAssemblies() {
    this.configuratorService.getAssemblies(this.companyId, this.familyId, true, true).subscribe(
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
    this.createSvgIcon(this.abbreviation, 'circle');
  }

  // private chooseExistingIcon() {
  //   let isAssemblyIcon = this.assembliesData.some((assembly: any) => {
  //     if (assembly.id == this.existingAssembly && assembly.iconLocation) {
  //       this.getBase64Image(this.baseUrl + assembly.iconLocation, (data: any) => {
  //         this.imageSrc = data;
  //         if (this.addIcon && isAssemblyIcon) {
  //           this.dialogRef.close(this.imageSrc);
  //         }
  //         this.addIcon = false;
  //       });
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   });


  // }

  private chooseExistingIcon() {
    let isAssemblyIcon = this.assembliesData.some((assembly: any) => {
      if (assembly.id == this.existingAssembly && assembly.iconLocation) {
          this.converBase64FromUrl(assembly.iconLocation)
          .then((result: any) => {
            this.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl(result);
            if (this.addIcon && isAssemblyIcon) {
              this.dialogRef.close(this.imageSrc);
            }
            this.addIcon = false;
          });         
        return true;
      } else {
        return false;
      }
    });


  }

  private createWithShape() {
    this.createSvgIcon(this.iconText, this.selectedShape);
  }

  private createSvgIcon(text: string, shape: string) {
    let icon: string;
    switch (shape) {
      case 'star':
          const fontSize = text.length > 4 ? '30px' : '45px';
          icon = `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          viewBox="0 0 243.317 243.317" style="enable-background:new 0 0 243.317 243.317;" xml:space="preserve">
       <path d="M242.949,93.714c-0.882-2.715-3.229-4.694-6.054-5.104l-74.98-10.9l-33.53-67.941c-1.264-2.56-3.871-4.181-6.725-4.181
         c-2.855,0-5.462,1.621-6.726,4.181L81.404,77.71L6.422,88.61C3.596,89.021,1.249,91,0.367,93.714
         c-0.882,2.715-0.147,5.695,1.898,7.688l54.257,52.886L43.715,228.96c-0.482,2.814,0.674,5.658,2.983,7.335
         c2.309,1.678,5.371,1.9,7.898,0.571l67.064-35.254l67.063,35.254c1.097,0.577,2.296,0.861,3.489,0.861c0.007,0,0.014,0,0.021,0
         c0,0,0,0,0.001,0c4.142,0,7.5-3.358,7.5-7.5c0-0.629-0.078-1.24-0.223-1.824l-12.713-74.117l54.254-52.885
         C243.096,99.41,243.832,96.429,242.949,93.714z M173.504,146.299c-1.768,1.723-2.575,4.206-2.157,6.639l10.906,63.581
         l-57.102-30.018c-2.185-1.149-4.795-1.149-6.979,0l-57.103,30.018l10.906-63.581c0.418-2.433-0.389-4.915-2.157-6.639
         l-46.199-45.031l63.847-9.281c2.443-0.355,4.555-1.889,5.647-4.103l28.55-57.849l28.55,57.849c1.092,2.213,3.204,3.748,5.646,4.103
         l63.844,9.281L173.504,146.299z"/>
       <text x="50%" y="50%" text-anchor="middle" font-size="${fontSize}" font-family="Arial, Helvetica, sans-serif" font-weight="bold" stroke-width="2px" dy=".25em">${text}</text>
       </svg>`
        break;
      case 'circle':
          icon = `<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 512 512">
          <path fill="#000" d="M256 23.05C127.5 23.05 23.05 127.5 23.05 256S127.5 488.9 256 488.9 488.9 384.5 488.9 256 384.5 23.05 256 23.05zm0 17.9c118.9 0 215.1 96.15 215.1 215.05S374.9 471.1 256 471.1c-118.9 0-215.05-96.2-215.05-215.1C40.95 137.1 137.1 40.95 256 40.95z"/>
          <text x="50%" y="50%" text-anchor="middle" font-size="100px" font-family="Arial, Helvetica, sans-serif" font-weight="bold" stroke-width="2px" dy=".25em">${text}</text>
          </svg>`;
        break;
      case 'oval':
          icon = `<svg width="300" height="240" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="150" cy="120" rx="135" ry="105" fill="none" stroke="#000" stroke-width="10"/>
            <text x="50%" y="50%" text-anchor="middle" font-size="xxx-large" font-family="Arial, Helvetica, sans-serif" font-weight="bold" stroke-width="2px" dy=".25em">${text}</text>
          </svg>`;
        break;
      case 'square':
          icon = `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
          x="0px" y="0px" viewBox="0 0 201.611 201.611" style="enable-background:new 0 0 201.611 201.611;" xml:space="preserve">
          <path style="fill:#010002;" d="M201.611,201.611H0V0h201.611V201.611z M8.328,193.283h184.955V8.328H8.328V193.283z"/>
          <text x="50%" y="50%" text-anchor="middle" font-size="xxx-large" font-family="Arial, Helvetica, sans-serif" font-weight="bold" stroke-width="1px" dy=".25em">${text}</text>
          </svg>`;
        break;
      case 'rectangle':
          icon = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
       <path d="M501.333,96H10.667C4.779,96,0,100.779,0,106.667v298.667C0,411.221,4.779,416,10.667,416h490.667
         c5.888,0,10.667-4.779,10.667-10.667V106.667C512,100.779,507.221,96,501.333,96z M490.667,394.667H21.333V117.333h469.333
         V394.667z"/>
       <text x="50%" y="50%" text-anchor="middle" font-size="100px" font-family="Arial, Helvetica, sans-serif" font-weight="bold" stroke-width="2px" dy=".25em">${text}</text>
       </svg>`;
        break;
      case 'triangle':
        const rectFontSize = text.length < 4 ? '100px' : text.length < 5 ? '80px' : '60px';
          icon = `<svg width="460" height="460"  xmlns="http://www.w3.org/2000/svg">
          <polygon points="225,10 10,375 450,375" style="fill:rgba(0,0,0,0);stroke:#000;stroke-width:10" />
          <text x="49%" y="50%" text-anchor="middle" font-size="${rectFontSize}" font-family="Arial, Helvetica, sans-serif" font-weight="bold" stroke-width="2px" dy=".25em">${text}</text>
          </svg>`;
        break;
      case 'polygon':
        icon = `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 60 60" style="enable-background:new 0 0 60 60;" xml:space="preserve">
     <path fill="none" stroke="#000" d="M59.662,26.042L30.701,0.458c-0.377-0.332-0.94-0.334-1.319-0.004L0.343,25.79c-0.306,0.267-0.42,0.692-0.289,1.076
       l11,32.249c0.138,0.405,0.519,0.677,0.946,0.677h35.954c0.427,0,0.806-0.271,0.945-0.674l11.046-32
       C60.077,26.735,59.966,26.311,59.662,26.042z"/>
     <text x="50%" y="50%" text-anchor="middle" font-size="small" font-family="Arial, Helvetica, sans-serif" stroke-width="2px" dy=".5em">${text}</text>
     </svg>`;
      break;
      default:
        icon = `<svg xmlns="http://www.w3.org/2000/svg" width="512px" height="512px" viewBox="0 0 512 512">
        <path fill="#000" d="M256 23.05C127.5 23.05 23.05 127.5 23.05 256S127.5 488.9 256 488.9 488.9 384.5 488.9 256 384.5 23.05 256 23.05zm0 17.9c118.9 0 215.1 96.15 215.1 215.05S374.9 471.1 256 471.1c-118.9 0-215.05-96.2-215.05-215.1C40.95 137.1 137.1 40.95 256 40.95z"/>
        <text x="50%" y="50%" text-anchor="middle" font-size="xxx-large" font-family="Arial, Helvetica, sans-serif" font-weight="bold" stroke-width="2px" dy=".25em">${text}</text>
        </svg>`;
        break;
    }

    this.imageSrc = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;base64,' + window.btoa(icon));
    if (this.addIcon) {
      this.dialogRef.close(this.imageSrc);
      this.addIcon = false;
    }
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

  public getBase64Image(src: any, callback: any) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      let dataURL;
      canvas.height = img.naturalHeight;
      canvas.width = img.naturalWidth;
      if (ctx) {
        ctx.drawImage(img, 0, 0);
      }
      dataURL = canvas.toDataURL();
      callback(dataURL);
    };

    img.src = src;
    if (img.complete || img.complete === undefined) {
      img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      img.src = src;
    }
  }

  private async converBase64FromUrl(imageUrl: any) {
    const url = this.baseUrl + imageUrl;
      var res = await fetch(url);
      var blob = await res.blob();
    
      return new Promise((resolve, reject) => {
        var reader  = new FileReader();
        reader.addEventListener("load", function () {
            resolve(reader.result);
        }, false);
    
        reader.onerror = () => {
          return reject(this);
        };
        reader.readAsDataURL(blob);
      });

  }

}
