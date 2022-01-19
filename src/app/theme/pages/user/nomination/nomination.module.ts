// Angular Imports
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
// This Module's Components
import { nominationComponent } from './nomination.component';
import { UserDefaultComponent } from '../default/default.component';
import { GET_Service } from '../../../api/get.service';
import { POST_Service } from '../../../api/post.service';
import { AlertService } from '../../../../auth/_services/alert.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SuccessorFilterPipe } from './SPTypeFilterPipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
import { NotifierModule } from 'angular-notifier';
import { SharedModule } from '../../../../shared/shared.module';
import { QuillModule } from 'ngx-quill';
import { NominationLoadingModule } from './nomination-loading/nomination-loading.module';
import { ImageService } from './ImageService';

const routes: Routes = [
    {
        'path': '',
        'component': UserDefaultComponent,
        'children': [
            {
                'path': '',
                'component': nominationComponent,
            },
           ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule, SharedModule, QuillModule,
        ReactiveFormsModule, NgbModule.forRoot(), SuiModule, NominationLoadingModule,  NotifierModule.withConfig({
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
        nominationComponent, RouterModule, 
    ], declarations: [
        nominationComponent, SuccessorFilterPipe,
    ],
    providers: [POST_Service, GET_Service, AlertService, ImageService]
})
export class nominationModule {

}