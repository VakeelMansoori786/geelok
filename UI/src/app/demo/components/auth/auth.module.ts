import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';

@NgModule({
    imports: [
        CommonModule,
        AuthRoutingModule,
        MessageModule,
        ToastModule 
    ]
})
export class AuthModule { }
