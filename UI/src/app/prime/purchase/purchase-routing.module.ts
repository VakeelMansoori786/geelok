import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BillComponent } from './bill/bill.component';
import { BillListComponent } from './bill-list/bill-list.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';
import { ExpenseComponent } from './expense/expense.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: 'bill', component: BillComponent },
		{ path: 'bill-list', component: BillListComponent },
		{ path: 'order', component: PurchaseOrderComponent },
		{ path: 'order-list', component: PurchaseOrderListComponent },
		{ path: 'expense', component: ExpenseComponent },
		{ path: 'expense-list', component: ExpenseListComponent },
	])],
	exports: [RouterModule]
})
export class PurchaseRoutingModule { }
