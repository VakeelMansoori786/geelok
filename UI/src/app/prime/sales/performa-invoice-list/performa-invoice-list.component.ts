import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '../../services/local-store.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SliderService } from '../../services/slider.service';
import { APIService } from '../../services/api.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-performa-invoice-list',
  templateUrl: './performa-invoice-list.component.html',
  styleUrls: ['./performa-invoice-list.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class PerformaInvoiceListComponent   implements OnInit {
  

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
      ) { }
  ngOnInit() {
    this.GetData('0'); 
  }

  GetData(id:any) {
    let req={

      p_performa_invoice_id:id
    }
    this.loading=true;

    this.apiService.GetProformaInvoice(req).subscribe((data:any) => {
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
  this.router.navigate(['/sales/performa-invoice',{ id: btoa(id) },]);

}

Add(){
  this.router.navigate(['/sales/performa-invoice']);
}
Convert(type:any,id:any){
  if(type=='DN')this.router.navigate(['/sales/delivery-note',{ pi: btoa(id) },]);
  if(type=='IN')this.router.navigate(['/sales/invoice',{ pi: btoa(id) },]);

}
}

