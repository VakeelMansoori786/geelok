import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseApiUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private carouselItem:any;
  constructor(private httpClient:HttpClient) { }

  GetItem(model:any) {
    return this.httpClient.post(`${baseApiUrl}/api/item/GetItem`,model)
   }
  
   SaveItem(model:any) {
    return this.httpClient.post(`${baseApiUrl}/api/item/SaveItem`,model)
   }

   
}
