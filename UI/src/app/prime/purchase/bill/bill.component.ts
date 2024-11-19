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
companyList: any;
discountType='percentage'
customerList: any;
paymentTermList: any;
selectedItem: any={};
suggestions: any=[] ;
files = [];
Id:any='0'
totalSize : number = 0;
selectedCustomer:any= {};
totalSizePercent : number = 0;
totalDiscount:any;
rows:any[] = []; 
taxList: any;
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
      p_customer_id:['', Validators.required],
      p_branch_id:['', Validators.required],
      p_currency_id:[''],
      p_bill_no:['', Validators.required],
      p_order_no:[''],
      p_permit_no:[''],
      p_bill_date:['', Validators.required],
      p_due_date:['', Validators.required],
      p_payment_term_id:['', Validators.required],
      p_notes:[''],
      p_sub_total:[''],
      p_tax:[''],
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

      p_purchase_bill_id:id
    }
    this.loading=true;

    this.apiService.GetBill(req).subscribe((data:any) => {
      if(data.length>0){
      const item = data[0][0];  // Assuming the response structure is correct
      
      // Populate the form with the fetched data
      this.mainForm.patchValue({
        p_purchase_bill_id: item.p_purchase_bill_id,
        p_customer_id: this.customerList.find(x=>x.customer_id==item.customer_id),
        p_branch_id:this.companyList.find(x=>x.branch_id==item.branch_id) ,
        p_bill_no: item.bill_no,
        p_currency_id: item.currency_id,
        p_order_no: item.order_no,
        p_permit_no: item.permit_no,
        p_bill_date: item.bill_date,
        p_due_date: item.due_date,
        p_payment_term_id:this.paymentTermList.find(x=>x.payment_term_id==item.payment_term_id) ,
        p_notes: item.notes,
        p_sub_total: item.sub_total,
        p_tax: item.tax,
        p_discount: item.discount,
        p_total: item.total
       });
if(data.length>2){
  const mappedData = data[1].map((item, index) => ({
    id: index,                         // Use the index as the id (starting from 0)
    item_id: item.item_id || null,    // branch_id will be set to item.branch_id or default to an empty string
    item_name: item.item_name || null,    // branch_id will be set to item.branch_id or default to an empty string
    qty: item.qty || '',            // stock will be set to item.stock or default to an empty string
    rate: item.rate || '' ,// stock_value will be set to item.stock_value or default to an empty string
    discount: item.discount || '' ,
    tax_amt: item.tax || '' ,
    description: item.description || '' ,
    amt: item.amt || '' ,// stock_value will be set to item.stock_value or default to an empty string
    tax: item.tax || '' // stock_value will be set to item.stock_value or default to an empty string
}));
  
 
  this.rows = mappedData // Assuming p_item_stock is an array of rows
}
    }
   
      
    });
  }


