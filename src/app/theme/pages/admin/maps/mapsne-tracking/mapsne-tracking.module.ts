import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { mapsDefaultComponent } from '../default/default.component';
// This Module's Components
import { MapsneTrackingComponent } from './mapsne-tracking.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterPipe,FilterPipeC } from './pipe'; //, SortByPipe 
import { DatePipe } from '@angular/common';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { PagerService } from '../shared/pager/pager.component';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { SuiSelectModule } from 'ng2-semantic-ui';
import { SuiModule } from 'ng2-semantic-ui';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill' ;
import { NotifierModule } from 'angular-notifier';
const routes: Routes = [
    {
        'path': '',
        'component': mapsDefaultComponent,
        'children': [
            {
                'path': '',
                'component': MapsneTrackingComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        FormsModule, HttpModule,
        CommonModule, RouterModule.forChild(routes), LayoutModule, ReactiveFormsModule,SuiSelectModule,
        SuiModule, QuillModule, NgbModule.forRoot(),
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
        RouterModule, FilterPipe, FilterPipeC, 
    ], declarations: [
        MapsneTrackingComponent, FilterPipe,FilterPipeC,// SortByPipe
    ], bootstrap: [MapsneTrackingComponent],
    providers: [DatePipe, GET_Service, POST_Service, PagerService, AlertService]
})
export class MapsneTrackingModule {

}
