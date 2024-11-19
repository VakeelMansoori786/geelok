import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '../../services/local-store.service';
import { ConfirmationService, MessageService } from 'primeng/api';

import { forkJoin } from 'rxjs';
import { SliderService } from '../../services/slider.service';
import { APIService } from '../../services/api.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.component.html',
  styleUrls: ['./bill-list.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class BillListComponent  implements OnInit {
  

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

      p_purchase_bill_id:id
    }
    this.loading=true;

    this.apiService.GetBill(req).subscribe((data:any) => {
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
  this.router.navigate(['/purchase/bill',{ id: btoa(id) },]);

}
Delete(event:any,id:any){
  this.confirmationService.confirm({
    target: event.target as EventTarget,
    message: 'Are you sure that you want to delete?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon:"none",
    rejectIcon:"none",
    rejectButtonStyleClass:"p-button-text",
    accept: () => {
      this.loading=true;

      this.sliderService.DeleteHealthTipDetails(id).subscribe((data:any) => {
        this.service.add({ key: 'tst', severity: 'success', summary: 'Success Message', detail:data['carousel'][0].Msg });
      
    this.ngOnInit();
      });
    },
    reject: () => {
        this.service.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }
});

 
}
Add(){
  this.router.navigate(['/purchase/bill']);
}
onImageError(event: any): void {
  event.target.src = 'assets/layout/images/not_found_img.png';  // Set the source to default image
}
}
