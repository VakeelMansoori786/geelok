import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BillComponent } from './bill/bill.component';
import { BillListComponent } from './bill-list/bill-list.component';
import { SaleOrderComponent } from './sale-order/sale-order.component';
import { SaleOrderListComponent } from './sale-order-list/sale-order-list.component';
import { ExpenseComponent } from './expense/expense.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { PayableListComponent } from './payable-list/payable-list.component';
import { PayableComponent } from './payable/payable.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: 'bill', component: BillComponent },
		{ path: 'bill-list', component: BillListComponent },
		{ path: 'order', component: SaleOrderComponent },
		{ path: 'order-list', component: SaleOrderListComponent },
		{ path: 'expense', component: ExpenseComponent },
		{ path: 'expense-list', component: ExpenseListComponent },
		{ path: 'payable-list', component: PayableListComponent },
		{ path: 'payable', component: PayableComponent },
	])],
	exports: [RouterModule]
})
export class SaleRoutingModule { }
