import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { UserDefaultComponent } from '../default/default.component';
import { VspComponent } from './vsp.component';
import { ResultComponent } from './result/result.component';
import { TrackingComponent } from './tracking/tracking.component';
import { GET_Service } from '../../../api/get.service';
import { POST_Service } from '../../../api/post.service';
import { AlertService } from '../../../../auth/_services/alert.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserLoadingModule } from '../loading/loading.module';
import { SuiModule } from 'ng2-semantic-ui';
import { NotifierModule } from 'angular-notifier';
import { SuiSelectModule } from 'ng2-semantic-ui';
// Material
import {  MatInputModule, MatDatepickerModule, MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { IDPLoadingModule } from '../idp/idp-loading/idp-loading-module';
const routes: Routes = [
    {
        'path': '',
        'component': UserDefaultComponent,
        'children': [
            {
                'path': '',
                'component': VspComponent,
            },
            {
                'path': 'result',
                'component': ResultComponent,
            },
            {
                'path': 'tracking',
                'component': TrackingComponent,
            },
            
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule, ReactiveFormsModule, SuiModule, 
        UserLoadingModule, IDPLoadingModule,
        SuiSelectModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,
        NgxChartsModule,
        NotifierModule.withConfig({
            position: {
                horizontal: {
                    /**
                     * Defines the horizontal position on the screen
                     * @type {'left' | 'middle' | 'right'}
                     */
                    position: 'right',
                    /**
                     * Defines the horizontal distance to the screen edge (in px)
                     * @type {number} 
                     */
                    distance: 12
                },
            }
        })
    ], exports: [
        RouterModule,
    ], declarations: [
        VspComponent, ResultComponent, TrackingComponent,
    ], providers: [
        GET_Service, AlertService, POST_Service,
        {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
    ],
})
export class vspModule {
}