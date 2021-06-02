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
import { FormsModule } from '@angular/forms';
import { CreateAssemblyRoutingModule } from './create-assembly-routing.module';
import { EditAssemblyComponent } from '../components/edit-assembly/edit-assembly.component';



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
  ],
  exports: [ MatCheckboxModule, MatButtonModule, MatTableModule, MatInputModule, MatSelectModule, MatFormFieldModule
    , MatDividerModule, MatListModule, MatIconModule, FormsModule ],
})
export class CreateAssemblyModule { }
