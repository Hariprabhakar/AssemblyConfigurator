import {  NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateAssemblyModule } from './create-assembly/create-assembly.module';
import { HttpClientModule } from '@angular/common/http';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AssemblyConfiguratorModule } from './assembly-configurator/assembly-configurator.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastService } from './shared/services/toast.service';
import {MatDialogModule} from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { JunctionboxModalComponent } from './components/junctionbox-modal/junctionbox-modal.component';
import { AssemblyIconModalComponent } from './components/assembly-icon-modal/assembly-icon-modal.component';
import { FileChooseModalComponent } from './components/file-choose-modal/file-choose-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    JunctionboxModalComponent,
    AssemblyIconModalComponent,   
    FileChooseModalComponent     
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CreateAssemblyModule,
    AssemblyConfiguratorModule,
    MatSnackBarModule,
    MatDialogModule,
    MatRadioModule,
    MatFileUploadModule
      ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}, ToastService],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
