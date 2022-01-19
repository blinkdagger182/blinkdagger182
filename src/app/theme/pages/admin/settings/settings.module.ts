import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { POST_Service } from '../../../api/post.service';
import { GET_Service } from '../../../api/get.service';
import { SettingsRoutingModule } from './settings-routing.module';
import { StgJobUserComponent } from './job-user/job-user.component';
import { StgClosedAdsComponent } from './closed-ads/closed-ads.component';
import { StgClosedAdsCareerComponent } from './closed-ads-career/closed-ads-career.component';
import { StgBroadcastMessageComponent } from './broadcast-message/broadcast-message.component';
import { StgBroadcastMessageCareerComponent } from './broadcast-message-career/broadcast-message-career.component';
import { StgFeedbacksComponent } from './feedbacks/feedbacks.component';
import { StgFeedbacksComponent_Dev } from './feedbacks/feedbacks_dev/feedbacks_dev.component';
import { StgVerifySkillsetsComponent } from './verify-skillsets/verify-skillsets.component';
import { StgEraAppVersioningComponent } from './era-app-versioning/era-app-versioning.component';
import { FaqComponent } from './faq_mngt/faq.component';
import { CalLevelTwoComponent } from './cal-level-two/cal-level-two.component';
import { quesComponent } from './ques/ques.component';
import { StickyNavModule } from './sticky-nav/sticky-nav.module';
import { StgUnauthorizedComponent } from './unauthorized/unauthorized.component';
import { PagerService } from '../job/shared/pager/pager.component';
//import { AlertService } from '../../../auth/_services/alert.service';
import { CountdownPipe } from './broadcast-message/pipes';
import { CountdownPipe2 } from './broadcast-message-career/pipes';
import { StgLoadingComponent } from './loading/loading.component';
import { StgNoDataComponent } from './no-data/no-data.component';
import { StgLoadingErrorComponent } from './loading-error/loading-error.component';
import { DatePipe } from '@angular/common';
import { SuiSelectModule } from 'ng2-semantic-ui';
import { EditorModule } from '@tinymce/tinymce-angular';
import { QuillModule } from 'ngx-quill'
import { SharedModule } from '../../../../shared/shared.module';
import { StgSimulateUserAccountComponent } from './simulate-user-account/simulate-user-account.component';
import { TCMComponent } from './tcm/tcm.component';
import { NotifierModule } from 'angular-notifier';
import { ViewTeamComponent } from './cal-level-two/view-team/view-team.component';
import { NameFilterPipe } from './cal-level-two/view-team/nameFilter';
import { DepartmentFilterPipe, UnitFilterPipe, SupervisorFilterPipe, StaffIdFilterPipe } from './cal-level-two/searchFilter';
import { TCReportComponent } from './tc-report/tc-report.component';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
    imports: [
        CommonModule, FormsModule, ReactiveFormsModule, SettingsRoutingModule, StickyNavModule, SuiSelectModule, EditorModule, QuillModule, SharedModule, ClickOutsideModule,
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
    ],
    declarations: [
        StgJobUserComponent, 
        StgClosedAdsComponent, 
        StgClosedAdsCareerComponent, 
        StgBroadcastMessageComponent, 
        StgBroadcastMessageCareerComponent,
        StgFeedbacksComponent, 
        StgFeedbacksComponent_Dev, 
        StgVerifySkillsetsComponent, 
        StgEraAppVersioningComponent,
        StgSimulateUserAccountComponent,
        StgUnauthorizedComponent, 
        StgLoadingComponent, 
        StgNoDataComponent,
        StgLoadingErrorComponent, 
        CountdownPipe, 
        CountdownPipe2, 
        FaqComponent, 
        quesComponent, 
        CalLevelTwoComponent,
        TCMComponent,
        ViewTeamComponent,
        TCReportComponent,
        NameFilterPipe,
        DepartmentFilterPipe, UnitFilterPipe, SupervisorFilterPipe, StaffIdFilterPipe
    ],
    providers: [
        POST_Service, GET_Service, PagerService, DatePipe
    ]
    //providers: [ AlertService]
})
export class SettingsModule { }
