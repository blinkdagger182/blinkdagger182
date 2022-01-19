
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { JobTrackingComponent } from './job-tracking.component';
import { UserLoadingModule } from '../../../user/loading/loading.module';
import { JobLoadingModule } from '../job-loading/job-loading-module';
import { SharedModule } from '../../../../../shared/shared.module';
import { UserPagerService } from '../../pager/pager.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 
import { SearchPipe } from './pipes';
import { MatStepperModule, MatInputModule, MatButtonModule, MatAutocompleteModule } from '@angular/material';
import { ImageService } from '../../../user/nomination/ImageService';

import { NotifierModule } from 'angular-notifier';
@NgModule({
    imports: [NgbModule.forRoot(),CommonModule, FormsModule, UserLoadingModule, JobLoadingModule, ReactiveFormsModule, SharedModule, MatStepperModule,
        MatInputModule,
        MatButtonModule,
        MatAutocompleteModule,
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
    declarations: [JobTrackingComponent,SearchPipe],
    exports: [JobTrackingComponent, RouterModule],
    providers:[UserPagerService,ImageService]
})
export class TrackJobModule { }