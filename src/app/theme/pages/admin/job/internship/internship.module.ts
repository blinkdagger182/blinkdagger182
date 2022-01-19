import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default/default.component';
import { InternshipComponent } from './internship.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterPipe } from './pipe'; //, SortByPipe 
import { DatePipe } from '@angular/common';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { PagerService } from '../../job/shared/pager/pager.component';
import { AlertService } from '../../../../../auth/_services/alert.service';

const routes: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': InternshipComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        //BrowserModule, 
        FormsModule, HttpModule,
        CommonModule, RouterModule.forChild(routes), LayoutModule, ReactiveFormsModule,
    ], exports: [
        RouterModule,
    ], declarations: [
        InternshipComponent, FilterPipe,// SortByPipe
    ], bootstrap: [InternshipComponent],
    providers: [DatePipe, GET_Service, POST_Service, PagerService, AlertService]
})
export class InternshipModule {
}