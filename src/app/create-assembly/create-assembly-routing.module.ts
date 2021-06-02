import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateAssemblyComponent } from './create-assembly.component';

const routes: Routes = [
    { path: '', component: CreateAssemblyComponent }
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateAssemblyRoutingModule { }
