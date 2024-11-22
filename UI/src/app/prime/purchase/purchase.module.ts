import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillComponent } from './bill/bill.component';
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
import { BillListComponent } from './bill-list/bill-list.component';
import { PurchaseRoutingModule } from './purchase-routing.module';
import { CalendarModule } from 'primeng/calendar';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { InputNumberModule } from 'primeng/inputnumber';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchaseOrderListComponent } from './purchase-order-list/purchase-order-list.component';
import { ExpenseComponent } from './expense/expense.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { PayableComponent } from './payable/payable.component';
import { PayableListComponent } from './payable-list/payable-list.component';
@NgModule({
  declarations: [
    BillComponent,
    BillListComponent,
    PurchaseOrderComponent,
    PurchaseOrderListComponent,
    ExpenseComponent,
    ExpenseListComponent,
    PayableComponent,
    PayableListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PurchaseRoutingModule,
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
		CalendarModule ,AvatarGroupModule,InputNumberModule 
  ]
})
export class PurchaseModule { }
