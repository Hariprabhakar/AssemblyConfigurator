import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfiguratorService } from 'src/app/services/configurator.service';
import { LocalService } from '../../services/local.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor( private route: ActivatedRoute, private configuratorService: ConfiguratorService, private localService: LocalService ) { }

  ngOnInit(): void {
    this.route.queryParams
    .subscribe(params => {
      if(params.companyId) {
        this.configuratorService.setCompanyId(parseInt(params.companyId));
        sessionStorage.setItem('companyId', params.companyId);
        this.localService.setJsonValue('companyId', params.companyId);
      }
    }) 
  }

}
