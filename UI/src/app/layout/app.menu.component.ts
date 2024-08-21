import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { LocalStoreService } from '../prime/services/local-store.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService,
        private ls:LocalStoreService) { }

    ngOnInit() {

    let menuData=this.ls.getItem('menu');
debugger
    if(menuData){
        this.model = menuData
        .filter(menu => menu.parent_menu_id === 0) // Filter top-level menus
        .map(parent => {
            return {
                label: parent.page_name,
                items: menuData
                    .filter(menu => menu.parent_menu_id === parent.menu_id) // Find child menus
                    .map(child => {
                        return {
                            label: child.page_name,
                            icon: 'pi pi-fw pi-id-card', // Example icon, adjust as needed
                            routerLink: [child.url]
                        };
                    })
            };
        });  
    }
        // this.model = [
        //     // {
        //     //     label: 'User',
        //     //     items: [
        //     //         { label: 'Add', icon: 'pi pi-fw pi-id-card', routerLink: ['/user/detail'] },
        //     //         { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/user/list'] },
        //     //         { label: 'Permission', icon: 'pi pi-fw pi-list', routerLink: ['/user/permission'] },
        //     //     ]
        //     // },
        //     {
        //         label: 'Slider',
        //         items: [
        //             { label: 'Add', icon: 'pi pi-fw pi-id-card', routerLink: ['/slider/detail'] },
        //             { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/slider/list'] },
        //         ]
        //     },
        //     {
        //         label: 'Video',
        //         items: [
        //             { label: 'Add', icon: 'pi pi-fw pi-id-card', routerLink: ['/video/detail'] },
        //             { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/video/list'] },
        //         ]
        //     },
        //     {
        //         label: 'News & Blog',
        //         items: [
        //             { label: 'Add', icon: 'pi pi-fw pi-id-card', routerLink: ['/news/detail'] },
        //             { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/news/list'] },
        //         ]
        //     }
        // ];
    }
}
