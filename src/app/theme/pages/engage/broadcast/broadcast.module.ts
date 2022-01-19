import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { EngageDefaultComponent } from '../default/default.component';
import { EngageBroadcastComponent } from './broadcast.component';
import { EngageLoadingModule } from '../loading/loading.module';
import { CountdownPipe } from './pipes';


const routes: Routes = [
    {
        'path': '',
        'component': EngageDefaultComponent,
        'children': [
            {
                'path': '',
                'component': EngageBroadcastComponent,
            },
        ],
    },
];

import { NotifierModule } from 'angular-notifier';
@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule,
        RouterModule.forChild(routes), LayoutModule, EngageLoadingModule,
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
        EngageBroadcastComponent, CountdownPipe
    ],
    providers: [ ]
})
export class EngageBroadcastModule {
}