import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { filter, startWith } from 'rxjs/operators';
import { ContactUsComponent } from '../contact-us/contact-us.component';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public pageTitle = "Assembly Configurator";
  constructor(private router: Router, public dialog: MatDialog) { }

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

  public closeTab() {
    window.close();
  }

  public contactUs() {
    this.dialog.open(ContactUsComponent,{
      height: '400px',
      width: '800px',
      panelClass: 'contact-us-modal'
    });
  }

  public profile(){
    this.dialog.open(ProfileComponent,{
      height: '400px',
      width: '800px',
      panelClass: 'profile-modal'
    });
  }

}
