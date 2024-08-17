import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            // {
            //     label: 'User',
            //     items: [
            //         { label: 'Add', icon: 'pi pi-fw pi-id-card', routerLink: ['/user/detail'] },
            //         { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/user/list'] },
            //         { label: 'Permission', icon: 'pi pi-fw pi-list', routerLink: ['/user/permission'] },
            //     ]
            // },
            {
                label: 'Slider',
                items: [
                    { label: 'Add', icon: 'pi pi-fw pi-id-card', routerLink: ['/slider/detail'] },
                    { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/slider/list'] },
                ]
            },
            {
                label: 'Video',
                items: [
                    { label: 'Add', icon: 'pi pi-fw pi-id-card', routerLink: ['/video/detail'] },
                    { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/video/list'] },
                ]
            },
            {
                label: 'News & Blog',
                items: [
                    { label: 'Add', icon: 'pi pi-fw pi-id-card', routerLink: ['/news/detail'] },
                    { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/news/list'] },
                ]
            }
        ];
    }
}
