import { Component } from '@angular/core';
import { ConfiguratorService } from './services/configurator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'assemblyconfig';

  constructor( private configuratorService: ConfiguratorService ) { }

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('companyId');
    console.log(myParam);
    if(myParam) {
      this.configuratorService.setCompanyId(parseInt(myParam));
    } 
  }

}
