import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default/default.component';
import { IvSessionManagementComponent } from './iv-session-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { POST_Service } from '../../../../api/post.service';
import { GET_Service } from '../../../../api/get.service';
import { HttpModule } from '@angular/http';
import { DatePipe } from '@angular/common';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { SharedModule } from '../../../../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { PagerService } from '../shared/pager/pager.component';
import { SuiSelectModule } from 'ng2-semantic-ui';
import { NotifierModule } from 'angular-notifier';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 

const routes: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': IvSessionManagementComponent,
            },
          
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, 
        RouterModule.forChild(routes), 
        LayoutModule, 
        FormsModule, 
        ReactiveFormsModule,
        SuiSelectModule, 
        NgbModule.forRoot(),
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
        IvSessionManagementComponent,
    ], providers: [
        POST_Service, GET_Service, DatePipe, AlertService, PagerService
    ],
})
export class IvSessionManagementModule {

}
