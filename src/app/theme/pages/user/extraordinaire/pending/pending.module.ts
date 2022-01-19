
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ExorApprPendingComponent } from './pending.component';
import { NotifierModule } from 'angular-notifier';
import { UserPagerService } from '../../pager/pager.component';
import { UserLoadingModule } from '../../../user/loading/loading.module';

@NgModule({
    imports: [
        CommonModule, UserLoadingModule,
        FormsModule, ReactiveFormsModule,
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
        ExorApprPendingComponent
    ],
    exports: [ExorApprPendingComponent, RouterModule],
    providers: [UserPagerService]
})
export class ExOrApprPendingModule { }
