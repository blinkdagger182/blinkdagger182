import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { EngageDefaultComponent } from '../default.component';
import { EngageBlankComponent } from './blank.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
// import { HrefPreventDefaultDirective } from '../../../../../_directives/href-prevent-default.directive';
// import { UnwrapTagDirective } from '../../../../../_directives/unwrap-tag.directive';
import { NotifierModule } from 'angular-notifier';
import { MatButtonModule } from '@angular/material';
import { EngageLoadingModule } from '../../loading/loading.module';
import { DatePipe, DecimalPipe } from '@angular/common';


const routes: Routes = [
    {
        'path': '',
        'component': EngageDefaultComponent,
        'children': [
            {
                'path': '',
                'component': EngageBlankComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule, ReactiveFormsModule,
        MatButtonModule, EngageLoadingModule,
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
        EngageBlankComponent,

        // HrefPreventDefaultDirective,
        // UnwrapTagDirective,
    ],
    providers: [GET_Service, POST_Service, DatePipe, DecimalPipe]
})
export class EngageBlankModule {
}