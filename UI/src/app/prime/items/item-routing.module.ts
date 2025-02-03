import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemTransferComponent } from './item-transfer/item-transfer.component';
import { ItemTransferListComponent } from './item-transfer-list/item-transfer-list.component';
import { ItemPreviewComponent } from './item-preview/item-preview.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: 'detail', component: ItemDetailComponent },
		{ path: 'preview', component: ItemPreviewComponent },
		{ path: 'list', component: ItemListComponent },
		{ path: 'transfer', component: ItemTransferComponent },
		{ path: 'transfer-list', component: ItemTransferListComponent },
	])],
	exports: [RouterModule]
})
export class ItemRoutingModule { }
