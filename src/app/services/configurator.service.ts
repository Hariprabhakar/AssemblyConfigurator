import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { RestApiService } from './rest-api-service';
import { environment } from '../../environments/environment';
import { SessionService } from '../shared/services/session.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguratorService {
  private _companyId!: number;
  private _userId: number;
  private _assemblyData: any;
  private asemblyDataSubject$ = new Subject();
  private groupName = new BehaviorSubject('');
  public currentAssemblyValue = this.asemblyDataSubject$.asObservable();
  public groupNameObservable = this.groupName.asObservable();
  private resetSubject$ = new Subject();
  public resetValueObservable = this.resetSubject$.asObservable();
  public groups: any;
  private assemblyFormValue: any;
  public families: any;
  public cancelRouteValues: any = {
    familyId: '',
    assemblyId: ''
  };
  public dupElement: any = [];
  public categories: any;
  // public _addElement$ = new Subject();
  // public addElement = this._addElement$.asObservable();

  public _removedElement$ = new BehaviorSubject('');
  public removedElement = this._removedElement$.asObservable();

  public junctionBoxComponents: number[] = [];

  public editedComponentData: any[] = [];
  constructor(private restApiService: RestApiService, private sessionService: SessionService) {
    const companyId = sessionStorage.getItem('companyId') || '';
    const sessionCompany = this.sessionService.decrypt(companyId);
    if (sessionCompany !== null) {
      this._companyId = parseInt(sessionCompany);
    }
    const userId = sessionStorage.getItem('userId') || '';
    const sessionUser = this.sessionService.decrypt(userId);
    if (sessionUser !== null) {
      this._userId = parseInt(sessionUser);
    }
  }

  public currentAssemblyData(data: any) {
    this.asemblyDataSubject$.next(data);
  }

  public currentGroupName(val: any) {
    this.groupName.next(val);
  }

  // public addedComponents(val: any){

  //   this._addElement$.next(val);
  // }

  public removedComponents(val: any) {
    this._removedElement$.next(val);
  }

  public completeComponents() {
    this._removedElement$.complete();
  }

  public resetAssemblyData(val: string) {
    this.resetSubject$.next(val);
  }

  setCompanyId(id: number) {
    this._companyId = id;
  }

  public get companyId(): number {
    return this._companyId;
  }

  setUserId(id: number) {
    this._userId = id;
  }

  public get userId(): number {
    return this._userId;
  }

  public setAssemblyFormValue(value: any) {
    this.assemblyFormValue = value;
  }

  public getAssemblyFormValue() {
    return this.assemblyFormValue;
  }

  public setAssemblyData(assebmlyData: any) {
    this._assemblyData = assebmlyData;
    this.currentAssemblyData(assebmlyData);
  }

  public setGroups(groups: any) {
    this.groups = groups;
  }

  public getGroups(){
    return this.groups;
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

  public getComponents(companyId: number, categoryId: number, pageIndex:number = 0, includeImage: boolean = true) {
    const queryParam = 'companyId=' + companyId + '&categoryId=' + categoryId + '&includeImage=' + includeImage + `&pageIndex=${pageIndex}&pageSize=100`;
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

  public getAllAssemblies(companyId: number, familyId: number) {
    let queryParam: string;
    if (familyId == 0) {
      queryParam = 'companyId=' + companyId + '&includeImage=true';
    } else {
      queryParam = 'companyId=' + companyId + '&familyId=' + familyId + '&includeImage=true' ;
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
    if (environment.mockEnabled) {
      id = 10191;
    }
    return this.restApiService.get(`assemblies/${id}/get-components`, '', '');
  }
  public saveAssemblyComponents(reqObj: any, assemblyId: number): Observable<any> {
    return this.restApiService.post(`assemblies/${assemblyId}/save-components`, reqObj, '');
  }

  public updateAssemblyComponents(reqObj: any, assemblyId: number): Observable<any> {
    return this.restApiService.put(`assemblies/${assemblyId}/save-components`, reqObj, '');
  }

  public getAssemblyById(assemblyId: number) {
    if (environment.mockEnabled) {
      assemblyId = 10191;
    }
    return this.restApiService.get(`assemblies/${assemblyId}`, '', '');
  }

  public deleteAssembly(assemblyId: number) {
    return this.restApiService.delete(`assemblies/${assemblyId}`, '', '');
  }

  public getComponentFilters(categoryId: number) {
    const companyId = sessionStorage.getItem('companyId') || '';
    const sessionCompany = this.sessionService.decrypt(companyId);
    const queryParam = `companyId=${sessionCompany}&categoryId=${categoryId}`;
    return this.restApiService.get(`components/filters`, '', queryParam);
  }

  public postComponentFilters(categoryId: number, reqObj: any) {
    const companyId = sessionStorage.getItem('companyId') || '';
    const sessionCompany = this.sessionService.decrypt(companyId);
    return this.restApiService.post(`components/apply-filters?companyId=${sessionCompany}&categoryId=${categoryId}`, reqObj, '');
  }

  public createTemplate(reqObj: any) {
    return this.restApiService.post(`assemblies/create-template`, reqObj, '');
  }

  public requestComponent(reqObj: any) {
    return this.restApiService.post(`components/request-component`, reqObj, '');
  }

}
