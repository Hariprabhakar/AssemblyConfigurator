import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateAssemblyComponent } from './create-assembly.component';
import { CategoryComponent } from '../components/category/category.component';
import { CategoryComponentsComponent } from '../components/category-components/category-components.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateAssemblyRoutingModule } from './create-assembly-routing.module';
import { EditAssemblyComponent } from '../components/edit-assembly/edit-assembly.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';
import { CustomAssemblyModule } from '../custom-assembly/custom-assembly.module';


@NgModule({
  declarations: [CreateAssemblyComponent, EditAssemblyComponent, CategoryComponent, CategoryComponentsComponent],
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    FormsModule,
    CreateAssemblyRoutingModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatTooltipModule,
    CustomAssemblyModule
  ],
  exports: [ MatCheckboxModule, MatButtonModule, MatTableModule, MatInputModule, MatSelectModule, MatFormFieldModule
    , MatDividerModule, MatListModule, MatIconModule, FormsModule, MatProgressSpinnerModule, ReactiveFormsModule , MatTooltipModule, CustomAssemblyModule],
})
export class CreateAssemblyModule { }
