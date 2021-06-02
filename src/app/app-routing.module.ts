import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'assembly-configurator', pathMatch: 'full' },
      {
        path: 'assembly-configurator',
        loadChildren: () =>
          import('./assembly-configurator/assembly-configurator.module').then(
            (m) => m.AssemblyConfiguratorModule
          ),
      },
      {
        path: 'create-assembly',
        loadChildren: () =>
          import('./create-assembly/create-assembly.module').then(
            (m) => m.CreateAssemblyModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
