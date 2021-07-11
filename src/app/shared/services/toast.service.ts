import { Injectable } from '@angular/core';
import { MatSnackBarConfig, MatSnackBarRef, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  
  constructor(private snackBar: MatSnackBar) { }

  public openSnackBar(message: string, action: string = 'OK', className: string = 'error-snackbar') {
    this.snackBar.open(message, action, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: className,
      duration: 10000
    });
  }

}
