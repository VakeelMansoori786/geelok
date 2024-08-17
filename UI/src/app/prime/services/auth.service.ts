import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { baseApiUrl } from 'src/environments/environment';
import { LocalStoreService } from './local-store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token:any;
  isAuthenticated:any;
  signingIn:any;
  return:any;
  user:any;
  user$=(new BehaviorSubject<any>(this.ls.getItem("user")));
  menu=(new BehaviorSubject<any>(this.ls.getItem("menu")));
  panel=(new BehaviorSubject<any>(this.ls.getItem("menu")));
  myMenu = this.menu.asObservable();
  mypanel = this.menu.asObservable();
  jwtToken="token";
  appUser="user";
  isLogging="isLogging";
    
   constructor(
     private ls:LocalStoreService,
     private router:Router,
     private route:ActivatedRoute,
     private httpClient:HttpClient
   ) { 
     
   }
    // login(model:any) {
    //  return this.httpClient.post(`${baseApiUrl}/api/token`,model)
    // }
    login(model:any) {
     return this.httpClient.post(`${baseApiUrl}/api/global/GetLogin`,model)
    }
    GetCompanyUser(model:any) {
     return this.httpClient.post(`${baseApiUrl}/api/global/GetCompanyUser`,model)
    }
    IsTokenValid(model:any) {
     return this.httpClient.post(`${baseApiUrl}/api/user/IsTokenValid`,model)
    }
    GetUerMenu() {
      return this.httpClient.get(`${baseApiUrl}/api/Account/GetUerMenu`)
     }
     GetPanelMenu() {
      return this.httpClient.get(`${baseApiUrl}/api/Account/GetPanelMenu`)
     }
     GetProgramsRole(ProgramId:string) {
      return this.httpClient.get(`${baseApiUrl}/api/Account/GetProgramsRole?GetProgramsRole=`+ProgramId)
     }
     GetProgramControlPermission(ProgramId:any) {
      return this.httpClient.get(`${baseApiUrl}/api/Account/GetProgramControlPermission?ProgramId=`+ProgramId)
     }
 public makeLogin(returnUrl:any){
  
   if(this.isLoggedIn()){
     this.router.navigateByUrl(returnUrl)
   }
 }
 public getMenuList(){
  
  return this.ls.getItem('menu')
}
public setMenu(menu:any){
     this.menu.next(menu);
   this.ls.setItem('menu',menu);
}
public setPanelMenu(panel:any){
  this.panel.next(panel);
this.ls.setItem('panel',panel);
}
 public signOut(){
   this.setUserAndToken(null,null,false);
   this.ls.clear();
   
 }
 isLoggedIn():Boolean{
if(this.getJwtToken()) return true;
else return false;
 }
 getJwtToken(){
   return this.ls.getItem(this.jwtToken)
 }
 getUser(){
   return this.ls.getItem(this.appUser)
 }
 
 setUserAndToken(token:any,user:any,isAuthenticated:any){

   this.ls.setItem(this.jwtToken,token);
   this.ls.setItem(this.appUser,user);
   this.ls.setItem(this.isLogging,isAuthenticated);
 }

 

 getSession(name:any){
  return this.ls.getItem(name)
 }
 setSession(key:any,value:any){
   this.ls.setItem(key,value)
 }
 removeSession(key:any){
  this.ls.removeItem(key)
 }

}