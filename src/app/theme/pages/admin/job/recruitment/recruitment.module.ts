import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default/default.component';
import { recruitmentComponent } from './recruitment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { PagerService } from '../shared/pager/pager.component';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 
import { ImageService } from '../../../user/nomination/ImageService';
import { NgPipesModule } from 'ngx-pipes';
import { NotifierModule } from 'angular-notifier';
//import { NgxNumberSpinnerModule } from 'ngx-number-spinner';

const routes: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': recruitmentComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        //BrowserModule, 
        
        NgbModule.forRoot(),FormsModule, HttpModule,NgPipesModule,
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
        recruitmentComponent//FilterPipeC, SortByPipe
    ], bootstrap: [recruitmentComponent],
    providers: [DatePipe, GET_Service, POST_Service, PagerService, AlertService,ImageService]
})
export class recruitmentModule {
}