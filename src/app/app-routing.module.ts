import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogoutComponent } from "./auth/logout/logout.component";
import { DeviceDetectorModule } from 'ngx-device-detector';
import { DowntimeComponent } from './downtime/downtime.component';



const routes: Routes = [
    
    { path: 'login', loadChildren: './auth/auth.module#AuthModule' },
    { path: 'logout', component: LogoutComponent },
    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    { path: 'welcome', loadChildren: './welcome-main/welcome.module#WelcomeModule' },
    { path: 'admin', loadChildren: './welcome-main/welcome.module#WelcomeModule' },
    { path: 'engagement', loadChildren: './welcome-main/welcome.module#WelcomeModule' },
    { path: 'downtime', component: DowntimeComponent},
    
    //old path
    // { path: 'welcome2', loadChildren: './welcome2/welcome2.module#Welcome2Module' },
    //{ path: 'welcome', loadChildren: './welcome/welcome.module#WelcomeModule' },
    //{ path: 'admin', loadChildren: './welcome-admin/welcome.module#WelcomeModule' },
    //{ path: 'engagement', loadChildren: './welcome-engagement/welcome.module#WelcomeModule' },
    //{ path: 'rpm', loadChildren: './welcome-rpm/welcome.module#WelcomeModule' },
    // { path: 'idp', loadChildren: './welcome-idp/welcome.module#WelcomeModule' },
    // { path: 'engagement', loadChildren: './engagement/engage.module#EngageModule' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
        DeviceDetectorModule.forRoot(),
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }