import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutModule } from '../../../../layouts/layout.module';
import { mapsDefaultComponent } from '../default/default.component';
import { mapsProfileComponent } from './profile.component';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NotifierModule } from 'angular-notifier';
import { mapsLoadingModule } from '../loading/loading.module';

const routes: Routes = [
    {
        'path': '',
        'component': mapsDefaultComponent,
        'children': [
            {
                'path': '',
                'component': mapsProfileComponent,
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule, RouterModule.forChild(routes), LayoutModule, FormsModule, ReactiveFormsModule, SuiModule, mapsLoadingModule, PdfViewerModule,
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
        mapsProfileComponent,
    ], providers: [GET_Service, AlertService, POST_Service],
})
export class mapsProfileModule {
}