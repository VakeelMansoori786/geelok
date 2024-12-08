import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '../../services/local-store.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { APIService } from '../../services/api.service';
import { forkJoin } from 'rxjs';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class ExpenseComponent   implements OnInit {
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
paymentTypeList: any;
currencyList: any;
accountList:any={};
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
  
      p_expense_id:['0'],
      p_customer_id:['', Validators.required],
      p_branch_id:['', Validators.required],
      p_expense_date:[new Date(), Validators.required],
      p_payment_type_id:['', Validators.required],
      p_payment_term_id:['', Validators.required],
      p_currency_id:['', Validators.required],
      p_ref_no:[''],
      p_is_billable:[false],
      p_sub_total:[''],
      p_tax:[''],
      p_total:['']
    
    });
  
    if (this.route.snapshot.paramMap.get('id')) {
     this.Id= atob(this.route.snapshot.paramMap.get('id')!);
  
    }
  this.loadDropdowns();
  }
  fetchData(id: string) {
    let req={

      p_expense_id:id
    }
    this.loading=true;

    this.apiService.GetExpense(req).subscribe((data:any) => {
      if(data.length>0){
      const item = data[0][0];  // Assuming the response structure is correct
     
 
      this.mainForm.patchValue({
        p_expense_id: item.expense_id,
        p_customer_id: this.customerList.find(x=>x.customer_id==item.customer_id),
        p_branch_id:item.branch_id ,
        p_expense_date:new Date(item.expense_date),
        p_currency_id:this.currencyList.find(x=>x.currency_id==item.currency_id) ,
        p_payment_term_id:this.paymentTermList.find(x=>x.payment_term_id==item.payment_term_id) ,
        p_payment_type_id: item.payment_type_id,
        p_is_billable: item.is_billable==1?true:false,
        p_ref_no: item.ref_no,
        p_sub_total: item.sub_total,
        p_tax: item.tax,
        p_total: item.total
       });
       debugger
if(data.length>2){
  const mappedData = data[1].map((item, index) => ({
    id: index,
    account_id: item.account_id || null,
    tax: item.tax_id ,
    description: item.description || '',
    amount: item.amount || ''
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
    paymentType: this.apiService.GetPaymentType(),
    currencies: this.apiService.GetCurrency(),
    accounts: this.apiService.GetAccount(),
    customers: this.apiService.GetCustomer({p_customer_id:'0'}),
  }).subscribe(({ companies, customers,paymentTerms,taxes,paymentType,currencies,accounts  }) => {
    this.companyList = companies;
    this.customerList = customers;
    this.paymentTermList = paymentTerms;
    this.taxList = taxes;
    this.currencyList = currencies;
    this.paymentTypeList =this.groupByType(paymentType);
    
this.accountList=accounts;
this.accountList=this.accountList.filter(x=>x.account_type_id==1);

    if (this.Id!=0) {
      this.fetchData(this.Id);
    }
  });
}

groupByType(paymentMethods:any) {
  return paymentMethods.reduce((result, currentValue) => {
    const group = result.find(group => group.value === currentValue.type);
    if (group) {
      group.items.push({ label: currentValue.name, value: currentValue.payment_type_id });
    } else {
      result.push({
        label: currentValue.type.charAt(0).toUpperCase() + currentValue.type.slice(1),
        value: currentValue.type,
        items: [{ label: currentValue.name, value: currentValue.payment_type_id }]
      });
    }
    return result;
  }, []);
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
  this.rows = this.rows.filter(x => x.account_id != 0);

  // Mark loading state
  this.loading = true;

  // Prepare the request object
  const req = {
    p_expense_id: model.p_expense_id,
    p_customer_id: model.p_customer_id.customer_id,
    p_branch_id: model.p_branch_id,
    p_expense_date: model.p_expense_date,
    p_payment_term_id: model.p_payment_term_id.payment_term_id,
    p_payment_type_id: model.p_payment_type_id,
    p_currency_id: model.p_currency_id.currency_id,
    p_is_billable: model.p_is_billable,
    p_ref_no: model.p_ref_no,
    p_sub_total: model.p_sub_total,
    p_tax: model.p_tax,
    p_total: model.p_total,
    p_expense_details: JSON.stringify(this.rows.map((item, index) => ({
      id: index,
      account_id: item.account_id || null,
      tax_id: item.tax || '',
      description: item.description || '',
      amount: item.amount || ''
    })))
  };

  // Call the API service to save the bill
  this.apiService.SaveExpense(req).subscribe((data:any) => {
        
        this.service.add({ key: 'tst', severity: 'success', summary: 'Success Message', detail:data[0].msg });
        this.router.navigate(['/purchase/expense-list']);
      });
            }
  
  Clear(){
    this.mainForm.reset();

  }


addRow() {
  
  const newId = this.rows.length ? this.rows[this.rows.length - 1].id + 1 : 0;
  this.rows.push({ id: newId,account_id:0 ,description:'', tax_amt: '0' , tax: null , amount: '0' });
 if(this.selectedCustomer && this.selectedCustomer.tax_treatment_id){
  this.rows[newId].tax=this.selectedCustomer.tax_treatment_id;//this.taxList.find(x=>x.tax_treatment_id==this.selectedCustomer.tax_treatment_id);
 }
}

removeRow(id: any,index:any) {
  
  this.rows = this.rows.filter(row => row.id !== id);
  this.calculate(index);
}


onSelect(event: any, index: number) {

this.calculate(index);
if (!this.rows.length || this.rows[this.rows.length - 1].account_id) {
this.addRow();
}
}
SelectedCustomer(model:any){
  
  this.selectedCustomer=model;

  this.mainForm.patchValue({
    p_payment_term_id:this.paymentTermList.find(x=>x.payment_term_id==this.selectedCustomer.payment_term_id),
    p_currency_id:this.currencyList.find(x=>x.currency_id==model.currency_id)
  })
}
calculate(index:any){
  
if(this.rows[index].tax!=null){
const taxPercent =this.taxList.find(x=>x.tax_treatment_id==this.rows[index].tax).tax_percent 
 this.rows[index].tax_amt=(parseFloat(taxPercent)/100)*this.rows[index].amount;
}
    const subTotal = this.rows.reduce((sum, row) => sum + parseFloat(row.amount), 0);
     const tax=this.rows.reduce((sum, row) => sum + parseFloat(row.tax_amt), 0);
    const totalAmount = subTotal +tax;

    this.mainForm.controls.p_sub_total.setValue(subTotal.toFixed(2));
    this.mainForm.controls.p_tax.setValue(tax.toFixed(2));
    this.mainForm.controls.p_total.setValue(totalAmount.toFixed(2));
}


ChangeCurrency(event:any){
  
  let curr=this.mainForm.value.p_currency_id;
  this.selectedCustomer.currency_name=curr.name;
  this.selectedCustomer.currency_id=curr.currency_id;
}

getTotalDiscount(){
  debugger
  const totalDiscountValue = parseFloat(this.totalDiscount) || 0;
  let subTotal = this.rows.reduce((sum, row) => sum + (parseFloat(row.rate)*parseFloat(row.qty)), 0);

  if (subTotal > 0) {
   
    if (this.discountType === 'percentage') {
      this.rows.forEach(row => {
        const rowAmount =parseFloat(row.rate)*parseFloat(row.qty);
        const rowDiscount = (rowAmount * totalDiscountValue) / 100; // Percentage discount
        row.discount = rowDiscount.toFixed(2);
        row.amt = rowAmount-rowDiscount;
row.amt =row.amt.toFixed(2); 

const taxEntry = this.taxList.find(x => x.tax_treatment_id === row.tax);
  const taxPercent = taxEntry?.tax_percent || 0;

  row.tax_amt = (taxPercent / 100) * row.amt;

      });
    } else {
      const discountRatio = totalDiscountValue / subTotal;
    // Apply proportional discount to each row
    this.rows.forEach(row => {
      const rowAmount = parseFloat(row.rate)*parseFloat(row.qty);
      const rowDiscount = rowAmount * discountRatio;
      row.discount = rowDiscount.toFixed(2);
      row.amt = rowAmount-rowDiscount;
row.amt =row.amt.toFixed(2); 
const taxEntry = this.taxList.find(x => x.tax_treatment_id === row.tax);
  const taxPercent = taxEntry?.tax_percent || 0;

  row.tax_amt = (taxPercent / 100) * row.amt;

    });
  }
    // Recalculate the totals
    const total = this.rows.reduce((sum, row) => sum + (parseFloat(row.rate)*parseFloat(row.qty)), 0);
    const discount = this.rows.reduce((sum, row) => sum + parseFloat(row.discount), 0);
    const tax = this.rows.reduce((sum, row) => sum + parseFloat(row.tax_amt), 0);
     subTotal= total - discount ;
     const totalAmount= subTotal+ tax;
    this.mainForm.controls.p_sub_total.setValue(subTotal.toFixed(2));
    this.mainForm.controls.p_discount.setValue(discount.toFixed(2));
    this.mainForm.controls.p_tax.setValue(tax.toFixed(2));
    this.mainForm.controls.p_total.setValue(totalAmount.toFixed(2));
  }
}


}

