import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default/default.component';
import { ivdashboardComponent } from './iv-dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { FilterPipe,FilterPipeC } from './pipe'; //, SortByPipe 
import { DatePipe } from '@angular/common';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { PagerService } from '../shared/pager/pager.component';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { SharedJobAdvPipeModule } from '../shared/adv-prof-list/job-adv-prof-pipes-module';



const routes: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': ivdashboardComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        //BrowserModule, 
        FormsModule, HttpModule,
        CommonModule, RouterModule.forChild(routes), LayoutModule, ReactiveFormsModule
    ], exports: [
        RouterModule,
    ], declarations: [
        ivdashboardComponent,// FilterPipe,FilterPipeC, SortByPipe
    ], bootstrap: [ivdashboardComponent],
    providers: [DatePipe, GET_Service, POST_Service, PagerService, AlertService]
})
export class ivdashboardModule {
}