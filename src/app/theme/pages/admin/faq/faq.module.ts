import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { DefaultComponent } from '../default/default.component';
import { FaqComponent } from './faq.component';
import { GET_Service } from '../../../api/get.service';
import { AlertService } from '../../../../auth/_services/alert.service';
import { AdminLoadingModule } from '../loading/loading.module';
// import { EditorModule } from '@tinymce/tinymce-angular';
import { QuillModule } from 'ngx-quill'

const routes: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': FaqComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, AdminLoadingModule, QuillModule
    ], exports: [
        RouterModule,
    ], declarations: [
        FaqComponent,//AdminLoadingModule
    ],
    providers: [GET_Service, AlertService]
})
export class FaqModule {
}