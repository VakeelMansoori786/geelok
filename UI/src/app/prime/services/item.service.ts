import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { baseApiUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private ItemData:any;
  private itemIdSubject = new BehaviorSubject<string | null>(null); // BehaviorSubject for item ID
  
  constructor(private httpClient:HttpClient) { }

 
   
  GetItem(model:any) {
    return this.httpClient.post(`${baseApiUrl}/api/item/GetItem`,model)
   }

   DeleteItem(model:any) {
    return this.httpClient.get(`${baseApiUrl}/api/item/DeleteItem?id=`+model)
   }
   GetItemByName(model:any) {
    return this.httpClient.post(`${baseApiUrl}/api/item/GetItemByName`,model)
   }
   
   GetCompanyItemStock(model:any) {
     return this.httpClient.post(`${baseApiUrl}/api/item/GetCompanyItemStock`,model)
    }


   GetItemData(){
return this.ItemData;
   }

   SetItemData(model:any){
 this.ItemData=model;
   }
   setItemId(id:any){
    this.itemIdSubject.next(id);
   }
   getItemId(){
    return this.itemIdSubject.asObservable();
   }
}
