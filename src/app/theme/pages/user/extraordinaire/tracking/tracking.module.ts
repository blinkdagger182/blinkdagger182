
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ExorTrackingComponent } from './tracking.component';
import { NotifierModule } from 'angular-notifier';
import { UserLoadingModule } from '../../../user/loading/loading.module';
import { UserLoadingErrorModule } from '../../../user/loading-error/loading-error.module';
import { UserNoDataModule } from '../../../user/no-data/no-data.module';
import { UserPagerService } from '../../pager/pager.component';
import { ExOrEditModule } from '../edit/edit.module';
import { SharingService } from '../extraordinaire-sharing-service';

@NgModule({
    imports: [
        CommonModule, ExOrEditModule,
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
        , UserLoadingModule, UserLoadingErrorModule, UserNoDataModule
    ],
    declarations: [
        ExorTrackingComponent
    ],
    exports: [ExorTrackingComponent, RouterModule],
    providers: [UserPagerService, SharingService]
})
export class ExOrTrackingModule { }
