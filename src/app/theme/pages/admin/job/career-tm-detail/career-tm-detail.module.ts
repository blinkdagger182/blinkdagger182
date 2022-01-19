import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default/default.component';
import { CareerTMDetailComponent } from './career-tm-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { POST_Service } from '../../../../api/post.service';
import { GET_Service } from '../../../../api/get.service';
import { DatePipe } from '@angular/common';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { JobLoadingModule } from '../../../user/user-job/job-loading/job-loading-module';
import { SharedModule } from '../../../../../shared/shared.module';
import { PagerService } from '../shared/pager/pager.component';

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
                'component': CareerTMDetailComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule, ReactiveFormsModule, JobLoadingModule, SharedModule,
    ], exports: [
        RouterModule,
    ], declarations: [
        CareerTMDetailComponent,
    ], providers: [
        POST_Service, GET_Service, DatePipe, AlertService, PagerService
    ],
})
export class CareerTMDetailModule {

    jobDetail() {

    }
}

