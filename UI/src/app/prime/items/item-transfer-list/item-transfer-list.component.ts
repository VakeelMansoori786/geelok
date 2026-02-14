import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '../../services/local-store.service';
import { SliderService } from '../../services/slider.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { APIService } from '../../services/api.service';


@Component({
  selector: 'app-item-transfer-list',
  templateUrl: './item-transfer-list.component.html',
  styleUrls: ['./item-transfer-list.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class ItemTransferListComponent  implements OnInit {
  

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
    this.GetTransferOrder('0'); 
  }

  GetTransferOrder(id:any) {
    let req={

      p_transfer_order_id:id
    }
    this.loading=true;

    this.apiService.GetTransferOrder(req).subscribe((data:any) => {
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
  this.router.navigate(['/items/transfer',{ id: btoa(id) },]);

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
const model={
  p_transfer_order_id:id
}
      this.apiService.DeleteTransferOrder(model).subscribe((data:any) => {

        if(data[0].is_error==0){
        this.service.add({ key: 'tst', severity: 'success', summary: 'Success Message', detail:data[0].msg });
        }
        else{
            this.service.add({ key: 'tst', severity: 'error', summary: 'Error Message', detail:data[0].msg });
        }
      
    this.ngOnInit();
      });
    },
    reject: () => {
        this.service.add({ key: 'tst',severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }
});

 
}
Add(){
  this.router.navigate(['/items/transfer']);
}
onImageError(event: any): void {
  event.target.src = 'assets/layout/images/not_found_img.png';  // Set the source to default image
}
}

