import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfiguratorService } from 'src/app/services/configurator.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor( private route: ActivatedRoute, private configuratorService: ConfiguratorService, private router: Router,
    private sessionService: SessionService ) { }

  ngOnInit(): void {
    this.route.queryParams
    .subscribe(params => {
      if(params.companyId) {
        this.configuratorService.setCompanyId(parseInt(params.companyId));
        sessionStorage.setItem('companyId', this.sessionService.encrypt(params.companyId));
      }
    });
    
    const snapshot = this.route.snapshot;
    const params = { ...snapshot.queryParams };
    delete params.companyId
    this.router.navigate([], { queryParams: params });
  }

}
