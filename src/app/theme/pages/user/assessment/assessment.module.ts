import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { UserDefaultComponent } from '../default/default.component';
import { AssessmentComponent } from './assessment.component';
import { GET_Service } from '../../../api/get.service';
import { POST_Service } from '../../../api/post.service';
import { AlertService } from '../../../../auth/_services/alert.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserLoadingModule } from '../../user/loading/loading.module';
import { SharedModule } from '../../../../shared/shared.module';
import { UserPagerService } from '../pager/pager.component';
import { NotifierModule } from 'angular-notifier';
// import { UserCircleRoutingModule } from './circle-routing.modules';

const routes: Routes = [
    {
        'path': '',
        'component': UserDefaultComponent,
        'children': [
            {
                'path': '',
                'component': AssessmentComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule,FormsModule, ReactiveFormsModule, SharedModule, NotifierModule, UserLoadingModule
    ], exports: [
        RouterModule,
    ], declarations: [
        AssessmentComponent
    ],
    providers: [POST_Service, GET_Service, AlertService, UserPagerService]
})
export class AssessmentModule {
}