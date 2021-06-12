import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomAssemblyComponent } from './custom-assembly.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    CustomAssemblyComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule
  ],
  exports: [CustomAssemblyComponent]
})
export class CustomAssemblyModule { }
