import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default/default.component';
import { CareerAdvDetailComponent } from './career-adv-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { POST_Service } from '../../../../api/post.service';
import { GET_Service } from '../../../../api/get.service';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { QuillModule } from 'ngx-quill' 
import { SuiModule } from 'ng2-semantic-ui';
import { JobInfoModule } from '../../../../pages/user/user-job/job-info/job-info.module';
import { SharedModule } from '../../../../../shared/shared.module';

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
                'component': CareerAdvDetailComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule, ReactiveFormsModule, QuillModule, SuiModule, 
        JobInfoModule, SharedModule,
    ], exports: [
        RouterModule,
    ], providers: [
        POST_Service,
        GET_Service, AlertService,
    ], declarations: [
        CareerAdvDetailComponent,
    ],
})
export class CareerAdvDetailModule {

    jobDetail() {

    }
}

