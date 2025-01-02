import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseApiUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  private carouselItem:any;
  constructor(private httpClient:HttpClient) { }

  
  GetUserList(model:any) {
    return this.httpClient.post(`${baseApiUrl}/api/global/GetUserList`,model)
   }
  
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
   GetCurrency() {
    return this.httpClient.get(`${baseApiUrl}/api/global/GetCurrency`)
   }
   GetPaymentTerm() {
    return this.httpClient.get(`${baseApiUrl}/api/global/GetPaymentTerm`)
   }
   
   GetPaymentType() {
    return this.httpClient.get(`${baseApiUrl}/api/global/GetPaymentType`)
   }
   
   
   GetItemGroup() {
    return this.httpClient.get(`${baseApiUrl}/api/global/GetItemGroup`)
   }
   GetCountry() {
    return this.httpClient.get(`${baseApiUrl}/api/global/GetCountry`)
   }
   GetAccount() {
    return this.httpClient.get(`${baseApiUrl}/api/global/GetAccount`)
   }
   
   GetAddress(model:any) {
    return this.httpClient.post(`${baseApiUrl}/api/global/GetAddress`,model)
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

//#region Payable
SavePayable(model:any) {
  return this.httpClient.post(`${baseApiUrl}/api/purchase/SavePayable`,model)
 }
 GetPayable(model:any) {
  return this.httpClient.post(`${baseApiUrl}/api/purchase/GetPayable`,model)
 }
 GetCustomerPayable(model:any) {
  return this.httpClient.post(`${baseApiUrl}/api/purchase/GetCustomerPayable`,model)
 }

   //#endregion
//#region Expense
SaveExpense(model:any) {
  return this.httpClient.post(`${baseApiUrl}/api/purchase/SaveExpense`,model)
 }
 GetExpense(model:any) {
  return this.httpClient.post(`${baseApiUrl}/api/purchase/GetExpense`,model)
 }

   //#endregion
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


//#region Sales

//#region Performa Invoice

//#region Proforma Invoice
SaveProformaInvoice(model:any) {
  return this.httpClient.post(`${baseApiUrl}/api/sales/SaveProformaInvoice`,model)
 }
 GetProformaInvoice(model:any) {
  return this.httpClient.post(`${baseApiUrl}/api/sales/GetProformaInvoice`,model)
 }

   //#endregion

   

//#region Delivery Note
SaveDeliveryNote(model:any) {
  return this.httpClient.post(`${baseApiUrl}/api/sales/SaveDeliveryNote`,model)
 }
 GetDeliveryNote(model:any) {
  return this.httpClient.post(`${baseApiUrl}/api/sales/GetDeliveryNote`,model)
 }

   //#endregion

//#region Invoice
SaveInvoice(model:any) {
  return this.httpClient.post(`${baseApiUrl}/api/sales/SaveInvoice`,model)
 }
 GetInvoice(model:any) {
  return this.httpClient.post(`${baseApiUrl}/api/sales/GetInvoice`,model)
 }
 GetInvoiceByCustomer(model:any) {
  return this.httpClient.post(`${baseApiUrl}/api/sales/GetInvoiceByCustomer`,model)
 }

   //#endregion

   
//#region Invoice
SaveCreditNote(model:any) {
  return this.httpClient.post(`${baseApiUrl}/api/sales/SaveCreditNote`,model)
 }
 GetCreditNote(model:any) {
  return this.httpClient.post(`${baseApiUrl}/api/sales/GetCreditNote`,model)
 }

   //#endregion
//#region 
//#endregion
}
