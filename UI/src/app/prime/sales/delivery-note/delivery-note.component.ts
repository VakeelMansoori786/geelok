import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '../../services/local-store.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { APIService } from '../../services/api.service';
import { forkJoin } from 'rxjs';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

@Component({
  selector: 'app-delivery-note',
  templateUrl: './delivery-note.component.html',
  styleUrls: ['./delivery-note.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class DeliveryNoteComponent implements OnInit {
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
deliveryTypeList: any;
addressList: any;
deliveryType: any[] = [
    
  { name: 'Company', key: 'company' },
  { name: 'Customer', key: 'customer' }
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
  
      p_delivery_note_id: ['0'],
      p_customer_id: ['', Validators.required],
      p_branch_id: ['', Validators.required],
      p_billing_address_id: ['', Validators.required],
      p_shipping_address_id: ['', Validators.required],
      p_payment_term_id: ['', Validators.required],
      p_currency_id: ['', Validators.required],
      p_other_ref_no: [''],
      p_delivery_note_date: [new Date()],
      p_purchase_order_date: [new Date()],
      p_notes: [''],
      p_sub_total: [''],
      p_tax: [''],
      p_discount: [''],
      p_total: ['']
    
    });
  
    if (this.route.snapshot.paramMap.get('id')) {
     this.Id= atob(this.route.snapshot.paramMap.get('id')!);
  
    }
  this.loadDropdowns();
  }
  fetchData(id: string) {
    let req={

      p_delivery_note_id:id
    }
    this.loading=true;

    this.apiService.GetDeliveryNote(req).subscribe((data:any) => {
      debugger
      if(data.length>0){
      const item = data[0][0];  // Assuming the response structure is correct
  
 
      this.mainForm.patchValue({
        p_delivery_note_id: item.p_delivery_note_id,
        p_customer_id: this.customerList.find(x=>x.customer_id==item.customer_id),
        p_branch_id:item.branch_id ,
        p_billing_address_id: item.billing_address_id,
        p_shipping_address_id: item.shipping_address_id,
        p_payment_term_id: item.payment_term_id,
        p_currency_id: item.currency_id,
        p_other_ref_no: item.other_ref_no,
        p_delivery_note_date: new Date(item.delivery_note_date),
        p_purchase_order_date: new Date(item.purchase_order_date),
        p_notes: item.notes,
        p_sub_total: item.sub_total,
        p_tax: item.tax,
        p_discount: item.discount,
        p_total: item.total
       });
       this.SelectedCustomer(this.customerList.find(x=>x.customer_id==item.customer_id));
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
    tax: this.selectedCustomer.tax_treatment_id || '' // stock_value will be set to item.stock_value or default to an empty string
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



Save(model: any) {
  
  // Check if form is valid
  if (!this.mainForm.valid) {
    this.mainForm.markAllAsTouched();
    // Optionally, show a warning message here (e.g., using a toast or alert)
    // this.toastr.warning('Please enter all the fields', 'Warning!');
    return;
  }

  // Filter out rows with item_id '0'
  this.rows = this.rows.filter(x => x.item_id && x.item_id !== '0');
  // Mark loading state
  this.loading = true;

  // Prepare the request object
  const req = {
    p_delivery_note_id: model.p_delivery_note_id,
    p_customer_id: model.p_customer_id.customer_id,
    p_branch_id: model.p_branch_id,
    p_billing_address_id: model.p_billing_address_id,
    p_shipping_address_id: model.p_shipping_address_id,
    p_payment_term_id: model.p_payment_term_id.payment_term_id,
    p_currency_id: model.p_currency_id,
    p_other_ref_no: model.p_other_ref_no,
    p_delivery_note_date: model.p_delivery_note_date,
    p_purchase_order_date:model.p_purchase_order_date,
    p_notes: model.p_notes,
    p_sub_total: model.p_sub_total,
    p_tax: model.p_tax,
    p_discount: model.p_discount,
    p_total: model.p_total,
    p_invoice_details: JSON.stringify(this.rows.map((item, index) => ({
      id: index,
      item_id: item.item_id || null,
      item_name: item.item_name || null,
      qty: item.qty || '',
      rate: item.rate || '',
      discount: item.discount || '',
      tax_amt: item.tax || '',
      description: item.description || '',
      amt: item.amt || '',
      tax: item.tax_amt || ''
    })))
  };

  // Call the API service to save the bill
  this.apiService.SaveDeliveryNote(req).subscribe((data:any) => {
        
        this.service.add({ key: 'tst', severity: 'success', summary: 'Success Message', detail:data[0].msg });
        this.router.navigate(['/sales/delivery_note-list']);
      });
            }
  
  Clear(){
    this.mainForm.reset();

  }
  
 
addRow() {
  
  const newId = this.rows.length ? this.rows[this.rows.length - 1].id + 1 : 0;
  this.rows.push({ id: newId,item_id:0 ,item_name: '',description:'',qty:'1' , rate: '0', discount: '0', tax_amt: '0' , tax: {} , amt: '0' });
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
  
 
  this.GetAddress(model.customer_id);
  this.selectedCustomer=model;

  this.mainForm.patchValue({
    p_payment_term_id:this.paymentTermList.find(x=>x.payment_term_id==this.selectedCustomer.payment_term_id),
    p_currency_id:model.currency_id
  })
}

GetAddress(customer_id:any){
  let req={p_address_type:'customer',p_id:customer_id};
  
  this.apiService.GetAddress(req).subscribe((data:any) => {
    
   this.addressList=data.map(x=>({ code:x.customer_address_id,name:x.address_1+' '+x.address_2+' '+x.city+' '+x.country_state_name+' '+x.country_name   }));
  });
}
calculate(index: any) {
  // Safely parse rate and quantity, defaulting to 0 if invalid
  const rate = parseFloat(this.rows[index].rate) || 0;
  const qty = parseFloat(this.rows[index].qty) || 0;

  // Calculate base amount
  const amt = rate * qty;

  // Ensure discount is properly initialized
  const discount = parseFloat(this.rows[index].discount) || 0;
  this.rows[index].discount = discount;

  // Find tax percent and handle potential null/undefined values
  const taxEntry = this.taxList.find(x => x.tax_treatment_id === this.rows[index].tax);
  const taxPercent = taxEntry?.tax_percent || 0;

  // Calculate amount and tax
  this.rows[index].amt = amt - discount;
  this.rows[index].tax_amt = (taxPercent / 100) * this.rows[index].amt;

  // Calculate subtotals, discounts, taxes, and total amount
  const subTotal = this.rows.reduce((sum, row) => sum + (parseFloat(row.amt) || 0), 0);
  const totalDiscount = this.rows.reduce((sum, row) => sum + (parseFloat(row.discount) || 0), 0);
  const totalTax = this.rows.reduce((sum, row) => sum + (parseFloat(row.tax_amt) || 0), 0);
  const totalAmount = subTotal + totalTax - totalDiscount;

  // Update form controls
  this.mainForm.controls.p_sub_total.setValue(subTotal.toFixed(2));
  this.mainForm.controls.p_tax.setValue(totalTax.toFixed(2));
  this.mainForm.controls.p_discount.setValue(totalDiscount.toFixed(2));
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

