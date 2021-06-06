import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public pageTitle = "Assembly Configurator";
  constructor(private router: Router) { }

  ngOnInit(): void {

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        startWith(this.router)
      )
      .subscribe((event: any) => {
        switch (event.url) {
          case '/create-assembly':
            this.pageTitle = "Create a New Assembly";
            break;
          case '/assembly-configurator':
            this.pageTitle = "Assembly Configurator";
            break;
          default:
            this.pageTitle = "Assembly Configurator";
            break;
        }
      });
  }



}
