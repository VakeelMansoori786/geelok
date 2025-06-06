import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  DeliveryNoteComponent } from './delivery-note/delivery-note.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageModule } from 'primeng/message';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DeliveryNoteListComponent } from './delivery-note-list/delivery-note-list.component';
import { CalendarModule } from 'primeng/calendar';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { InputNumberModule } from 'primeng/inputnumber';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { CreditNoteComponent } from './credit-note/credit-note.component';
import { CreditNoteListComponent } from './credit-note-list/credit-note-list.component';
import { SaleRoutingModule } from './sale-routing.module';
import { PerformaInvoiceListComponent } from './performa-invoice-list/performa-invoice-list.component';
import { ProformaInvoiceComponent } from './proforma-Invoice/proforma-Invoice.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { PaymentReceivedListComponent } from './payment-received-list/payment-received-list.component';
import { PaymentReceivedComponent } from './payment-received/payment-received.component';
import { InvoicePreviewComponent } from './invoice-preview/invoice-preview.component';
import { TabViewModule } from 'primeng/tabview';
import { OrderListModule } from 'primeng/orderlist';
import { ListboxModule } from 'primeng/listbox';
import { PreviewInvoiceComponent } from './preview-invoice/preview-invoice.component';
import { PurchaseModule } from '../purchase/purchase.module';

@NgModule({
  declarations: [
    DeliveryNoteComponent,
    DeliveryNoteListComponent,
    ProformaInvoiceComponent,
    PerformaInvoiceListComponent,
    InvoiceComponent,
    InvoiceListComponent,
    CreditNoteComponent,
    CreditNoteListComponent,
    PaymentReceivedListComponent,
    PaymentReceivedComponent,
    InvoicePreviewComponent,
	PreviewInvoiceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SaleRoutingModule,
		ReactiveFormsModule,
		TableModule,
		RatingModule,
		ButtonModule,
		SliderModule,
		InputTextModule,
		ToggleButtonModule,
		RippleModule,
		MultiSelectModule,
		DropdownModule,
		ProgressBarModule,
		ToastModule,
		CheckboxModule,
		FileUploadModule,
		MessageModule,
		ConfirmDialogModule,
		RadioButtonModule,
		AutoCompleteModule ,AvatarModule,
		CalendarModule ,AvatarGroupModule,InputNumberModule,
				TabViewModule,
				OrderListModule,
				ListboxModule, PurchaseModule     
  ]
})
export class SaleModule { }
