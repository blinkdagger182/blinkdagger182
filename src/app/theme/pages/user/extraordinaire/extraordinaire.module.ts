import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { POST_Service } from '../../../api/post.service';
import { GET_Service } from '../../../api/get.service';
import { DatePipe } from '@angular/common';

import { ExtraordinaireRoutingModule } from './extraordinaire-routing.module';
import { UserUnauthorizedComponent } from '../unauthorized/unauthorized.component';

import { UserPagerService } from '../pager/pager.component';
import { UserCountdownPipe } from "../countdown/countdown";
import { ExOrDetailsModule } from './details/details.module';
import { ExOrSummaryModule } from './summary/summary.module';
import { NotifierModule } from 'angular-notifier';
@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule, ExtraordinaireRoutingModule,
        ExOrDetailsModule, ExOrSummaryModule,
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
        UserUnauthorizedComponent, UserCountdownPipe,
    ],
    providers: [
        POST_Service, GET_Service, UserPagerService, DatePipe
    ]
    //providers: [ AlertService]
})
export class ExtraordinaireModule { }
