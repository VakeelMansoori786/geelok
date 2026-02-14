import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '../../services/local-store.service';
import { SliderService } from '../../services/slider.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { APIService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { ItemService } from '../../services/item.service';


@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class ItemListComponent implements OnInit {
  

  @ViewChild('filter') filter!: ElementRef;
  
  loading = false;
  mainForm :any;
  mainList:any;
 statuses = [
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
];
  constructor(
    private formBuilder:FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private ls:LocalStoreService,
      private sliderService:SliderService,
      private service: MessageService,
      private confirmationService: ConfirmationService,
      private apiService:APIService,
            private itemService:ItemService,
       private commonService:CommonService
      ) { }
  ngOnInit() {
    this.GetItem('0'); 
  }

  GetItem(id:any) {
    let req={
      p_item_id:id
    }
    this.loading=true;
    this.itemService.GetItem(req).subscribe((data:any) => {
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
  this.router.navigate(['/items/detail',{ id: btoa(id) },]);

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
  p_item_id:id
}
      this.itemService.DeleteItem(model).subscribe((data:any) => {

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
  this.router.navigate(['/items/detail']);
}
onImageError(event: any): void {
  event.target.src = 'assets/layout/images/not_found_img.png';  // Set the source to default image
}
Preview(id:any){
  debugger
this.commonService.setItems(this.mainList);
this.itemService.setItemId(id);
  this.router.navigate(['/items/preview',{ id: btoa(id) },]);
}
}

