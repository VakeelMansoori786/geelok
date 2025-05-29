import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AuthGuard } from './prime/shared/guard/auth.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './prime/shared/interceptor/auth.interceptor';
import { PreviewInvoiceComponent } from './prime/sales/preview-invoice/preview-invoice.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '',
                component: AppLayoutComponent,
                canActivate: [AuthGuard], // Applying AuthGuard to the main layout component
                children: [
                  { path: '', loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                  { path: 'user', loadChildren: () => import('./prime/user/user.module').then(m => m.UserModule) },
                  { path: 'items', loadChildren: () => import('./prime/items/item.module').then(m => m.ItemModule) },
                  { path: 'purchase', loadChildren: () => import('./prime/purchase/purchase.module').then(m => m.PurchaseModule) },
                  { path: 'sales', loadChildren: () => import('./prime/sales/sale.module').then(m => m.SaleModule) },
                  { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                  { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                  { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                  { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) }
                ]
              },
            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: 'invoice', component: PreviewInvoiceComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule],
    providers: [
        AuthGuard, // Provide AuthGuard
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
})
export class AppRoutingModule {
}
