import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '../../services/local-store.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { APIService } from '../../services/api.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { forkJoin } from 'rxjs';
import { CommonService } from '../../services/common.service';
import { ItemService } from '../../services/item.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-invoice-preview',
  templateUrl: './invoice-preview.component.html',
  styleUrls: ['./invoice-preview.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class InvoicePreviewComponent  {
  
  
    @ViewChild('filter1') filter1!: ElementRef;
    @ViewChild('filter2') filter2!: ElementRef;
  loading = [false,false,false,false];
itemsList:any;
warehousesList:any;
Id:any='0'
SelectedItem:any={};

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
      ) { }
      ngOnInit() {
        debugger
        if(this.route.snapshot.paramMap.get('id')){
          
          this.Id= atob(this.route.snapshot.paramMap.get('id')!);
        this.LoadData();

         }

      }
      LoadData(){
        
        this.itemsList=this.commonService.getInvoices();
        
        if (!this.itemsList || Object.keys(this.itemsList).length === 0) 
        {
          let req={
            p_invoice_id:'0'
          }
          this.loading[0]=true;
         this.apiService.GetInvoice(req).subscribe((data:any) => {
              this.itemsList=data;
              this.SelectedItem=this.itemsList.find(x=>x.invoice_id==this.Id)
          this.loading[0]=false;
          });
        }
        else{
          this.SelectedItem=this.itemsList.find(x=>x.invoice_id==this.Id);
         
        }
    
      }
      GetItem(model: any) {
        this.SelectedItem = model;
        this.Id = model.invoice_id;
     
        // Navigate to the same page but with updated ID
        this.router.navigate(['/sales/invoice-preview', { id: btoa(model.invoice_id),type: btoa('TAX INVOICE')  }]).then(() => {
          window.location.reload(); // Force reload
        });
      }
 




}
