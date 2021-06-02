import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssemblyConfiguratorRoutingModule } from './assembly-configurator-routing.module';
import { GroupComponent } from '../components/group/group.component';
import { AssembliesComponent } from '../components/assemblies/assemblies.component';
import { AssemblyConfiguratorComponent } from './assembly-configurator.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [AssemblyConfiguratorComponent, GroupComponent, AssembliesComponent],
  imports: [
    CommonModule,
    AssemblyConfiguratorRoutingModule,
    MatListModule,
    MatIconModule,
    FormsModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  exports: [ MatListModule, MatIconModule, FormsModule, MatCheckboxModule, MatButtonModule ]
})
export class AssemblyConfiguratorModule { }
