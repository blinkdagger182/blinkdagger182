import { NgModule } from '@angular/core';
import { LayoutComponent } from './layout/layout.component';

import { HeaderNavComponent } from './header-nav/header-nav.component';
import { DefaultComponent } from '../pages/admin/default/default.component';
import { UserDefaultComponent } from '../pages/user/default/default.component';
import { EngageDefaultComponent } from '../pages/engage/default/default.component';
import { AsideNavComponent } from './aside-nav/aside-nav.component';
import { FooterComponent } from './footer/footer.component';
import { QuickSidebarComponent } from './quick-sidebar/quick-sidebar.component';
import { ScrollTopComponent } from './scroll-top/scroll-top.component';
import { TooltipsComponent } from './tooltips/tooltips.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { TimeAgoPipe } from 'time-ago-pipe';
import { SharedModule } from '../../shared/shared.module'
import { DatePipe } from '@angular/common';
import { mapsDefaultComponent } from '../pages/admin/maps/default/default.component';
// import { HrefPreventDefaultDirective } from '../../_directives/href-prevent-default.directive';
// import { UnwrapTagDirective } from '../../_directives/unwrap-tag.directive';

@NgModule({
    declarations: [
        LayoutComponent,
        HeaderNavComponent,
        DefaultComponent, UserDefaultComponent, EngageDefaultComponent, mapsDefaultComponent,
        AsideNavComponent,
        FooterComponent,
        QuickSidebarComponent,
        ScrollTopComponent,
        TooltipsComponent,
        // HrefPreventDefaultDirective,
        // UnwrapTagDirective,
    ],
    exports: [
        LayoutComponent,

        HeaderNavComponent,
        DefaultComponent,
        AsideNavComponent,
        FooterComponent,
        QuickSidebarComponent,
        ScrollTopComponent,
        TooltipsComponent,
        // HrefPreventDefaultDirective,
    ],
    imports: [
        CommonModule,
        RouterModule,
        SharedModule
    ],
    providers: [DatePipe]
})
export class LayoutModule {
}