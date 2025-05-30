import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { baseApiUrl } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private items:any={};
  private invoices:any={};
  constructor(private httpClient:HttpClient) { }

  getItems(){
    return this.items;
  }
  setItems(model:any){
    return this.items=model;
  }
  
  getInvoices(){
    return this.invoices;
  }
  setInvoices(model:any){
    return this.invoices=model;
  }
  numberToWordsCurrency(amount: number, currency: string): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six',
    'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve',
    'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen',
    'Eighteen', 'Nineteen'];

  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const scales = ['', 'Thousand', 'Million', 'Billion'];

  const getCurrencyName = (code: string): string => {
    switch (code?.toUpperCase()) {
      case 'INR': return 'Rupees';
      case 'USD': return 'Dollars';
      case 'AED': return 'Dirhams';
      case 'SAR': return 'Riyals';
      case 'OMR': return 'Rials';
      case 'BHD': return 'Dinars';
      case 'KWD': return 'Dinars';
      default: return '';
    }
  };

  const getCurrencySubunit = (code: string): string => {
    switch (code.toUpperCase()) {
      case 'INR': return 'Paise';
      case 'USD': return 'Cents';
      case 'AED': return 'Fils';
      case 'SAR': return 'Halalas';
      case 'OMR': return 'Baisa';
      case 'BHD': return 'Fils';
      case 'KWD': return 'Fils';
      default: return '';
    }
  };

  if (amount === 0) return `Zero ${getCurrencyName(currency)}`;

  const chunk = (n: number): string => {
    let str = '';
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      str += ones[n] + ' ';
    }
    return str.trim();
  };

  const toWords = (num: number): string => {
    let result = '';
    let scale = 0;

    while (num > 0) {
      const n = num % 1000;
      if (n !== 0) {
        result = `${chunk(n)} ${scales[scale]} ${result}`.trim();
      }
      num = Math.floor(num / 1000);
      scale++;
    }
    return result.trim();
  };

  const integerPart = Math.floor(amount);
  const decimalPart = Math.round((amount - integerPart) * 100);

  const major = toWords(integerPart);
  const minor = decimalPart > 0 ? `and ${toWords(decimalPart)} ${getCurrencySubunit(currency)}` : '';

  return `Total In Words: ${major} ${getCurrencyName(currency)} ${minor} Only`.trim();
}
}
