import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatTabsModule} from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateAssemblyModule } from './create-assembly/create-assembly.module';
import { HttpClientModule } from '@angular/common/http';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AssemblyConfiguratorModule } from './assembly-configurator/assembly-configurator.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastService } from './shared/services/toast.service';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Routes } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { MatFileUploadModule } from 'angular-material-fileupload';
import { JunctionboxModalComponent } from './components/junctionbox-modal/junctionbox-modal.component';
import { AssemblyIconModalComponent } from './components/assembly-icon-modal/assembly-icon-modal.component';
import { FileChooseModalComponent } from './components/file-choose-modal/file-choose-modal.component';
import { AssemblyZoomImageModalComponent } from './components/assembly-zoom-image-modal/assembly-zoom-image-modal.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import {MatMenuModule} from '@angular/material/menu';
import { MessageModalComponent } from './components/message-modal/message-modal.component';
import { ContactUsComponent } from './shared/components/contact-us/contact-us.component';
import { ConfiguratorInitService } from './shared/services/configurator-init.service';
import { ToastComponent } from './shared/components/toast/toast.component';
import { FilterModalComponent } from './components/filter-modal/filter-modal.component';
import { MatListModule } from '@angular/material/list';
import { RequestNewComponent } from './shared/components/request-new-comp/request-new-comp.component';
import { CreateTemplateModalComponent } from './assembly-configurator/create-template-modal/create-template-modal.component';
export function initializeApp(appInitService: ConfiguratorInitService) {
  return (): Promise<any> => { 
    return appInitService.Init();
  }
}

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    JunctionboxModalComponent,
    AssemblyIconModalComponent,
    FileChooseModalComponent,
    AssemblyZoomImageModalComponent,
    ConfirmationModalComponent,
    MessageModalComponent, 
    ContactUsComponent, ToastComponent, FilterModalComponent, RequestNewComponent,
    CreateTemplateModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule,
    HttpClientModule,
    CreateAssemblyModule,
    AssemblyConfiguratorModule,
    MatSnackBarModule,
    MatDialogModule,
    MatRadioModule,
    MatFileUploadModule,
    NgxDropzoneModule,
    MatMenuModule,
    MatTabsModule,
    MatListModule
  ],
  providers: [/*{provide: LocationStrategy, useClass: HashLocationStrategy},*/ ToastService, 
    ConfiguratorInitService,
    { provide: APP_INITIALIZER,useFactory: initializeApp, deps: [ConfiguratorInitService], multi: true}],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [MatTabsModule],
  bootstrap: [AppComponent],
  entryComponents: [AssemblyIconModalComponent]
})
export class AppModule {}
