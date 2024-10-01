import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseApiUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  private carouselItem:any;
  constructor(private httpClient:HttpClient) { }

  
   
   GetItem(model:any) {
    return this.httpClient.post(`${baseApiUrl}/api/item/GetItem`,model)
   }

   GetBrand() {
    return this.httpClient.get(`${baseApiUrl}/api/global/GetBrand`)
   }
   
   GetUnit() {
    return this.httpClient.get(`${baseApiUrl}/api/global/GetUnit`)
   }
   
   GetItemGroup() {
    return this.httpClient.get(`${baseApiUrl}/api/global/GetItemGroup`)
   }
   GetCountry() {
    return this.httpClient.get(`${baseApiUrl}/api/global/GetCountry`)
   }
   
   
   
   SaveItem(model:any) {
    return this.httpClient.post(`${baseApiUrl}/api/item/SaveItem`,model)
   }

   
   SaveTransferOrder(model:any) {
    return this.httpClient.post(`${baseApiUrl}/api/item/SaveTransferOrder`,model)
   }

   GetCarouselItem(){

    return this.carouselItem;
   }
   
   SetCarouselItem(model:any){
    this.carouselItem = model;
   }


   
}
