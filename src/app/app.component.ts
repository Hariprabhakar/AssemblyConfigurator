import { Component } from '@angular/core';
import { ConfiguratorService } from './services/configurator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'assemblyconfigurator';

  constructor( private configuratorService: ConfiguratorService ) { }

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('companyId');
    if(myParam) {
      this.configuratorService.setCompanyId(parseInt(myParam));
      sessionStorage.setItem('companyId',myParam);
    } 
  }

}
