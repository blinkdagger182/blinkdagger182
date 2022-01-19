import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { UserDefaultComponent } from '../default/default.component';
import { MapsComponent } from './maps.component';
import { GET_Service } from '../../../api/get.service';
import { POST_Service } from '../../../api/post.service';
import { AlertService } from '../../../../auth/_services/alert.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
import { UserLoadingModule } from '../loading/loading.module';
import { SharedModule } from '../../../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillModule } from 'ngx-quill' ;

const routes: Routes = [
    {
        'path': '',
        'component': UserDefaultComponent,
        'children': [
            {
                'path': '',
                'component': MapsComponent,
            },
           

        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, UserLoadingModule,
        FormsModule, ReactiveFormsModule, SuiModule, SharedModule, QuillModule,
        // QuillModule.forRoot({
        //     modules: {
        //         toolbar: [
        //             ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        //             [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        //             [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
        //         ]
        //     }
        // }), 
        NgbModule.forRoot()
    ], exports: [
        RouterModule,
    ], declarations: [
        MapsComponent
    ], providers: [GET_Service, AlertService, POST_Service],
})
export class MapsModule {
}