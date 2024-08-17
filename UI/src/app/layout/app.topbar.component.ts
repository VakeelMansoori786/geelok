import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { LocalStoreService } from '../prime/services/local-store.service';
import { AuthService } from '../prime/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(private router: Router,private ls:LocalStoreService,public authService: AuthService,public layoutService: LayoutService) { }

    logout(){
    this.authService.signOut();
    this.router.navigate(['/auth/login']);
    
    }
}
