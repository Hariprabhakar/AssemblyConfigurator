import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {

  public icon: string = '';
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit(): void {
    this.icon = this.setIcon();
  }

  public setIcon(){
    switch (this.data.snackType) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error_outline';
      case 'warn':
        return 'report_problem';
      case 'info':
        return  'info';
      default:
        return 'check_circle';
    }
  }

  public closeSnackbar() {
    this.data.snackBar.dismiss();
  }
}
