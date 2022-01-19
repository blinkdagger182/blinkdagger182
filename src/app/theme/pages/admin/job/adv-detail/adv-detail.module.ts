import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default/default.component';
import { AdvDetailComponent } from './adv-detail.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { POST_Service } from '../../../../api/post.service';
import { GET_Service } from '../../../../api/get.service';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { DatePipe } from '@angular/common';
import { QuillModule } from 'ngx-quill' 

let users: any[] = JSON.parse(localStorage.getItem('users')) || [];
let filteredUsers = "";// users.filter(user => {

//});

const routes: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': AdvDetailComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule, ReactiveFormsModule, QuillModule,
    ], exports: [
        RouterModule,
    ], providers: [
        POST_Service, GET_Service, AlertService, DatePipe
    ], declarations: [
        AdvDetailComponent,
    ],
})
export class AdvDetailModule {
}

