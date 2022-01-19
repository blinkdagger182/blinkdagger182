import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { POST_Service } from '../../../api/post.service';
import { GET_Service } from '../../../api/get.service';
import { DatePipe } from '@angular/common';

import { UserJobComponent } from './user-job.component';
import { UserJobRoutingModule } from './user-job-routing.module';
import { SelectJobModule } from './select-job/select-job.module';
import { SearchJobModule } from './search-job/search-job.module';
import { TrackJobModule } from './tracking/job-tracking.module';
import { ReviewModule } from './tracking-review/review.module';
import { JobInfoModule } from './job-info/job-info.module';
import { CommentsModule } from './comments/comments.module'
import { UserLoadingModule } from '../loading/loading.module';
import { JobLoadingModule } from './job-loading/job-loading-module'
import { LayoutModule } from '../../../layouts/layout.module';
import { NotifierModule } from 'angular-notifier';

@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule, UserJobRoutingModule, 
        SearchJobModule, SelectJobModule, TrackJobModule, ReviewModule, 
        JobInfoModule, CommentsModule, UserLoadingModule, JobLoadingModule, LayoutModule, 
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
    ],
    declarations: [
        UserJobComponent
    ],
    exports: [
        UserJobComponent
    ],
    providers: [
        POST_Service, GET_Service, DatePipe, UserJobComponent,
    ]

})
export class UserJobModule { }
