import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { UserDefaultComponent } from '../default/default.component';
import { annoucementComponent } from './annoucement.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GET_Service } from '../../../api/get.service';
import { POST_Service } from '../../../api/post.service';
import { NotifierModule } from 'angular-notifier';
import { MatButtonModule } from '@angular/material';
import { UserLoadingModule } from '../loading/loading.module';
import { IDPLoadingModule } from '../idp/idp-loading/idp-loading-module';
import { PagerService } from '../../admin/job/shared/pager/pager.component';
import {EmojiPickerModule} from 'ng-emoji-picker';

const routes: Routes = [
    {
        'path': '',
        'component': UserDefaultComponent,
        'children': [
            {
                'path': '',
                'component': annoucementComponent,
            },            
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule, ReactiveFormsModule, 
        UserLoadingModule, 
        IDPLoadingModule,
        MatButtonModule,
        EmojiPickerModule,
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
        annoucementComponent,
    ], providers: [
        GET_Service, POST_Service, PagerService,
    ],
})
export class annoucementModule {
}