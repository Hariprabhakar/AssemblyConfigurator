import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfiguratorInitService {
  constructor(private http: HttpClient) {}

  Init() {
    const url = `${environment.url}/users/authenticate`;
    return new Promise<void>((resolve, reject) => {
      const headers = { 'content-type': 'application/json' };
      const body = {
        username: environment.userName,
        password: environment.password
      };
      // console.log(body)
      this.http.post(url, body, { headers: headers }).subscribe(
        (res: any) => {
          sessionStorage.setItem('token', res.token);
          resolve();
        },
        (error) => {
          console.log('Error token');
          resolve();
        }
      );
    });
  }
}
