import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DeliveryNoteComponent } from './delivery-note/delivery-note.component';
import { DeliveryNoteListComponent } from './delivery-note-list/delivery-note-list.component';
import { PerformaInvoiceListComponent } from './performa-invoice-list/performa-invoice-list.component';
import {  ProformaInvoiceComponent } from './proforma-Invoice/proforma-Invoice.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { CreditNoteListComponent } from './credit-note-list/credit-note-list.component';
import { CreditNoteComponent } from './credit-note/credit-note.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: 'delivery-note', component: DeliveryNoteComponent },
		{ path: 'delivery-note-list', component: DeliveryNoteListComponent },
		{ path: 'performa-invoice', component: ProformaInvoiceComponent },
		{ path: 'performa-invoice-list', component: PerformaInvoiceListComponent },
		{ path: 'invoice', component: InvoiceComponent },
		{ path: 'invoice-list', component: InvoiceListComponent },
		{ path: 'credit-note-list', component: CreditNoteListComponent },
		{ path: 'credit-note', component: CreditNoteComponent },
	])],
	exports: [RouterModule]
})
export class SaleRoutingModule { }
