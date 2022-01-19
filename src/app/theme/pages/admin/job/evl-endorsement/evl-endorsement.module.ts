import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default/default.component';
import { EVLEndorsementComponent } from './evl-endorsement.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterPipe } from './pipe'; //, SortByPipe 
import { DatePipe } from '@angular/common';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { PagerService } from '../shared/pager/pager.component';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { NotifierModule } from 'angular-notifier';
import { MatDatepickerModule, MatFormFieldModule, MatNativeDateModule } from '@angular/material';
import { MatSlideToggleModule, MatCheckboxModule} from '@angular/material'

const routes: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': EVLEndorsementComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        //BrowserModule, 
        FormsModule, HttpModule,
        MatDatepickerModule,
        MatSlideToggleModule, 
        MatCheckboxModule,
        MatFormFieldModule,
        CommonModule, RouterModule.forChild(routes), LayoutModule, ReactiveFormsModule,
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
        EVLEndorsementComponent, FilterPipe,// SortByPipe
    ], bootstrap: [EVLEndorsementComponent],
    providers: [DatePipe, GET_Service, POST_Service, PagerService, AlertService]
})
export class EndorsementModule {
}