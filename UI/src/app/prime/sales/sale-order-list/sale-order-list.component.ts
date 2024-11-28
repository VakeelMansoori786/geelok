import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '../../services/local-store.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SliderService } from '../../services/slider.service';
import { APIService } from '../../services/api.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-sale-order-list',
  templateUrl: './sale-order-list.component.html',
  styleUrls: ['./sale-order-list.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class SaleOrderListComponent   implements OnInit {
  

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

      p_sale_order_id:id
    }
    this.loading=true;

    this.apiService.GetOrder(req).subscribe((data:any) => {
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
  this.router.navigate(['/sale/order',{ id: btoa(id) },]);

}

Add(){
  this.router.navigate(['/sale/order']);
}
Covert(id:any){
  this.router.navigate(['/sale/bill',{ po: btoa(id) },]);

}
}

