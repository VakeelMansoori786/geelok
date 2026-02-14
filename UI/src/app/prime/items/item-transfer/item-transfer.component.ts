import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '../../services/local-store.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { APIService } from '../../services/api.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { forkJoin } from 'rxjs';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-item-transfer',
  templateUrl: './item-transfer.component.html',
  styleUrls: ['./item-transfer.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class ItemTransferComponent implements OnInit {
  loading = false;
  mainForm :any;
  
companyList: any;
itemTypeList: any;
selectedItem: any={};
suggestions: any=[] ;
totalSize : number = 0;
Id:any='0'
totalSizePercent : number = 0;
rows = [
  { id:0,item_id: 0,item_name: '', qty: '' }
];
  constructor(
    private formBuilder:FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private ls:LocalStoreService,
      private apiService:APIService,
            private itemService:ItemService,
      private service: MessageService
      ) { }
  ngOnInit() {
    this.mainForm = this.formBuilder.group({
      p_transfer_order_id: ['0'], // Assuming similar structure as item
      p_reason: [''],
      p_from_company_id: ['', Validators.required],
      p_to_company_id: ['', Validators.required],
      p_is_active: [1], // Default active
      p_create_by: [1], // Assuming a default user ID
      p_order_details: [this.rows, Validators.required], // Expecting an array for order details
    });

    if(this.route.snapshot.paramMap.get('id')){
      this.Id= atob(this.route.snapshot.paramMap.get('id')!);

     }
    this.loadDropdowns()

  }

  loadDropdowns() {
    forkJoin({
      companies: this.apiService.GetCompany()
    }).subscribe(({ companies }) => {
      this.companyList = companies;
  
      // If editing, update the form after loading data
      if (this.Id!=0) {
        this.fetchItemDetails(this.Id);
      }
    });
  }
  fetchItemDetails(id: any) {
    let req={

      p_transfer_order_id:id
    }
    this.loading=true;

    this.apiService.GetTransferOrder(req).subscribe((data:any) => {
      
      if(data.length>0){
      const item = data[0][0];  // Assuming the response structure is correct
      
      // Populate the form with the fetched data
      this.mainForm.patchValue({
        p_transfer_order_id: item.transfer_order_id,
        p_reason: item.reason,
        p_from_company_id:this.companyList.find(x=>x.company_id==item.to_company_id) ,
        p_to_company_id: this.companyList.find(x=>x.company_id==item.from_company_id) ,
         });
     
if(data.length>2){
  const mappedData = data[1].map((item, index) => ({
    id: index,                        
    item_id: item.item_id || null,    
    item_name: item.item_name || '',  
    qty: item.qty || '' 
}));
  
 
  this.rows = mappedData // Assuming p_item_stock is an array of rows
}
    }
   
      
    });
  }

  SaveTransferOrder() {
    
    if (!this.mainForm.valid) {
      this.mainForm.markAllAsTouched();
      // Optionally show a warning message
      return;
    } else {
      this.loading = true;

      let model = this.mainForm.value; // Get form values

      // Construct the request object
      let req = {
        p_transfer_order_id: model.p_transfer_order_id,
        p_reason: model.p_reason,
        p_from_company_id: model.p_from_company_id.company_id,
        p_to_company_id: model.p_to_company_id.company_id,
        p_order_details:JSON.stringify(this.rows.map(item => ({
          id: item.id,  
          item_id: item.item_id, 
          qty: item.qty
        })))
      };
 
      

      
      // Make the API call
      this.apiService.SaveTransferOrder(req).subscribe((data:any) => {
        
          this.service.add({
            key: 'tst',
            severity: 'success',
            summary: 'Success Message',
            detail: data[0]['msg'], // Adjust based on the API response structure
          });
          this.router.navigate(['/items/transfer-list']); // Adjust route as needed
          this.loading = false; // Reset loading state
        });
      
    }
  }
  Clear(){
    this.mainForm.reset();

  }

  
  GetCompany() {
    this.loading=true;

    this.apiService.GetCompany().subscribe((data:any) => {
        this.companyList=data;
       
     
    this.loading=false;


    });
  }
  GetItem(id:any) {
    this.loading=true;
let model={
  p_item_id:id
}
    this.itemService.GetItem(model).subscribe((data:any) => {
        this.companyList=data;
       
     
    this.loading=false;


    });
  }

  addRow() {
    const newId = this.rows.length ? this.rows[this.rows.length - 1].id + 1 : 1;
    this.rows.push({ id: newId,item_id:0 ,item_name: '',qty:'' });
   
  }

  removeRow(id: number) {
    this.rows = this.rows.filter(row => row.id !== id);
  }

  
  search(event: AutoCompleteCompleteEvent) {
  
    //this.suggestions = [...Array(10).keys()].map(item => event.query + '-' + item);
let model={
  name:event.query
}
    this.itemService.GetItemByName(model).subscribe((data:any) => {
      this.selectedItem=data;
      this.suggestions =data.map(row => row.name );;
      
    });
}
onSelect(event: any, index: number) {
  
  const ab=this.selectedItem.find(x=>x.name==event);
  this.rows[index].item_id=ab.item_id
  this.rows[index].item_name=event
}
}

