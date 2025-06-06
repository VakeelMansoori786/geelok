import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '../../services/local-store.service';
import { ConfirmationService, MessageService } from 'primeng/api';

import { forkJoin } from 'rxjs';
import { SliderService } from '../../services/slider.service';
import { APIService } from '../../services/api.service';
import { Table } from 'primeng/table';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class InvoiceListComponent    implements OnInit {
  

  @ViewChild('filter') filter!: ElementRef;
  
  loading = false;
  mainForm :any;
  mainList:any;

  constructor(
    private formBuilder:FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private ls:LocalStoreService,
      private sliderService:SliderService,
      private service: MessageService,
      private confirmationService: ConfirmationService,
      private apiService:APIService,
      private commonService:CommonService,
      ) { }
  ngOnInit() {
    this.GetData('0'); 
  }

  GetData(id:any) {
    let req={

      p_invoice_id:id
    }
    this.loading=true;

    this.apiService.GetInvoice(req).subscribe((data:any) => {
        this.mainList=data;
    this.loading=false;


    });
  }


  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
}

clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
}
GetDetail(id:any){
  this.router.navigate(['/sales/invoice',{ id: btoa(id) },]);

}

Add(){
  this.router.navigate(['/sales/invoice']);
}
GetPreview(id:any){
  this.router.navigate(['/invoice',{ id: btoa(id),type: btoa('TAX INVOICE')},]);
}

Preview(id:any){
  
this.commonService.setInvoices(this.mainList);
  this.router.navigate(['/sales/invoice-preview',{ id: btoa(id),type: btoa('TAX INVOICE') },]);
}
}
