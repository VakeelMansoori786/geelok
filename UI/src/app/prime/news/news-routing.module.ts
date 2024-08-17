import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewsDetailComponent } from './news-detail/news-detail.component';
import { NewsListComponent } from './news-list/news-list.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: 'detail', component: NewsDetailComponent },
		{ path: 'list', component: NewsListComponent }
	])],
	exports: [RouterModule]
})
export class NewsRoutingModule { }