loadDropdowns() {
  forkJoin({
    companies: this.apiService.GetCompany(),
    paymentTerms: this.apiService.GetPaymentTerm(),
    taxes: this.apiService.GetTax(),
    customers: this.apiService.GetCustomer({p_customer_id:'0'}),
  }).subscribe(({ companies, customers,paymentTerms,taxes }) => {
    this.companyList = companies;
    this.customerList = customers;
    this.paymentTermList = paymentTerms;
    this.taxList = taxes;
    if (this.Id!=0) {
      this.fetchData(this.Id);
    }
  });
}



  Save(model:any) {
    debugger
    if(!this.mainForm.valid)
    {
      this.mainForm.markAllAsTouched();

      //  this.toastr.warning('Please enter all the Field', 'Warning!');
   
      
    }
    else{
      this.rows=this.rows.filter(x=>x.item_id!='0');
      this.loading = true;
      let req={
        p_purchase_bill_id:model.p_purchase_bill_id,
        p_customer_id:model.p_customer_id.customer_id,
        p_branch_id:model.p_branch_id,
        p_currency_id:model.p_currency_id,
        p_bill_no: model.p_bill_no,
        p_order_no: model.p_order_no,
        p_permit_no: model.p_permit_no,
        p_bill_date: model.p_bill_date,
        p_due_date: model.p_due_date,
        p_payment_term_id:model.p_payment_term_id.payment_term_id ,
        p_notes: model.p_notes,
        p_sub_total: model.p_sub_total,
        p_tax: model.p_tax,
        p_discount: model.p_discount,
        p_total: model.p_total,
        p_order_details:JSON.stringify(this.rows.map((item, index) => ({
          id: index,                         
          item_id: item.item_id || null,    
          item_name: item.item_name || null,  
          qty: item.qty || '',          
          rate: item.rate || '' ,
          discount: item.discount || '' ,
          tax_amt: item.tax || '' ,
          description: item.description || '' ,
          amt: item.amt || '' ,
          tax: item.tax_amt || ''
      })))
      
      };
      
      

      this.apiService.SaveBill(req).subscribe((data:any) => {
        
        this.service.add({ key: 'tst', severity: 'success', summary: 'Success Message', detail:data[0].msg });
        this.router.navigate(['/purchase/bill-list']);
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
  
  const newId = this.rows.length ? this.rows[this.rows.length - 1].id + 1 : 0;
  this.rows.push({ id: newId,item_id:0 ,item_name: '',qty:'1' , rate: '0', discount: '0', tax_amt: '0' , tax: {} , amt: '0' });
 if(this.selectedCustomer && this.selectedCustomer.tax_treatment_id){
  this.rows[newId].tax=this.selectedCustomer.tax_treatment_id;//this.taxList.find(x=>x.tax_treatment_id==this.selectedCustomer.tax_treatment_id);
 }
}

removeRow(id: any,index:any) {
  
  this.rows = this.rows.filter(row => row.id !== id);
  this.calculate(index);
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
this.rows[index].rate=ab.cost_price
this.calculate(index);
if (!this.rows.length || this.rows[this.rows.length - 1].item_name) {
this.addRow();
}
}
SelectedCustomer(model:any){
  
  this.selectedCustomer=model;

  this.mainForm.patchValue({
    p_payment_term_id:this.paymentTermList.find(x=>x.payment_term_id==this.selectedCustomer.payment_term_id),
    p_due_date:new Date(),
    p_currency_id:model.currency_id
  })
}
calculate(index:any){
  debugger
const amt =parseFloat(this.rows[index].rate)*parseFloat(this.rows[index].qty);

const taxPercent =this.taxList.find(x=>x.tax_treatment_id==this.rows[index].tax).tax_percent 
 this.rows[index].amt=amt-parseFloat(this.rows[index].discount);
 this.rows[index].tax_amt=(parseFloat(taxPercent)/100)*this.rows[index].amt;
    const subTotal = this.rows.reduce((sum, row) => sum + parseFloat(row.amt), 0);
    const discount=this.rows.reduce((sum, row) => sum + parseFloat(row.discount), 0);
    const tax=this.rows.reduce((sum, row) => sum + parseFloat(row.tax_amt), 0);
    const totalAmount = subTotal - discount+tax;

    this.mainForm.controls.p_sub_total.setValue(subTotal.toFixed(2));
    this.mainForm.controls.p_tax.setValue(tax.toFixed(2));
    this.mainForm.controls.p_discount.setValue(discount.toFixed(2));
    this.mainForm.controls.p_total.setValue(totalAmount.toFixed(2));
}
onBillDate(event: any) {
  this.updateDueDate();
}

onDueDate(event: any) {
  this.updateDueDate();
}

ChangePaymentDate(event: any) {
  this.updateDueDate();
}

updateDueDate() {
  const billDate = this.mainForm.value.p_bill_date;
  const paymentTerm = this.mainForm.value.p_payment_term_id;

  // Check if both bill date and payment term are available
  if (billDate && paymentTerm && paymentTerm.days != null) {
    const modifiedDate = new Date(billDate);
    modifiedDate.setDate(modifiedDate.getDate() + paymentTerm.days);
    this.mainForm.controls.p_due_date.setValue(modifiedDate);
  }
}


setDiscountType(type:any){
  this.discountType=type;
}
getTotalDiscount(){
  const totalDiscountValue = parseFloat(this.totalDiscount) || 0;
  let subTotal = this.rows.reduce((sum, row) => sum + (parseFloat(row.rate)*parseFloat(row.qty)), 0);

  if (subTotal > 0) {
   
    if (this.discountType === 'percentage') {
      this.rows.forEach(row => {
        const rowAmount =parseFloat(row.rate)*parseFloat(row.qty);
        const rowDiscount = (rowAmount * totalDiscountValue) / 100; // Percentage discount
        row.discount = rowDiscount.toFixed(2);
      });
    } else {
      const discountRatio = totalDiscountValue / subTotal;
    // Apply proportional discount to each row
    this.rows.forEach(row => {
      const rowAmount = parseFloat(row.rate)*parseFloat(row.qty);
      const rowDiscount = rowAmount * discountRatio;
      row.discount = rowDiscount.toFixed(2);
    });
  }
    // Recalculate the totals
    subTotal = this.rows.reduce((sum, row) => sum + (parseFloat(row.rate)*parseFloat(row.qty)), 0);
    const discount = this.rows.reduce((sum, row) => sum + parseFloat(row.discount), 0);
    const tax = this.rows.reduce((sum, row) => sum + parseFloat(row.tax_amt), 0);
    const totalAmount = subTotal - discount + tax;
  
    this.mainForm.controls.p_sub_total.setValue(subTotal.toFixed(2));
    this.mainForm.controls.p_discount.setValue(discount.toFixed(2));
    this.mainForm.controls.p_tax.setValue(tax.toFixed(2));
    this.mainForm.controls.p_total.setValue(totalAmount.toFixed(2));
  }
}
}

