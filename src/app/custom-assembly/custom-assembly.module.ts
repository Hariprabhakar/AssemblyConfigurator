import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomAssemblyComponent } from './custom-assembly.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@NgModule({
  declarations: [
    CustomAssemblyComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    FormsModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  exports: [CustomAssemblyComponent]
})
export class CustomAssemblyModule { }
