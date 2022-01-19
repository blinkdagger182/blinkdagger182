import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { UserDefaultComponent } from '../default/default.component';
import { IDPHomeComponent } from './idp-home.component';
import { IDPFormComponent } from './idp-form/idp-form.component';
import { GET_Service } from '../../../api/get.service';
import { POST_Service } from '../../../api/post.service';
import { AlertService } from '../../../../auth/_services/alert.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserLoadingModule } from '../../user/loading/loading.module';
import { IDPLoadingModule } from './idp-loading/idp-loading-module';
import { SuiModule } from 'ng2-semantic-ui';
import { NotifierModule } from 'angular-notifier';
import { SuiSelectModule } from 'ng2-semantic-ui';
import { MatTabsModule } from '@angular/material';


// Material
import {  MatInputModule, MatDatepickerModule, MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material';
// //import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
// // import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from 'ngx-mat-datetime-picker';
// import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
// // import {
// //     NgxMatDatetimePickerModule, 
// //     NgxMatNativeDateModule, 
// //     NgxMatTimepickerModule 
// // } from '@angular-material-components/datetime-picker';


import { NgxChartsModule } from '@swimlane/ngx-charts';

const routes: Routes = [
    {
        'path': '',
        'component': UserDefaultComponent,
        'children': [
            {
                'path': '',
                'component': IDPHomeComponent,
            },
            {
                'path': 'form/:idx',
                'component': IDPFormComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule, ReactiveFormsModule, SuiModule, UserLoadingModule, IDPLoadingModule,
        SuiSelectModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,
        NgxChartsModule, MatTabsModule,
    //     // NgxMatDatetimePickerModule,
    //     // NgxMatTimepickerModule,
    //     // NgxMatNativeDateModule,
    // //     BrowserModule,
    // //   HttpClientModule,
    // //   BrowserAnimationsModule,
    //   MatDatepickerModule,
    //   MatInputModule,
    //   //NgxMatTimepickerModule,
    //   FormsModule,
    //   ReactiveFormsModule,
    //  // MatButtonModule,
    //   //NgxMatDatetimePickerModule,
        
    //     //OwlDateTimeModule,
    //     //OwlNativeDateTimeModule,
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
        IDPHomeComponent, IDPFormComponent,
    ], providers: [
        GET_Service, AlertService, POST_Service,
        {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
    ],
})
export class IDPModule {
}