import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VideoDetailComponent } from './video-detail/video-detail.componentcomponent';
import { VideoListComponent } from './video-list/video-list.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: 'detail', component: VideoDetailComponent },
		{ path: 'list', component: VideoListComponent }
	])],
	exports: [RouterModule]
})
export class VideoRoutingModule { }
