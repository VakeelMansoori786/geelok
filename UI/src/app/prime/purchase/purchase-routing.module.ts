import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BillComponent } from './bill/bill.component';
import { BillListComponent } from './bill-list/bill-list.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: 'bill', component: BillComponent },
		{ path: 'bill-list', component: BillListComponent },
		{ path: 'order', component: PurchaseOrderComponent },
		{ path: 'order-list', component: PurchaseOrderListComponent },
	])],
	exports: [RouterModule]
})
export class PurchaseRoutingModule { }
