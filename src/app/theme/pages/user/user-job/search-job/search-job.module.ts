
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SearchJobComponent } from './search-job.component';
import { UserLoadingModule } from '../../../user/loading/loading.module';
import { JobLoadingModule } from '../job-loading/job-loading-module';

import { NotifierModule } from 'angular-notifier';
@NgModule({
    imports: [CommonModule, FormsModule, UserLoadingModule, JobLoadingModule, ReactiveFormsModule, 
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
    declarations: [SearchJobComponent],
    exports: [SearchJobComponent, RouterModule],
    // providers:[CountdownPipe]
})
export class SearchJobModule { }