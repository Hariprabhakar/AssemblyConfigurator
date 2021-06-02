import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface options{
    headers: HttpHeaders;
    body?: object;
}


@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  constructor(private httpClient: HttpClient) { }

  /*========================================
    CRUD Methods for consuming RESTful API
  =========================================*/

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };



  // HttpClient API post() method
  public post < T >(serviceName: string, params: any, urlParams: any) {
    return this.invokeApiCall('POST', serviceName, params, urlParams);
  }

   // HttpClient API get() method
   public get < T >(serviceName: string, params: any, urlParams: any) {
    return this.invokeApiCall('GET', serviceName, params, urlParams);
  }

  /** invoke api call */
  public invokeApiCall <T>(methodName: string, serviceName: any, serviceParams: any, urlParams: any) {
    // const httparams = new HttpParams().set('params', serviceParams);
    const env = environment;
    let url;
    let reqMethodName;
    const options: options= {
      headers: this.httpOptions.headers,
      body: {}
    };

    if ( methodName !== 'GET') {
      options.body = serviceParams;
    } else {
      delete options.body;
    }

    /** check mock enabled and set env, request method  */
    if ( !env.mockEnabled) {
      // const env = appConfig.config.env;
      url = `${environment.url}${serviceName}`;
      if ( urlParams ){
        url = `${url}?${urlParams}`
      }
      reqMethodName = methodName;
    }  else {
      url = `${environment.url}${serviceName}.json`;
      reqMethodName = 'GET';
    }

    return this.httpClient.request(reqMethodName, url, options)
    .pipe(
      retry(1),
      catchError(this.handleError)
    );
  }

  // Error handling
  handleError(error: any) {
     let errorMessage = '';
     if (error.error instanceof ErrorEvent) {
       // Get client-side error
       errorMessage = error.error.message;
     } else {
       // Get server-side error
       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
     }
     return throwError(errorMessage);
  }

}