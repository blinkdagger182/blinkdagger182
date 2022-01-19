import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { GET_Service } from '../../../api/get.service';
import { AlertService } from '../../../../auth/_services/alert.service';

import { UserDefaultComponent } from '../default/default.component';

import { UserJobComponent } from './user-job.component';
import { SelectJobComponent } from './select-job/select-job.component';
import { SearchJobComponent } from './search-job/search-job.component';
import { JobInfoComponent } from './job-info/job-info.component';
import { CommentsComponent } from './comments/comments.component';
import { JobTrackingComponent } from './tracking/job-tracking.component';
import { ReviewComponent } from './tracking-review/review.component';


const jobroutes: Routes = [
    {
        'path': '',
        'component': UserDefaultComponent,
        'children': [
            {
                'path': '',
                'component': UserJobComponent,
            },
            {
                'path': 'tracking',
                'component': JobTrackingComponent,
            },
            {
                'path': 'tracking/:idx',
                'component': JobTrackingComponent,
            },
            {
                'path': 'tracking-review/:idx',
                'component': ReviewComponent,
            },
            {
                'path': 'select-job/:idx',
                'component': SelectJobComponent,
            },
            {
                'path': 'job-info/:id1',
                'component': JobInfoComponent,
            },
            {
                'path': 'job-info/:id1/:id2',
                'component': JobInfoComponent,
            },
            {
                'path': 'comments/:idx',
                'component': CommentsComponent,
            },
            {
                'path': 'search-job',
                'component': SearchJobComponent,
            },
         
        ]
    }
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(jobroutes), LayoutModule
    ], exports: [
        RouterModule,
    ],
    providers: [GET_Service, AlertService]
})
export class UserJobRoutingModule {
}