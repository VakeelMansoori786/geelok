import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseApiUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  private carouselItem:any;
  constructor(private httpClient:HttpClient) { }

  
//#region Customer
GetCustomer(model:any) {
  return this.httpClient.post(`${baseApiUrl}/api/Customer/GetCustomer`,model)
 }
 DeleteCustomer(model:any) {
  return this.httpClient.post(`${baseApiUrl}/api/Customer/DeleteCustomer`,model)
 }

//#endregion

   
   GetItem(model:any) {
    return this.httpClient.post(`${baseApiUrl}/api/item/GetItem`,model)
   }

   
   GetItemByName(model:any) {
    return this.httpClient.post(`${baseApiUrl}/api/item/GetItemByName`,model)
   }

   GetBrand() {
    return this.httpClient.get(`${baseApiUrl}/api/global/GetBrand`)
   }
   
   GetTax() {
    return this.httpClient.get(`${baseApiUrl}/api/global/GetTax`)
   }
   
   GetUnit() {
    return this.httpClient.get(`${baseApiUrl}/api/global/GetUnit`)
   }
   GetPaymentTerm() {
    return this.httpClient.get(`${baseApiUrl}/api/global/GetPaymentTerm`)
   }
   
   
   GetItemGroup() {
    return this.httpClient.get(`${baseApiUrl}/api/global/GetItemGroup`)
   }
   GetCountry() {
    return this.httpClient.get(`${baseApiUrl}/api/global/GetCountry`)
   }
   
   GetCustomerAddress(model:any) {
    return this.httpClient.post(`${baseApiUrl}/api/global/GetCustomerAddress`,model)
   }

   GetCompanyAddress(model:any) {
    return this.httpClient.post(`${baseApiUrl}/api/global/GetCompanyAddress`,model)
   }

   
   
   SaveItem(model:any) {
    return this.httpClient.post(`${baseApiUrl}/api/item/SaveItem`,model)
   }

   
   SaveTransferOrder(model:any) {
    return this.httpClient.post(`${baseApiUrl}/api/item/SaveTransferOrder`,model)
   }

   GetTransferOrder(model:any) {
    return this.httpClient.post(`${baseApiUrl}/api/item/GetTransferOrder`,model)
   }


   GetCompany() {
    return this.httpClient.get(`${baseApiUrl}/api/global/GetCompany`)
   }
   

 //#region Purchase

//#region Purchase Order
SaveOrder(model:any) {
  return this.httpClient.post(`${baseApiUrl}/api/purchase/SaveOrder`,model)
 }
 GetOrder(model:any) {
  return this.httpClient.post(`${baseApiUrl}/api/purchase/GetOrder`,model)
 }

   //#endregion
//#region Bill
SaveBill(model:any) {
  return this.httpClient.post(`${baseApiUrl}/api/purchase/SaveBill`,model)
 }
 GetBill(model:any) {
  return this.httpClient.post(`${baseApiUrl}/api/purchase/GetBill`,model)
 }

   //#endregion

//#endregion

}
