import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BillComponent } from './bill/bill.component';
import { BillListComponent } from './bill-list/bill-list.component';
import { PerformaInvoiceListComponent } from './performa-invoice-list/performa-invoice-list.component';
import { ExpenseComponent } from './expense/expense.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { PayableListComponent } from './payable-list/payable-list.component';
import { PayableComponent } from './payable/payable.component';
import {  ProformaInvoiceComponent } from './proforma-Invoice/proforma-Invoice.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: 'bill', component: BillComponent },
		{ path: 'bill-list', component: BillListComponent },
		{ path: 'performa-invoice', component: ProformaInvoiceComponent },
		{ path: 'performa-invoice-list', component: PerformaInvoiceListComponent },
		{ path: 'expense', component: ExpenseComponent },
		{ path: 'expense-list', component: ExpenseListComponent },
		{ path: 'payable-list', component: PayableListComponent },
		{ path: 'payable', component: PayableComponent },
	])],
	exports: [RouterModule]
})
export class SaleRoutingModule { }
