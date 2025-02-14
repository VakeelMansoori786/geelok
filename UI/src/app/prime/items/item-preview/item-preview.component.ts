import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '../../services/local-store.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { APIService } from '../../services/api.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { forkJoin } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { ItemService } from '../../services/item.service';


@Component({
  selector: 'app-item-preview',
  templateUrl: './item-preview.component.html',
  styleUrls: ['./item-preview.component.scss'],
    providers: [MessageService,ConfirmationService]
})
export class ItemPreviewComponent {
  loading = false;
itemsList:any;
Id:any='0'
SelectedItem:any={};
  constructor(
    private formBuilder:FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private ls:LocalStoreService,
      private apiService:APIService,
      private commonService:CommonService,
      private service: MessageService,
      private confirmationService: ConfirmationService,
            private itemService:ItemService,
      ) { }
      ngOnInit() {
        if(this.route.snapshot.paramMap.get('id')){
          
          this.Id= atob(this.route.snapshot.paramMap.get('id')!);
        this.LoadItem();
          
         }

      }
      LoadItem(){
        
        this.itemsList=this.commonService.getItems();
        
        if (!this.itemsList || Object.keys(this.itemsList).length === 0) 
        {
          let req={
            p_item_id:'0'
          }
          this.loading=true;
          this.itemService.GetItem(req).subscribe((data:any) => {
              this.itemsList=data;
              this.SelectedItem=this.itemsList.find(x=>x.item_id)
          this.loading=false;
          });
        }
        else{
          this.SelectedItem=this.itemsList.find(x=>x.item_id)
        }
      }
      GetItem(model: any) {
        this.SelectedItem=model
        this.itemService.setItemId(model.item_id);

      }
      
Delete(id:any){
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

      this.itemService.DeleteItem(id).subscribe((data:any) => {
        this.service.add({ key: 'tst', severity: 'success', summary: 'Success Message', detail:data[0].Msg });
      
    this.ngOnInit();
      });
    },
    reject: () => {
        this.service.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }
});

 
}
}
