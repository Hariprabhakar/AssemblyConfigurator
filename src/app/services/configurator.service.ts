import { Injectable } from '@angular/core';
import { RestApiService } from './rest-api-service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguratorService {

  constructor(private restApiService: RestApiService) { }

  public getCategories(){
    return this.restApiService.get('categories', '', '');
    //return this.http.get('../../assets/categories.json')
  }

  public getComponents(){
    return this.restApiService.get('components', '', '');
    //return this.http.get('../../assets/components.json')
  }
}
