import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemRoutingModule } from './item-routing.module';
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
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { ItemListComponent } from './item-list/item-list.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ItemTransferComponent } from './item-transfer/item-transfer.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ItemTransferListComponent } from './item-transfer-list/item-transfer-list.component';

@NgModule({
	imports: [
		CommonModule,
		ItemRoutingModule,
		FormsModule,
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
		AutoCompleteModule 
	],
	declarations: [ItemDetailComponent,ItemListComponent,ItemTransferComponent, ItemTransferListComponent]
})
export class ItemModule { }
