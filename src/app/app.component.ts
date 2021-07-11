import { Component } from '@angular/core';
import { ConfiguratorService } from './services/configurator.service';
import { LocalService } from './shared/services/local.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'assemblyconfigurator';

  constructor( private configuratorService: ConfiguratorService, private localService: LocalService ) { }

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('companyId');
    if(myParam) {
      this.configuratorService.setCompanyId(parseInt(myParam));
      sessionStorage.setItem('companyId',myParam);
      this.localService.setJsonValue('companyId', myParam);
    } 
  }

}
