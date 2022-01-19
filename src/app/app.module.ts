import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme/theme.component';
import { LayoutModule } from './theme/layouts/layout.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScriptLoaderService } from "./_services/script-loader.service";
import { ThemeRoutingModule } from "./theme/theme-routing.module";
import { AuthModule } from "./auth/auth.module";

import { GET_Service } from "./theme/api/get.service";
import { POST_Service } from "./theme/api/post.service";
import { AlertService } from "./auth/_services/alert.service";
import { SuiModule } from 'ng2-semantic-ui';

import { DeviceDetectorModule } from 'ngx-device-detector';
import { HttpClientModule } from '@angular/common/http';

import { MatButtonModule } from '@angular/material';

import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; 
import { MomentModule } from 'angular2-moment';
import { DowntimeComponent } from './downtime/downtime.component';

@NgModule({
    declarations: [
        ThemeComponent,
        AppComponent,
        DowntimeComponent,
    ],
    imports: [
        LayoutModule, MatButtonModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ThemeRoutingModule,
        AuthModule,
        SuiModule,
        HttpClientModule,
        DeviceDetectorModule.forRoot(),

        NgIdleKeepaliveModule.forRoot(),
        MomentModule,
    ],
    providers: [ScriptLoaderService, GET_Service, POST_Service, AlertService],
    bootstrap: [AppComponent]
})
export class AppModule { }