import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '../../services/local-store.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { APIService } from '../../services/api.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

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
      private service: MessageService
      ) { }
  ngOnInit() {
    this.mainForm = this.formBuilder.group({
      p_transfer_order_id: ['0'], // Assuming similar structure as item
      p_ref_no: [''],
      p_reason: [''],
      p_from_company_id: ['', Validators.required],
      p_to_company_id: ['', Validators.required],
      p_is_active: [1], // Default active
      p_create_by: [1], // Assuming a default user ID
      p_order_details: [this.rows, Validators.required], // Expecting an array for order details
    });
  this.GetCompany();
    if(this.route.snapshot.paramMap.get('id')){
      let id = atob(this.route.snapshot.paramMap.get('id')!);
//this.GetCarousel(id);
     }
     else{
      
     }
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
        debugger
          this.service.add({
            key: 'tst',
            severity: 'success',
            summary: 'Success Message',
            detail: data['msg'], // Adjust based on the API response structure
          });
          this.router.navigate(['/transfer-order/list']); // Adjust route as needed
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
    this.apiService.GetItem(model).subscribe((data:any) => {
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
    this.apiService.GetItemByName(model).subscribe((data:any) => {
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

