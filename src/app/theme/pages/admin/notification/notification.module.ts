import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { DefaultComponent } from '../default/default.component';
import { NotificationComponent } from './notification.component';
import { GET_Service } from '../../../api/get.service';
import { AlertService } from '../../../../auth/_services/alert.service';
import { AdminLoadingModule } from '../loading/loading.module';
import { SharedModule } from '../../../../shared/shared.module'


const routes: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': NotificationComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, AdminLoadingModule, SharedModule,
    ], exports: [
        RouterModule,
    ], declarations: [
        NotificationComponent,//AdminLoadingModule
    ],
    providers: [GET_Service, AlertService]
})
export class NotificationModule {
}