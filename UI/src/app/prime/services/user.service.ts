import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseApiUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient:HttpClient) { }
  
  GetLdapUser(model:any) {
    return this.httpClient.post(`${baseApiUrl}/api/GetLdapUser`,model)
   }
   AddSliderUser(model:any) {
     return this.httpClient.post(`${baseApiUrl}/api/slider/AddSliderUser`,model)
    }
    
    GetSliderUserId(id:any) {
    return this.httpClient.get(`${baseApiUrl}/api/slider/GetSliderUserId/`+id)
   }
    GetSliderUser() {
    return this.httpClient.get(`${baseApiUrl}/api/slider/GetSliderUser`)
   }
    SliderMenu() {
      return this.httpClient.get(`${baseApiUrl}/api/slider/SliderMenu`)
     }
     AddUserPermission(model:any) {
       return this.httpClient.post(`${baseApiUrl}/api/slider/AddUserPermission`,model)
      }
      GetSliderUserPermission(model:any) {
        return this.httpClient.get(`${baseApiUrl}/api/slider/GetSliderUserPermission/`+model)
       }
}
