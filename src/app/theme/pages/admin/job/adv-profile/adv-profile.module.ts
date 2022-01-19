import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default/default.component';
import { AdvProfileComponent } from './adv-profile.component';
//import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { POST_Service } from '../../../../api/post.service';
import { GET_Service } from '../../../../api/get.service';
import { AuthRoutingModule } from '../../../../../auth/auth-routing.routing';
import { AlertService } from '../../../../../auth/_services/alert.service';

// import { FilterPipe, SortByPipe } from '../job-profile/pipes';
import { SharedJobAdvPipeModule } from '../shared/adv-prof-list/job-adv-prof-pipes-module';
import { PagerService } from '../shared/pager/pager.component';

const routes: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': AdvProfileComponent,
            },
            //{
            //    'path': 'search/:param',
            //    'component': AdvProfileComponent,
            //},
        ],
    },
];

@NgModule({
    imports: [
        //BrowserModule, 
        FormsModule, HttpModule, CommonModule,
        RouterModule.forChild(routes), LayoutModule, SharedJobAdvPipeModule
    ],
    providers: [
        AlertService, POST_Service, PagerService, GET_Service
    ], exports: [
        RouterModule,
    ], declarations: [
        AdvProfileComponent, //FilterPipe, SortByPipe
    ], bootstrap: [AdvProfileComponent]
})
export class AdvProfileModule {
}