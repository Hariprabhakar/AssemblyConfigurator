import { Injectable } from '@angular/core';
import { MatSnackBarConfig, MatSnackBarRef, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from '../components/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  
  constructor(private snackBar: MatSnackBar) { }

  // public openSnackBar(message: string, action: string = 'OK', className: string = 'error-snackbar') {
  //   this.snackBar.open(message, action, {
  //     horizontalPosition: 'end',
  //     verticalPosition: 'top',
  //     panelClass: className,
  //     duration: 10000
  //   });
  // }

  public openSnackBar(message: string, type: string = 'error', className: string = 'error-snackbar', verticalPosition?: any, horizontalPosition?: any) {
    const _snackType = type !== undefined ? type : 'success';
    this.snackBar.openFromComponent(ToastComponent, {
      duration: 10000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: className,
      data: { message: message, snackType: _snackType, snackBar: this.snackBar }
    });
  }

}
