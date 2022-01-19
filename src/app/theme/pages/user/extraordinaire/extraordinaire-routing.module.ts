import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { UserDefaultComponent } from '../default/default.component';
import { ExorDetailsComponent } from './details/details.component'
import { ExorSummaryComponent } from './summary/summary.component';
import { POST_Service } from '../../../api/post.service';
import { GET_Service } from '../../../api/get.service';
const heroesRoutes: Routes = [
    {
        'path': '',
        'component': UserDefaultComponent,
        'children': [
            {
                'path': '',
                'component': ExorSummaryComponent,
            },
            {
                'path': 'details/:idx',// 'path': ':page/:idx',
                'component': ExorDetailsComponent,
            },
        ],
    },


];

@NgModule({
    imports: [
        RouterModule.forChild(heroesRoutes), LayoutModule
    ],
    exports: [
        RouterModule
    ],
    providers: [
        POST_Service, GET_Service
    ]
})
export class ExtraordinaireRoutingModule { }
