import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemTransferComponent } from './item-transfer/item-transfer.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: 'detail', component: ItemDetailComponent },
		{ path: 'list', component: ItemListComponent },
		{ path: 'transfer', component: ItemTransferComponent },
	])],
	exports: [RouterModule]
})
export class ItemRoutingModule { }
