import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '../../services/local-store.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { APIService } from '../../services/api.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-payable',
  templateUrl: './payable.component.html',
  styleUrls: ['./payable.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class PayableComponent  implements OnInit {
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
currencyName: any='';
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
  
      p_purchase_payable_id:['0'],
      p_customer_id:['', Validators.required],
      p_branch_id:['', Validators.required],
      p_payment_date:[''],
      p_cheque_date:[''],
      p_other_ref_no:['', Validators.required],
      p_payment_type_id:['', Validators.required],
      p_currency_id:['', Validators.required],
      p_total_amount:['']
    
    });
  
    if (this.route.snapshot.paramMap.get('id')) {
     this.Id= atob(this.route.snapshot.paramMap.get('id')!);
  
    }
  this.loadDropdowns();
  }
  fetchData(id: string) {
    let req={

      p_purchase_payable_id:id
    }
    this.loading=true;

    this.apiService.GetPayable(req).subscribe((data:any) => {
      if(data.length>0){
      const item = data[0][0];  // Assuming the response structure is correct
      this.currencyName=item.currencyName;
 
      this.mainForm.patchValue({
        p_purchase_payable_id: item.purchase_payable_id,
        p_customer_id: this.customerList.find(x=>x.customer_id==item.customer_id),
        p_branch_id:item.branch_id ,
        p_payment_date:new Date(item.payment_date),
        p_cheque_date:new Date(item.cheque_date),
        p_other_ref_no:item.other_ref_no ,
        p_currency_id:item.currency_id ,
         p_payment_type_id: item.payment_type_id,
        p_total_amount: item.total_amount
       });
       
if(data.length>2){
  const mappedData = data[1].map((item, index) => ({
    id: index,
    due_date: item.due_date,
    bill_no: item.bill_no ,
    po_no: item.po_no ,
    branch: item.company_name ,
    bill_amount: item.bill_amount || '',
    due_amount: item.due_amount || '',
    paid_amount: item.paid_amount || ''
  }));
  
 
  this.rows = mappedData // Assuming p_item_stock is an array of rows
}
    }
   
      
    });
  }


loadDropdowns() {
  forkJoin({
    companies: this.apiService.GetCompany(),
    paymentType: this.apiService.GetPaymentType(),
    customers: this.apiService.GetCustomer({p_customer_id:'0'}),
  }).subscribe(({ companies, customers,paymentType  }) => {
    this.companyList = companies;
    this.customerList = customers;
    this.paymentTypeList =this.groupByType(paymentType);
    

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
  this.rows = this.rows.filter(x => x.paid_amount != 0);

  // Mark loading state
  this.loading = true;

  // Prepare the request object
  const req = {
    p_purchase_payable_id: model.p_purchase_payable_id,
    p_customer_id: model.p_customer_id.p_customer_id,
    p_branch_id: model.p_branch_id,
    p_payment_date: model.p_payment_date,
    p_payment_type_id: model.p_payment_type_id,
    p_currency_id: model.p_currency_id.currency_id,
    p_other_ref_no: model.p_other_ref_no,
    p_total_amount: model.p_total_amount,
    p_purchase_payable_details: JSON.stringify(this.rows.map((item, index) => ({
      id: index,
      due_date: item.due_date,
      bill_no: item.bill_no ,
      po_no: item.po_no ,
      branch: item.company_name ,
      bill_amount: item.bill_amount || '',
      due_amount: item.due_amount || '',
      paid_amount: item.paid_amount || ''
    })))
  };

  // Call the API service to save the bill
  this.apiService.SavePayable(req).subscribe((data:any) => {
        
        this.service.add({ key: 'tst', severity: 'success', summary: 'Success Message', detail:data[0].msg });
        this.router.navigate(['/purchase/payable-list']);
      });
            }
  
  Clear(){
    this.mainForm.reset();

  }




SelectedCustomer(model:any){
  
 this.currencyName= model.currency_name;
  let req={
    p_customer_id:model.customer_id

  }

  this.apiService.GetCustomerPayable(req).subscribe((data:any) => {
    debugger
    this.selectedCustomer=data;
if(data.length>0){
    this.mainForm.patchValue({

      p_currency_id:model.currency_id
    })
  }
  });
 

 
}


}
