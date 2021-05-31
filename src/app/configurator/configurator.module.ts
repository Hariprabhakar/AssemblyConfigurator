import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateAssemblyComponent } from '../components/create-assembly/create-assembly.component';
import { ConfiguratorComponent } from './configurator.component';
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



@NgModule({
  declarations: [ConfiguratorComponent, CreateAssemblyComponent, CategoryComponent, CategoryComponentsComponent],
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
    FormsModule
  ],
  exports: [ MatCheckboxModule, MatButtonModule, MatTableModule, MatInputModule, MatSelectModule, MatFormFieldModule
    , MatDividerModule, MatListModule, MatIconModule, FormsModule ],
})
export class ConfiguratorModule { }
