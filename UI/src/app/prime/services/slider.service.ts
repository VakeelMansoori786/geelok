import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseApiUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SliderService {
  private carouselItem:any;
  constructor(private httpClient:HttpClient) { }

  SaveCarousel(model:any) {
    return this.httpClient.post(`${baseApiUrl}/api/slider/SaveCarousel`,model)
   }
   GetCarousel() {
    return this.httpClient.get(`${baseApiUrl}/api/slider/GetCarousel`)
   }
   DeleteCarousel(id:any) {
    return this.httpClient.get(`${baseApiUrl}/api/slider/DeleteCarousel/`+id)
   }


   SaveVideo(model:any) {
    return this.httpClient.post(`${baseApiUrl}/api/slider/SaveVideo`,model)
   }
   GetVideo() {
    return this.httpClient.get(`${baseApiUrl}/api/slider/GetVideo`)
   }
   DeleteVideo(id:any) {
    return this.httpClient.get(`${baseApiUrl}/api/slider/DeleteVideo/`+id)
   }
   SaveHealthTipDetails(model:any) {
    return this.httpClient.post(`${baseApiUrl}/api/slider/SaveHealthTipDetails`,model)
   }
   GetHealthTipDetails() {
    return this.httpClient.get(`${baseApiUrl}/api/slider/GetHealthTipDetails`)
   }
   DeleteHealthTipDetails(id:any) {
    return this.httpClient.get(`${baseApiUrl}/api/slider/DeleteHealthTipDetails/`+id)
   }

   GetHealthTipCategory() {
    return this.httpClient.get(`${baseApiUrl}/api/slider/GetHealthTipCategory`)
   }

   
   GetItem(model:any) {
    return this.httpClient.post(`${baseApiUrl}/api/item/GetItem`,model)
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
