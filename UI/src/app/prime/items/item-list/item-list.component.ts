import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '../../services/local-store.service';
import { SliderService } from '../../services/slider.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { APIService } from '../../services/api.service';


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
      ) { }
  ngOnInit() {
    this.GetItem('0'); 
  }

  GetItem(id:any) {
    this.loading=true;

    this.apiService.GetItem(id).subscribe((data:any) => {
        this.mainList=data.data;
       
     
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
  this.router.navigate(['/news/detail',{ id: btoa(id) },]);

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
}

