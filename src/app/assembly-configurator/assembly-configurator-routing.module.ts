import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssemblyConfiguratorComponent } from './assembly-configurator.component';

const routes: Routes = [
    { path: '', component: AssemblyConfiguratorComponent }
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssemblyConfiguratorRoutingModule { }
