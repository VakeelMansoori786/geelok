import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { ItemListComponent } from './item-list/item-list.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: 'detail', component: ItemDetailComponent },
		{ path: 'list', component: ItemListComponent }
	])],
	exports: [RouterModule]
})
export class ItemRoutingModule { }
