import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseApiUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private items:any={};
  constructor(private httpClient:HttpClient) { }

  getItems(){
    return this.items;
  }
  setItems(model:any){
    return this.items=model;
  }
}
