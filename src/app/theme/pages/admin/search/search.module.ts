import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { DefaultComponent } from '../default/default.component';
import { SearchComponent } from './search.component';
//import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FilterPipe } from './pipes'; //, SortByPipe 
import { DatePipe } from '@angular/common';
import { GET_Service } from '../../../api/get.service';
import { POST_Service } from '../../../api/post.service';
import { PagerService } from '../job/shared/pager/pager.component';
import { AlertService } from '../../../../auth/_services';
import { SuiModule } from 'ng2-semantic-ui';
import { NotifierModule } from 'angular-notifier';

const routes: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': SearchComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        //BrowserModule, 
        FormsModule, HttpModule,
        CommonModule, RouterModule.forChild(routes), LayoutModule, SuiModule, ReactiveFormsModule,
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
        SearchComponent, FilterPipe,// SortByPipe
    ], bootstrap: [SearchComponent],
    providers: [DatePipe, GET_Service, POST_Service, PagerService, AlertService]
})
export class SearchModule {
}