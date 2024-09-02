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
   
   SaveItem(model:any) {
    return this.httpClient.post(`${baseApiUrl}/api/item/SaveItem`,model)
   }
   GetCarouselItem(){

    return this.carouselItem;
   }
   
   SetCarouselItem(model:any){
    this.carouselItem = model;
   }


   
}
