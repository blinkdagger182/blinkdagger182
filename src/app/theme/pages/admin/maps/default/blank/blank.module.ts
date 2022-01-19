import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../../layouts/layout.module';
import { mapsDefaultComponent } from '../default.component';
import { mapsBlankComponent } from './blank.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GET_Service } from '../../../../../api/get.service';
import { POST_Service } from '../../../../../api/post.service';
// import { HrefPreventDefaultDirective } from '../../../../../_directives/href-prevent-default.directive';
// import { UnwrapTagDirective } from '../../../../../_directives/unwrap-tag.directive';
import { NotifierModule } from 'angular-notifier';
import { MatButtonModule } from '@angular/material';
import { mapsLoadingModule } from '../../loading/loading.module';
import { DatePipe, DecimalPipe } from '@angular/common';
import { PagerService } from '../../../../engage/shared/pager/pager.component';


const routes: Routes = [
    {
        'path': '',
        'component': mapsDefaultComponent,
        'children': [
            {
                'path': '',
                'component': mapsBlankComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule, ReactiveFormsModule,
        MatButtonModule, mapsLoadingModule,
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
        // HrefPreventDefaultDirective,
    ], declarations: [
        mapsBlankComponent,

        // HrefPreventDefaultDirective,
        // UnwrapTagDirective,
    ],
    providers: [GET_Service, POST_Service, DatePipe, DecimalPipe,PagerService,]
})
export class mapsBlankModule {
}