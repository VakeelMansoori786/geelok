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
  loading = [false,false,false,false];
itemsList:any;
warehousesList:any;
Id:any='0'
SelectedItem:any={};
filterList: any[] = [
  { name: 'Invoices', value: 'Invoices' },
  { name: 'Delivery Callans', value: 'Delivery Callans' },
  { name: 'Credit Notes', value: 'Credit Notes' },
  { name: 'Bills', value: 'Bills' },
  { name: 'Transfer Order', value: 'Transfer Order' }
];
transactionList:any={};

  constructor(
    private formBuilder:FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
  private activatedRoute: ActivatedRoute,
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
        this.GetCompanyItemStock(this.Id)
         }

      }
      LoadItem(){
        
        this.itemsList=this.commonService.getItems();
        
        if (!this.itemsList || Object.keys(this.itemsList).length === 0) 
        {
          let req={
            p_item_id:'0'
          }
          this.loading[0]=true;
          this.itemService.GetItem(req).subscribe((data:any) => {
              this.itemsList=data;
              this.SelectedItem=this.itemsList.find(x=>x.item_id==this.Id)
          this.loading[0]=false;
          });
        }
        else{
          this.SelectedItem=this.itemsList.find(x=>x.item_id==this.Id);
         
        }
    
      }
      GetItem(model: any) {
        this.SelectedItem = model;
        this.Id = model.item_id;
        this.itemService.setItemId(model.item_id);
      
        // Navigate to the same page but with updated ID
        this.router.navigate(['/items/preview',{ id: btoa(model.item_id) },]);
      }
      GetCompanyItemStock(item_id:any){
        let req={
          p_item_id:item_id
        }
        this.loading[1]=true;
        this.itemService.GetCompanyItemStock(req).subscribe((data:any) => {
           this.warehousesList=data;
        this.loading[1]=false;
        });
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
      this.loading[0]=true;

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

GetTransaction(type:any){
  this.loading[2]=true;
  debugger
  const model={
    p_type:type,
    p_item_id:this.Id
  }
  this.transactionList={};
  this.itemService.GetItemTransaction(model).subscribe((data:any) => {
    if (data && data.length > 0) {
      this.transactionList.columns = Object.keys(data[0]); // Extract column names dynamically
      this.transactionList.list = data;
    }
    else{
      this.transactionList.error='No '+type+' created yet'
    }
    
    this.loading[2] = false;
  });
}
}
