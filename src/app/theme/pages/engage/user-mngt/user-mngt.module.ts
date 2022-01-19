import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { EngageDefaultComponent } from '../default/default.component';
import { UserMngtComponent } from './user-mngt.component';
import { EngageLoadingModule } from '../loading/loading.module';
import { PagerService } from '../shared/pager/pager.component';
import { SuiSelectModule } from 'ng2-semantic-ui';

const routes: Routes = [
    {
        'path': '',
        'component': EngageDefaultComponent,
        'children': [
            {
                'path': '',
                'component': UserMngtComponent,
            },
        ],
    },
];

import { NotifierModule } from 'angular-notifier';
@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        RouterModule.forChild(routes), LayoutModule, EngageLoadingModule, SuiSelectModule,
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
        UserMngtComponent,//AdminLoadingModule
    ],
    providers: [ PagerService ]
})
export class UserMngtModule {
}