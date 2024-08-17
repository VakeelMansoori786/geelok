import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserPermissionComponent } from './user-permission/user-permission.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: 'detail', component: UserDetailComponent },
		{ path: 'list', component: UserListComponent },
		{ path: 'permission', component: UserPermissionComponent }
	])],
	exports: [RouterModule]
})
export class UserRoutingModule { }
