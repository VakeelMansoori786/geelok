import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DeliveryNoteComponent } from './delivery-note/delivery-note.component';
import { DeliveryNoteListComponent } from './delivery-note-list/delivery-note-list.component';
import { PerformaInvoiceListComponent } from './performa-invoice-list/performa-invoice-list.component';
import { PayableListComponent } from './payable-list/payable-list.component';
import { PayableComponent } from './payable/payable.component';
import {  ProformaInvoiceComponent } from './proforma-Invoice/proforma-Invoice.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceComponent } from './invoice/invoice.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: 'delivery-note', component: DeliveryNoteComponent },
		{ path: 'delivery-note-list', component: DeliveryNoteListComponent },
		{ path: 'performa-invoice', component: ProformaInvoiceComponent },
		{ path: 'performa-invoice-list', component: PerformaInvoiceListComponent },
		{ path: 'invoice', component: InvoiceComponent },
		{ path: 'invoice-list', component: InvoiceListComponent },
		{ path: 'payable-list', component: PayableListComponent },
		{ path: 'payable', component: PayableComponent },
	])],
	exports: [RouterModule]
})
export class SaleRoutingModule { }
