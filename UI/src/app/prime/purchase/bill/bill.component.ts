import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '../../services/local-store.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { APIService } from '../../services/api.service';
import { forkJoin } from 'rxjs';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class BillComponent implements OnInit {
  loading = false;
  mainForm :any;
 
brandList: any;

customerList: any;
paymentTermList: any;
selectedItem: any={};
suggestions: any=[] ;
files = [];
Id:any='0'
totalSize : number = 0;

totalSizePercent : number = 0;
rows = [
  { id:0,item_id: 0,item_name: '', qty: '' , rate: '' , tax: '' , amount: '' }
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
    this.mainForm=this.formBuilder.group({
  
      p_purchase_bill_id:['0'],
      p_customer_id:[''],
      p_brand_id:[''],
      p_bill_no:[''],
      p_order_no:[''],
      p_permit_no:[''],
      p_bill_date:[''],
      p_due_date:[''],
      p_payment_term_id:[''],
      p_notes:[''],
      p_sub_total:[''],
      p_vat:[''],
      p_discount:[''],
      p_total:['']
    
    });
  
    if (this.route.snapshot.paramMap.get('id')) {
     this.Id= atob(this.route.snapshot.paramMap.get('id')!);
  
    }
  this.loadDropdowns();
  }
  fetchData(id: string) {
    let req={

      p_item_id:id
    }
    this.loading=true;

    this.apiService.GetBill(req).subscribe((data:any) => {
      if(data.length>0){
      const item = data[0][0];  // Assuming the response structure is correct
      debugger
      // Populate the form with the fetched data
      this.mainForm.patchValue({
        p_purchase_bill_id: item.p_purchase_bill_id,
        p_customer_id: this.customerList.find(x=>x.customer_id==item.customer_id),
        p_brand_id:this.brandList.find(x=>x.brand_id==item.brand_id) ,
        p_bill_no: item.bill_no,
        p_order_no: item.order_no,
        p_permit_no: item.permit_no,
        p_bill_date: item.bill_date,
        p_notes: item.notes,
        p_sub_total: item.sub_total,
        p_vat: item.vat,
        p_discount: item.discount,
        p_total: item.total
       });
if(data.length>2){
  const mappedData = data[1].map((item, index) => ({
    id: index,                         // Use the index as the id (starting from 0)
    branch_id: item.branch_id || null,    // branch_id will be set to item.branch_id or default to an empty string
    stock: item.stock || '',            // stock will be set to item.stock or default to an empty string
    stock_value: item.stock_value || '' // stock_value will be set to item.stock_value or default to an empty string
}));
  
 
  this.rows = mappedData // Assuming p_item_stock is an array of rows
}
    }
   
      
    });
  }


loadDropdowns() {
  forkJoin({
    brands: this.apiService.GetBrand(),
    paymentTerms: this.apiService.GetPaymentTerm(),
    customers: this.apiService.GetCustomer({p_customer_id:'0'}),
  }).subscribe(({ brands, customers,paymentTerms }) => {
    this.brandList = brands;
    this.customerList = customers;
    this.paymentTermList = paymentTerms;
    
    // If editing, update the form after loading data
    if (this.Id!=0) {
      this.fetchData(this.Id);
    }
  });
}



  SaveItem(model:any) {
    
    if(!this.mainForm.valid)
    {
      this.mainForm.markAllAsTouched();

      //  this.toastr.warning('Please enter all the Field', 'Warning!');
   
      
    }
    else{
      this.loading = true;
      let req={
        p_item_id:model.p_item_id,
        p_item_group_id:model.p_item_group_id.item_group_id,
        p_brand_id:model.p_brand_id.brand_id,
        p_unit_id:model.p_unit_id.unit_id,
        p_country_id:model.p_country_id.country_id,
        p_item_type:model.p_item_type.key,
        p_name:model.p_name,
        p_model_no:model.p_model_no,
        p_hs_code:model.p_hs_code,
        p_cost_price:model.p_cost_price,
        p_dimensions:model.p_dimensions,
        p_weight:model.p_weight,
        p_is_taxable:model.p_is_taxable.tax_treatment_id,
        p_description:model.p_description,
        p_order_details:JSON.stringify(this.rows.map(item => ({
          id: item.id,  
          item_id: item.item_id, 
          qty: item.qty
        })))
      };
      }
      const item_stock = this.rows.map(item => ({
        id: item.id,  // Keep the id as is
        branch_id: item.branch_id.company_id, // Just get the company_id from the branch_id object
        company_name: item.branch_id.company_name, // Add company_name from branch_id
        stock: item.stock,   // Keep stock value
        stock_value: item.stock_value  // Keep stock_value
      }));
      let formData = new FormData();
      formData.append('p_item_id', req.p_item_id);
      formData.append('p_item_group_id', req.p_item_group_id);
      formData.append('p_brand_id', req.p_brand_id);
      formData.append('p_unit_id', req.p_unit_id);
      formData.append('p_country_id', req.p_country_id);
      formData.append('p_item_type', req.p_item_type);
      formData.append('p_name', req.p_name);
      formData.append('p_image',  '');
      formData.append('p_model_no', req.p_model_no);
      formData.append('p_hs_code', req.p_hs_code);
      formData.append('p_cost_price', req.p_cost_price);
      formData.append('p_dimensions', req.p_dimensions);
      formData.append('p_weight', req.p_weight);
      formData.append('p_is_taxable', req.p_is_taxable);
      formData.append('p_description', req.p_description);
      formData.append('p_item_stock',JSON.stringify(item_stock));
      this.apiService.SaveItem(formData).subscribe((data:any) => {
        
        this.service.add({ key: 'tst', severity: 'success', summary: 'Success Message', detail:data[0].msg });
        this.router.navigate(['/items/list']);
      });
            }
  }
  Clear(){
    this.mainForm.reset();

  }

  choose(event, callback) {
    callback();
}

onRemoveTemplatingFile(event, file, removeFileCallback, index) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
}

onClearTemplatingUpload(clear) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
}

onTemplatedUpload() {
    this.service.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
}

onSelectedFiles(event) {
    this.files = event.currentFiles;
    this.files.forEach((file) => {
        this.totalSize += parseInt(this.formatSize(file.size));
    });
    this.totalSizePercent = this.totalSize / 10;
}

uploadEvent(callback) {
    callback();
}

formatSize(bytes) {
    const k = 1024;
    const dm = 3;
    const sizes = 20000;
    if (bytes === 0) {
        return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
}

addRow() {
  debugger
  const newId = this.rows.length ? this.rows[this.rows.length - 1].id + 1 : 1;
  this.rows.push({ id: newId,branch_id:'' ,stock:'',stock_value:'' });
 
}

removeRow(id: any) {
  
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

