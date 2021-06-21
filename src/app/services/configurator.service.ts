import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RestApiService } from './rest-api-service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguratorService {
  private _companyId!: number;
  private _assemblyData: any;

  constructor(private restApiService: RestApiService) {
    const sessionCompany = sessionStorage.getItem('companyId');
    if ( sessionCompany !== null) {
      this._companyId = parseInt(sessionCompany);
    }

  }

  setCompanyId(id: number) {
    this._companyId = id;
  }

  public get companyId(): number {
    return this._companyId;
  }

  public setAssemblyData(assebmlyData: any) {
    this._assemblyData = assebmlyData;
  }

  

  // public get assemblyData(): any {
  //   return this._assemblyData;
  // }
  public getAssemblyData(): any {
    return this._assemblyData;
  }

  public getCategories() {
    return this.restApiService.get('categories', '', '');
    //return this.http.get('../../assets/categories.json')
  }

  public getComponents(companyId: number, categoryId: number, includeImage: boolean = true) {
    const queryParam = 'companyId=' + companyId + '&categoryId=' + categoryId + '&includeImage=' + includeImage + '&pageIndex=0&pageSize=0';
    return this.restApiService.get('components', '', queryParam);
  }

  public getFamilies() {
    return this.restApiService.get('Families', '', 'pageIndex=0&pageSize=0');
  }

  public getAssemblies(companyId: number, familyId: number, defaultAssemblies: boolean, customAssemblies: boolean) {
    let queryParam: string;
    if (customAssemblies) {
      queryParam = 'companyId=' + companyId + '&hideDefault=' + defaultAssemblies + '&showCustom=' + customAssemblies + '&pageIndex=0&pageSize=0';
    } else {
      queryParam = 'companyId=' + companyId + '&familyId=' + familyId + '&hideDefault=' + defaultAssemblies + '&showCustom=' + customAssemblies + '&pageIndex=0&pageSize=0';
    }

    return this.restApiService.get('Assemblies', '', queryParam);
  }

  public getImages(companyId: number, familyId: number, defaultAssemblies: boolean, customAssemblies: boolean) {
    let queryParam: string;
    if (customAssemblies) {
      queryParam = 'companyId=' + companyId + '&hideDefault=' + defaultAssemblies + '&showCustom=' + customAssemblies + '&pageIndex=0&pageSize=0';
    } else {
      queryParam = 'companyId=' + companyId + '&familyId=' + familyId + '&hideDefault=' + defaultAssemblies + '&showCustom=' + customAssemblies + '&pageIndex=0&pageSize=0';
    }
    return this.restApiService.get('Assemblies/Images', '', queryParam);
  }

  public getSuggestions(reqObj: any) {
    return this.restApiService.post('Assemblies/is-avail-abbr', reqObj, '');
  }

  public createAssembly(reqObj: any, isUpdate: boolean, assemblyId: any) {
    if (isUpdate && assemblyId) {
      return this.restApiService.put('Assemblies/' + assemblyId, reqObj, '');
    } else {
      const queryParam = 'companyId=' + this.companyId;
      return this.restApiService.post('Assemblies/', reqObj, queryParam);
    }
  }

  public addTagToComponent(id: any, tagName: any) {
    const queryParam = 'tag=' + tagName;
    return this.restApiService.post('Components/' + id + '/create-tag/', {}, queryParam);
  }

  public updatePhase(id: any, phase: any) {
    const queryParam = 'phase=' + phase;
    return this.restApiService.patch('Components/' + id + '/update-phase/', {}, queryParam);
  }
}
