import { Injectable } from '@angular/core';
import { MatSnackBarConfig, MatSnackBarRef, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  
  constructor(private snackBar: MatSnackBar) { }

  public openSnackBar(message: string, action: string = 'OK') {
    this.snackBar.open(message, '', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: 'error-snackbar',
      duration: 5000
    });
  }

}
