import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { ConfiguratorService } from 'src/app/services/configurator.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-assemblies',
  templateUrl: './assemblies.component.html',
  styleUrls: ['./assemblies.component.scss']
})
export class AssembliesComponent implements OnInit {
  @Input() groupId: number;
  @Output() assemblyDetails = new EventEmitter();
  public familyId: any;
  public companyId: any;
  public searchValue: any;

  public assembliesData: any[] = [];
  public assembliesOriginalData: any = [];

  public defaultAssemblies = false;
  public customAssemblies = false;
  public showLoader: boolean;
  public ImagesData: any;


  constructor(private configuratorService: ConfiguratorService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.companyId = this.configuratorService.companyId;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.groupId && changes.groupId.currentValue) {
      if (changes.groupId.currentValue['name'] === 'Custom Assemblies') {
        this.customAssemblies = true;
      } else {
        this.customAssemblies = false;
      }
      this.familyId = changes.groupId.currentValue.id;
      this.getAssemblies();
    }
  }

  getAssemblies() {
    this.showLoader = true;
    this.configuratorService.getAssemblies(this.companyId, this.familyId, this.defaultAssemblies, this.customAssemblies).subscribe(res => {
      this.assembliesOriginalData = res;
      this.assembliesData = [...this.assembliesOriginalData];
      this.showLoader = false;
      this.getImages();
    },
      (error: any) => {
        this.toastService.openSnackBar(error);
        this.showLoader = false;
      }
    );
  }

  getImages() {
    this.configuratorService.getImages(this.companyId, this.familyId, this.defaultAssemblies, this.customAssemblies).subscribe((res: any) => {
      this.ImagesData = res;

      const ImageData = this.ImagesData.filter((img: any) => img.icon !== undefined)
      ImageData.map((img: any) => (img.icon) = 'data:image/jpeg;base64,' + img.icon)

      this.assembliesData = this.assembliesData.map((item, i) => Object.assign({}, item, ImageData[i]));

    },
      (error: any) => {
        this.toastService.openSnackBar(error);
      }
    );
  }

  filterAssembly(event: any) {
    this.assembliesData = this.assembliesOriginalData.filter((category: any) => {
      return category['name'].toLowerCase().indexOf(this.searchValue.toLowerCase()) >= 0;
    });
  }


  public toggleHide(event: any) {
    this.defaultAssemblies = event.checked;
    this.getAssemblies();
  }

  /** Function to invoke Assembly Details by Id
   * @memberOf AssembliesComponent
   */
  public getAssemblyDetails(id:any) {
    if (id) {
      this.configuratorService.getAssemblyComponent(id).subscribe(res => {
        const assemblyInfo = res;
        this.assemblyDetails.emit(assemblyInfo);
      },
        (error: any) => {
          // Mock data for testing will be removed
          console.log('Error in getAssemblyDetails service call');
          const assemblyInfo = {
            "assembly": {
              "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAE3SURBVHgBpZTNcYMwEIVXGrgnFcRnDvxUEFJBUkLSgTsAV5B0EHdiuQJQBbY7sAsA/JYRHhlL+O8dELDLt087KwR5VFXVC5YvKeUbP7dtq7HUWZZtXfnCAciFEAVuc3JLdV33MwbKEWQOyGoCwuJCG+SWThAHkPBLN4pd2zBhIDOu4vlmidge25m7gnj/gW0qaej/5K+sTKO9zvr1ihtO/AZITBWDq1d2lNKTwoh8BrgkINoO/rDUwzPcrAdnlgO+zy3WLBjT8eGBHPPF27OK7cfxAAk7BGxHhZ1wS48Qq7lHip5U0zRamlFX9LgUM/o5QvMWE4kprL/7gnzueD01R2td4GVJdwgFyiRJFmege2E25ALEwqSn5vDmHobC7JVxHK/PwJ7k/iAzbPixQdswDFUURTtX/hFoGohs24G34AAAAABJRU5ErkJggg==",
              "images": [{
                "inputText": "Front",
                "fileName64Bit": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAE3SURBVHgBpZTNcYMwEIVXGrgnFcRnDvxUEFJBUkLSgTsAV5B0EHdiuQJQBbY7sAsA/JYRHhlL+O8dELDLt087KwR5VFXVC5YvKeUbP7dtq7HUWZZtXfnCAciFEAVuc3JLdV33MwbKEWQOyGoCwuJCG+SWThAHkPBLN4pd2zBhIDOu4vlmidge25m7gnj/gW0qaej/5K+sTKO9zvr1ihtO/AZITBWDq1d2lNKTwoh8BrgkINoO/rDUwzPcrAdnlgO+zy3WLBjT8eGBHPPF27OK7cfxAAk7BGxHhZ1wS48Qq7lHip5U0zRamlFX9LgUM/o5QvMWE4kprL/7gnzueD01R2td4GVJdwgFyiRJFmege2E25ALEwqSn5vDmHobC7JVxHK/PwJ7k/iAzbPixQdswDFUURTtX/hFoGohs24G34AAAAABJRU5ErkJggg==",
                "isPrimary": true
              }],
              "components": [{
                "sequence": 1,
                "id": 45,
                "componentName": "abc",
                "symbol": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAE3SURBVHgBpZTNcYMwEIVXGrgnFcRnDvxUEFJBUkLSgTsAV5B0EHdiuQJQBbY7sAsA/JYRHhlL+O8dELDLt087KwR5VFXVC5YvKeUbP7dtq7HUWZZtXfnCAciFEAVuc3JLdV33MwbKEWQOyGoCwuJCG+SWThAHkPBLN4pd2zBhIDOu4vlmidge25m7gnj/gW0qaej/5K+sTKO9zvr1ihtO/AZITBWDq1d2lNKTwoh8BrgkINoO/rDUwzPcrAdnlgO+zy3WLBjT8eGBHPPF27OK7cfxAAk7BGxHhZ1wS48Qq7lHip5U0zRamlFX9LgUM/o5QvMWE4kprL/7gnzueD01R2td4GVJdwgFyiRJFmege2E25ALEwqSn5vDmHobC7JVxHK/PwJ7k/iAzbPixQdswDFUURTtX/hFoGohs24G34AAAAABJRU5ErkJggg==",
                "tag": "NSB",
                "phase": "ROUGH-IN",
                "name": "4inx2 1/8in Deep Box Assembly",
                "qty": 3,
                "uom": "Ea",
                "systems": ["Power", "Data"],
                "connectionTypes": [1, 2]
              }]
            }
          };
          this.assemblyDetails.emit(assemblyInfo);
        }
      );
    } else {
      console.log('Some thing went wrong');
    }

  }

  
}
