import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BillComponent } from './bill/bill.component';
import { BillListComponent } from './bill-list/bill-list.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: 'bill', component: BillComponent },
		{ path: 'bill-list', component: BillListComponent },
	])],
	exports: [RouterModule]
})
export class PurchaseRoutingModule { }
