import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '../../services/local-store.service';
import { SliderService } from '../../services/slider.service';
import { ConfirmationService, MessageService } from 'primeng/api';
interface expandedRows {
  [key: string]: boolean;
}
@Component({
  selector: 'app-slider-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss'],
  providers: [MessageService,ConfirmationService]
})

export class NewsListComponent implements OnInit {
  

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
      private confirmationService: ConfirmationService
      ) { }
  ngOnInit() {
    this.GetHealthTipDetails(); 
  }

  GetHealthTipDetails() {
    this.loading=true;

    this.sliderService.GetHealthTipDetails().subscribe((data:any) => {
        this.mainList=data.data;
        if(data.success){
          
        }
     
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
