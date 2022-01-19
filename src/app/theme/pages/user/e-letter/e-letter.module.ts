import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { UserDefaultComponent } from '../default/default.component';
import { ELetterComponent } from './e-letter.component';
import { MovementPermitComponent } from './movement-permit/movement-permit.component';
import { ELetterTrackingComponent } from './tracking/tracking.component';
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

import { HttpClientModule } from '@angular/common/http';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { IDPLoadingModule } from '../idp/idp-loading/idp-loading-module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { UploadFilesComponent } from './upload-files/upload-files.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {NgxPrintModule} from 'ngx-print';


const routes: Routes = [
    {
        'path': '',
        'component': UserDefaultComponent,
        'children': [
          {
              'path': '',
              'component': ELetterComponent,
          },
          {
              'path': 'tracking',
              'component': ELetterTrackingComponent,
          },
          {
              'path': 'movepermit',
              'component': MovementPermitComponent,
          },          
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule, ReactiveFormsModule, SuiModule, 
        UserLoadingModule, IDPLoadingModule,
        SuiSelectModule, MatInputModule, MatDatepickerModule, MatNativeDateModule,
        NgxChartsModule,HttpClientModule,
        NgMultiSelectDropDownModule.forRoot(),
        NgxDropzoneModule,
        PdfViewerModule,
        NgxPrintModule,
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
        }),
        OwlDateTimeModule, OwlNativeDateTimeModule,
    ], exports: [
        RouterModule,
    ], declarations: [
      ELetterComponent, ELetterTrackingComponent, MovementPermitComponent, UploadFilesComponent, 
    ], providers: [
        GET_Service, AlertService, POST_Service,
        {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}
    ],
})
export class ELetterModule {
}