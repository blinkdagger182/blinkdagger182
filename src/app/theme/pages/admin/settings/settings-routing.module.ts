import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutModule } from '../../../layouts/layout.module';
import { DefaultComponent } from '../default/default.component';
import { StgJobUserComponent } from './job-user/job-user.component';
import { StgBroadcastMessageComponent } from './broadcast-message/broadcast-message.component';
import { StgBroadcastMessageCareerComponent } from './broadcast-message-career/broadcast-message-career.component';
import { StgFeedbacksComponent } from './feedbacks/feedbacks.component';
import { StgFeedbacksComponent_Dev } from './feedbacks/feedbacks_dev/feedbacks_dev.component';
import { StgVerifySkillsetsComponent } from './verify-skillsets/verify-skillsets.component';
import { StgClosedAdsComponent } from './closed-ads/closed-ads.component';
import { StgClosedAdsCareerComponent } from './closed-ads-career/closed-ads-career.component';
import { StgEraAppVersioningComponent } from './era-app-versioning/era-app-versioning.component';
import { FaqComponent } from './faq_mngt/faq.component';
import { CalLevelTwoComponent } from './cal-level-two/cal-level-two.component';
import { quesComponent } from './ques/ques.component';
import { StgSimulateUserAccountComponent } from './simulate-user-account/simulate-user-account.component';
import { TCReportComponent } from './tc-report/tc-report.component';
import { ViewTeamComponent } from './cal-level-two/view-team/view-team.component';
import { TCMComponent } from './tcm/tcm.component';

const heroesRoutes: Routes = [
    {
        'path': '',
        'component': DefaultComponent,
        'children': [
            {
                'path': '',
                'component': StgBroadcastMessageComponent, //StgJobUserComponent,
            },
            {
                'path': 'job-user',
                'component': StgJobUserComponent, //StgJobUserComponent,
            },
            {
                'path': 'broadcast-message',
                'component': StgBroadcastMessageComponent,
            },
            {
                'path': 'broadcast-message-career',
                'component': StgBroadcastMessageCareerComponent,
            },
            {
                'path': 'feedbacks',
                'component': StgFeedbacksComponent,
            },
            {
                'path': 'feedbacks_dev',
                'component': StgFeedbacksComponent_Dev,
            },
            {
                'path': 'feedbacks_dev/:id',
                'component': StgFeedbacksComponent_Dev,
            },
            {
                'path': 'verify-skillsets',
                'component': StgVerifySkillsetsComponent,
            },
            {
                'path': 'closed-ads',
                'component': StgClosedAdsComponent,
            },
            {
                'path': 'closed-ads-career',
                'component': StgClosedAdsCareerComponent,
            },
            {
                'path': 'era-app-versioning',
                'component': StgEraAppVersioningComponent,
            },
            {
                'path': 'faq-management',
                'component': FaqComponent,
            },
            {
                'path': 'ques',
                'component': quesComponent,
            },
            {
                'path': 'simulate-user-account',
                'component': StgSimulateUserAccountComponent,
            },
            {
                'path': 'cal-level-two',
                'component': CalLevelTwoComponent,
            },
            {
                'path': 'view-team',
                'component': ViewTeamComponent,
            },
            {
                'path': 'tc-report',
                'component': TCReportComponent,
            },
            {
                'path': 'tcm',
                'component': TCMComponent,
            }
        ],
    },


];

@NgModule({
    imports: [
        RouterModule.forChild(heroesRoutes), LayoutModule
    ],
    exports: [
        RouterModule
    ]
})
export class SettingsRoutingModule { }
