import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default/default.component';
import { JobAdvertisementDetailComponent } from './job-advertisement-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { POST_Service } from '../../../../api/post.service';
import { GET_Service } from '../../../../api/get.service';
import { DatePipe } from '@angular/common';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { JobLoadingModule } from '../../../user/user-job/job-loading/job-loading-module';
import { SharedModule } from '../../../../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 
import { NotifierModule } from 'angular-notifier';

let users: any[] = JSON.parse(localStorage.getItem('users')) || [];
let filteredUsers = "";// users.filter(user => {
//});

const routes: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': JobAdvertisementDetailComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule, ReactiveFormsModule, JobLoadingModule, SharedModule, NgbModule.forRoot(),
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
        JobAdvertisementDetailComponent,
    ], providers: [
        POST_Service, GET_Service, DatePipe, AlertService,
    ],
})
export class JobAdvertisementDetailModule {

    jobDetail() {

    }
}

