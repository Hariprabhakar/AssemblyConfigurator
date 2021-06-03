import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  public getFamilies(){
    return this.restApiService.get('Families', '', 'pageIndex=0&pageSize=0');
  }

  public getAssemblies(companyId: number, familyId: number, defaultAssemblies: boolean, customAssemblies: boolean){
    let queryParam: string;
    if (customAssemblies){
      queryParam = 'companyId=' + companyId + '&hideDefault=' + defaultAssemblies + '&showCustom=' + customAssemblies + '&pageIndex=0&pageSize=0';
    } else {
      queryParam = 'companyId=' + companyId + '&familyId=' + familyId + '&hideDefault=' + defaultAssemblies + '&showCustom=' + customAssemblies + '&pageIndex=0&pageSize=0';
    }
    
    return this.restApiService.get('Assemblies', '', queryParam);
  }

  getImages(companyId: number = 1, familyId: number, defaultAssemblies: boolean, customAssemblies: boolean) {
    let queryParam: string;
    if (customAssemblies){
      queryParam = 'companyId=' + companyId + '&hideDefault=' + defaultAssemblies + '&showCustom=' + customAssemblies + '&pageIndex=0&pageSize=0';
    } else {
      queryParam = 'companyId=' + companyId + '&familyId=' + familyId + '&hideDefault=' + defaultAssemblies + '&showCustom=' + customAssemblies + '&pageIndex=0&pageSize=0';
    }
    return this.restApiService.get('Assemblies/Images', '', queryParam);
  }
}
