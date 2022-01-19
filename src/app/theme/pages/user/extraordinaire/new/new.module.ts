
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ExorNewComponent } from './new.component';
import { POST_Service } from '../../../../api/post.service';
import { GET_Service } from '../../../../api/get.service';
import { ContactSearchService } from './contact-search.service';
// import { SharingService } from '../extraordinaire-sharing-service';
import { UserLoadingModule } from '../../../user/loading/loading.module';
import { UserLoadingErrorModule } from '../../../user/loading-error/loading-error.module';
import { UserNoDataModule } from '../../../user/no-data/no-data.module';
import { NotifierModule } from 'angular-notifier';
import { SuiModule } from 'ng2-semantic-ui';
import { EditorModule } from '@tinymce/tinymce-angular';
import { QuillModule } from 'ngx-quill'

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, UserLoadingModule, UserLoadingErrorModule, UserNoDataModule, SuiModule,
        EditorModule, QuillModule,
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
        })],
    declarations: [ExorNewComponent],
    exports: [ExorNewComponent, RouterModule],
    providers: [POST_Service, GET_Service, ContactSearchService,] //
    // providers:[CountdownPipe]
})
export class ExOrNewModule { }
