import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SliderDetailComponent } from './slider-detail/slider-detail.component';
import { SliderListComponent } from './slider-list/slider-list.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: 'detail', component: SliderDetailComponent },
		{ path: 'list', component: SliderListComponent }
	])],
	exports: [RouterModule]
})
export class SliderRoutingModule { }
