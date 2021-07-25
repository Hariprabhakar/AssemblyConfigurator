import { Component } from '@angular/core';
import { ConfiguratorService } from './services/configurator.service';
import { SessionService } from './shared/services/session.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'assemblyconfigurator';

  constructor( private configuratorService: ConfiguratorService, private sessionService: SessionService ) { }

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('companyId');
    if(myParam) {
      this.configuratorService.setCompanyId(parseInt(myParam));
      sessionStorage.setItem('companyId',this.sessionService.encrypt(myParam));
    } 
  }

}
