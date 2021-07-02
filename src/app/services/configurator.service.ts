import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { RestApiService } from './rest-api-service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguratorService {
  private _companyId!: number;
  private _assemblyData: any;
  private asemblyDataSubject$ = new BehaviorSubject('');
  private groupName = new BehaviorSubject('');
  public currentAssemblyValue = this.asemblyDataSubject$.asObservable();
  public groupNameObservable = this.groupName.asObservable();
  public groups: any;

  constructor(private restApiService: RestApiService) {
    const sessionCompany = sessionStorage.getItem('companyId');
    if (sessionCompany !== null) {
      this._companyId = parseInt(sessionCompany);
    }
  }

  public currentAssemblyData(data: any) {
    this.asemblyDataSubject$.next(data);
  }

  public currentGroupName(val: any) {
    this.groupName.next(val);
  }

  setCompanyId(id: number) {
    this._companyId = id;
  }

  public get companyId(): number {
    return this._companyId;
  }

  public setAssemblyData(assebmlyData: any) {
    this._assemblyData = assebmlyData;
    this.currentAssemblyData(assebmlyData);
  }

  public setGroups(groups: any) {
    this.groups = groups;
  }

  public getGroupNameById(groupId: any) {
    let groupName;
    if (this.groups) {
      this.groups.forEach((group: any) => {
        if (group.id == groupId) {
          groupName = group.name;
        }
      });
    }
    return groupName;
  }

  // public get assemblyData(): any {
  //   return this._assemblyData;
  // }
  public getAssemblyData(): any {
    return this._assemblyData;
  }

  public getCategories() {
    return this.restApiService.get('categories', '', '');
    //return this.http.get('assets/categories.json')
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
      queryParam = 'companyId=' + companyId + '&hideDefault=' + defaultAssemblies + '&includeImage=true' + '&showCustom=' + customAssemblies + '&pageIndex=0&pageSize=0';
    } else {
      queryParam =
        'companyId=' +
        companyId +
        '&familyId=' +
        familyId +
        '&hideDefault=' +
        defaultAssemblies +
        '&includeImage=true' +
        '&showCustom=' +
        customAssemblies +
        '&pageIndex=0&pageSize=0';
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
    return this.restApiService.post(`Assemblies/${this.companyId}/is-avail-abbr`, reqObj, '');
  }

  public createAssembly(reqObj: any, isUpdate: boolean, assemblyId: any) {
    if (isUpdate && assemblyId) {
      return this.restApiService.put('Assemblies/' + assemblyId, reqObj, '');
    } else {
      const queryParam = 'companyId=' + this.companyId;
      return this.restApiService.post(`Assemblies/${this.companyId}`, reqObj, '');
    }
  }

  public addTagToComponent(id: any, reqObj: any) {
    return this.restApiService.patch('Components/' + id + '/update-tag/', reqObj, '');
  }

  public updatePhase(id: any, phaseObj: any) {
    return this.restApiService.patch('Components/' + id + '/update-phase/', phaseObj, '');
  }

  /** Invokes ​'/assemblies​/{id}​/get-components' Get assembly components service call
   * GET Methods
   * {url params} Assembly id
   * @memberOf ConfiguratorService
   */
  public getAssemblyComponent(id: number) {
    return this.restApiService.get(`assemblies/${id}/get-components`, '', '');
  }
  public saveAssemblyComponents(reqObj: any, assemblyId: number) {
    return this.restApiService.post(`assemblies/${assemblyId}/save-components`, reqObj, '');
  }

  public getAssemblyById(assemblyId: number) {
    return this.restApiService.get(`assemblies/${assemblyId}`, '', '');
  }
}
