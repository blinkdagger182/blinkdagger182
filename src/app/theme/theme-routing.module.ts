import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/_guards/auth.guard';

const routes: Routes = [
    /*
    ** :: start Admin
    */
    {
        'path': 'admin',
        'component': ThemeComponent,
        'canActivate': [AuthGuard],
        'children': [
            {
                'path': '',
                'loadChildren': '.\/pages\/admin\/default\/blank\/blank.module#BlankModule',
            },
            {
                'path': 'index',
                'loadChildren': '.\/pages\/admin\/default\/blank\/blank.module#BlankModule',
            },
            {
                'path': 'profile',
                'loadChildren': '.\/pages\/admin\/profile\/profile.module#ProfileModule',
            },
            {
                'path': 'settings',
                'loadChildren': '.\/pages\/admin\/settings\/settings.module#SettingsModule',
            },
            {
                'path': 'dashboards',
                'loadChildren': '.\/pages\/admin\/dashboards\/dashboards.module#DashboardsModule',
            },
            {
                'path': 'faq',
                'loadChildren': '.\/pages\/admin\/faq\/faq.module#FaqModule',
            },
            // {
            //     'path': 'download-apps',
            //     'loadChildren': '.\/pages\/admin\/dwApps\/dwApps.module#dwAppsModule',
            // },
            {
                'path': 'job',
                'loadChildren': '.\/pages\/admin\/job\/default.module#ApptDefaultModule',
            },
            {
                'path': 'job\/profile',
                'loadChildren': '.\/pages\/admin\/job\/job-profile\/job-profile.module#JobProfileModule',
            },
            {
                'path': 'job\/profile\/search\/:term\/:lob',
                'loadChildren': '.\/pages\/admin\/job\/job-profile\/job-profile.module#JobProfileModule',
            },
            {
                'path': 'job\/profile\/detail\/:id',
                'loadChildren': '.\/pages\/admin\/job\/job-detail\/job-detail.module#JobDetailModule',
            },
            {
                'path': 'job\/advertisement\/profile',
                'loadChildren': '.\/pages\/admin\/job\/adv-profile\/adv-profile.module#AdvProfileModule',
            },
            {
                'path': 'job\/advertisement\/new-career',
                'loadChildren': '.\/pages\/admin\/job\/career-adv\/career-adv.module#CareerAdvModule',
            },
            {
                'path': 'job\/advertisement\/new-career\/create',
                'loadChildren': '.\/pages\/admin\/job\/career-adv-detail\/career-adv-detail.module#CareerAdvDetailModule',
            },
            {
                'path': 'job\/advertisement\/new-career\/detail\/:id',
                'loadChildren': '.\/pages\/admin\/job\/career-adv-detail\/career-adv-detail.module#CareerAdvDetailModule',
            },
            {
                'path': 'job\/advertisement\/new-career\/edit\/:id',
                'loadChildren': '.\/pages\/admin\/job\/career-adv-detail\/career-adv-detail.module#CareerAdvDetailModule',
            },
            {
                'path': 'job\/advertisement\/profile\/search\/:term\/:lob',
                'loadChildren': '.\/pages\/admin\/job\/adv-profile\/adv-profile.module#AdvProfileModule',
            },
            {
                'path': 'job\/advertisement\/profile\/detail\/:id',
                'loadChildren': '.\/pages\/admin\/job\/adv-detail\/adv-detail.module#AdvDetailModule',
            },
            {
                'path': 'job\/advertisement-tracking\/:type',
                'loadChildren': '.\/pages\/admin\/job\/job-advertisement-tracking\/job-advertisement-tracking.module#JobAdvertisementTrackingModule',
            },
            {
                'path': 'job\/career-tm\/:type',
                'loadChildren': '.\/pages\/admin\/job\/career-tm\/career-tm.module#CareerTMModule',
            },
            {
                'path': 'job\/career-tm\/detail\/:id',
                'loadChildren': '.\/pages\/admin\/job\/career-tm-detail\/career-tm-detail.module#CareerTMDetailModule',
            },
            { //internship
                'path': 'job\/internship\/:type',
                'loadChildren': '.\/pages\/admin\/job\/internship\/internship.module#InternshipModule',
            },
            { //idp batches
                'path': 'job\/idp-batches',
                'loadChildren': '.\/pages\/admin\/job\/idp-batches\/idp-batches.module#IdpBatchesModule',
            },
            { //idp batches create
                'path': 'job\/idp-batches\/create',
                'loadChildren': '.\/pages\/admin\/job\/idp-batches-detail\/idp-batches-detail.module#IdpBatchesDetailModule',
            },
            { //idp batches edit
                'path': 'job\/idp-batches\/edit\/:id',
                'loadChildren': '.\/pages\/admin\/job\/idp-batches-detail\/idp-batches-detail.module#IdpBatchesDetailModule',
            },
            { //tc-session
                'path': 'job\/tc-sessions',
                'loadChildren': '.\/pages\/admin\/job\/tc-sessions\/tc-sessions.module#TcSessionsModule',
            },
            { //idp
                'path': 'job\/idp\/:type',
                'loadChildren': '.\/pages\/admin\/job\/idp\/idp.module#idpModule',
            },
            {
                'path': 'job\/spsession',
                'loadChildren': '.\/pages\/admin\/job\/spsession\/spsession.module#SpsessionModule',
            },
            { //sp
                'path': 'job\/sptracking\/:type',
                'loadChildren': '.\/pages\/admin\/job\/sptracking\/sptracking.module#sptrackingModule',
            },
            { //sp
                'path': 'job\/spreporting\/:type',
                'loadChildren': '.\/pages\/admin\/job\/spreporting\/spreporting.module#spreportingModule',
            },
            { //sp
                'path': 'job\/spnomination\/:batchId\/:positionId',
                'loadChildren': '.\/pages\/admin\/job\/spnomination\/spnomination.module#SpnominationModule',
            },
            { //sp
                'path': 'job\/spdashboard\/:type',
                'loadChildren': '.\/pages\/admin\/job\/spdashboard\/spdashboard.module#spdashboardModule',
            },
            { //recruitment - interview
                'path': 'job\/recruitment',
                'loadChildren': '.\/pages\/admin\/job\/recruitment\/recruitment.module#recruitmentModule',
            },
            {
                'path': 'job\/:display-state\/detail\/:id',
                'loadChildren': '.\/pages\/admin\/job\/job-advertisement-detail\/job-advertisement-detail.module#JobAdvertisementDetailModule',
            },
            {
                'path': 'job\/pending-approval',
                'loadChildren': '.\/pages\/admin\/job\/job-pending-approval\/job-pending-approval.module#JobPendingApprovalModule',
            },
            { //Interview
                 'path': 'job\/iv-session',
               'loadChildren': '.\/pages\/admin\/job\/iv-session\/iv-session.module#IvSessionModule',
            },
            { //Interview
                'path': 'job\/iv-session-management',
              'loadChildren': '.\/pages\/admin\/job\/iv-session-management\/iv-session-management.module#IvSessionManagementModule',
            },
            { //Interview
                'path': 'job\/iv-report',
              'loadChildren': '.\/pages\/admin\/job\/iv-report\/iv-report.module#IvReportModule',
           },
            {
                'path': 'job\/iv-panel',
                'loadChildren': '.\/pages\/admin\/job\/iv-panel\/iv-panel.module#IvPanelModule',
            },
            {
                'path': 'job\/iv-dashboard',
                'loadChildren': '.\/pages\/admin\/job\/iv-dashboard\/iv-dashboard.module#ivdashboardModule',
            },
            {
                'path': 'job\/ne-interview\/:id',
                'loadChildren': '.\/pages\/admin\/job\/ne-interview\/ne-interview.module#NEInterviewModule',
            },
             {
                'path': 'job\/ne-interview',
                'loadChildren': '.\/pages\/admin\/job\/ne-interview\/ne-interview.module#NEInterviewModule',
            },
            {
                'path': 'unauthorized',
                'loadChildren': '.\/pages\/admin\/unauthorized\/unauthorized.module#AdminUnauthorizedModule',
            },
            {
                'path': 'unauthorized/:idx',
                'loadChildren': '.\/pages\/admin\/unauthorized\/unauthorized.module#AdminUnauthorizedModule',
            },
            {
                'path': 'job\/advertisement\/nePromo',
                'loadChildren': '.\/pages\/admin\/job\/ne-promo\/ne-promo.module#NEPromoModule',
            },
            {
                'path': 'job\/advertisement\/nePromo\/search\/:term\/:lob',
                'loadChildren': '.\/pages\/admin\/job\/ne-promo\/ne-promo.module#NEPromoModule',
            },
            {
                'path': 'job\/advertisement\/nePromo\/detail\/:id',
                'loadChildren': '.\/pages\/admin\/job\/ne-detail\/ne-detail.module#NEDetailModule',
            },
            {
                'path': 'notification',
                'loadChildren': '.\/pages\/admin\/notification\/notification.module#NotificationModule',
            },
            {
                'path': 'job\/project-tracking\/:type',
                'loadChildren': '.\/pages\/admin\/job\/project-tracking\/project-tracking.module#ProjectTrackingModule',
            },
            {
                'path': 'search\/:type',
                'loadChildren': '.\/pages\/admin\/search\/search.module#SearchModule',
            },
            {
                'path': 'talent-search\/:type',
                'loadChildren': '.\/pages\/admin\/talent-search\/search.module#SearchModule',
            },
            {
                'path': 'maps',
                'loadChildren': '.\/pages\/admin\/maps\/default\/blank\/blank.module#mapsBlankModule',
            },
            {
                'path': 'maps-cycle',
                'loadChildren': '.\/pages\/admin\/maps\/mapsne-session\/mapsne-session.module#mapsnesessionModule',
            },
            {
                'path': 'maps-tracking',
                'loadChildren': '.\/pages\/admin\/maps\/mapsne-tracking\/mapsne-tracking.module#MapsneTrackingModule',
            },
            {
                'path': 'vrp-tracking',
                'loadChildren': '.\/pages\/admin\/vrp-tracking\/vrp-tracking.module#VRPTrackingModule',
            },
            {
                'path': 'vrp-batches',
                'loadChildren': '.\/pages\/admin\/vrp-session\/vrp-session.module#VrpSessionModule',
            },
            {
                'path': 'hrc',
                'loadChildren': '.\/pages\/admin\/hrcomm\/hrcomm.module#HrCommModule',
            },
            { //evl
                'path': 'evl-tracking',
                'loadChildren': '.\/pages\/admin\/job\/evl-tracking\/evl-tracking.module#EVLetterModule',
            },
            { //endorsement
                'path': 'evl-endorsement',
                'loadChildren': '.\/pages\/admin\/job\/evl-endorsement\/evl-endorsement.module#EndorsementModule',
            },
        ],
    },
    /*** :end Admin ***/

    /*
    ** :: start User
    */
    {
        'path': '',
        'component': ThemeComponent,
        'canActivate': [AuthGuard],
        'children': [
            {
                'path': '',
                'loadChildren': '.\/pages\/user\/default\/blank\/blank.module#UserBlankModule',
            },
            {
                'path': 'index',
                'loadChildren': '.\/pages\/user\/default\/blank\/blank.module#UserBlankModule',
            },
            // commented temporarily
            {
                'path': 'assessment',
                'loadChildren': '.\/pages\/user\/assessment\/assessment.module#AssessmentModule',
            },
            {
                'path': 'profile',
                'loadChildren': '.\/pages\/user\/profile\/profile.module#UserProfileModule',
            },
          
            {
                'path': 'extraordinaire',
                'loadChildren': '.\/pages\/user\/extraordinaire\/extraordinaire.module#ExtraordinaireModule',
            },
            /*{
                'path': 'extraordinaire\/detail\/:id',
                'loadChildren': '.\/pages\/user\/extraordinaire\/details\/details.module#ExOrDetailsModule',
            },*/
            {
                'path': 'unauthorized',
                'loadChildren': '.\/pages\/user\/unauthorized-module\/unauthorized.module#UserUnauthorizedPageModule',
            },
            {
                'path': 'unauthorized/:idx',
                'loadChildren': '.\/pages\/user\/unauthorized-module\/unauthorized.module#UserUnauthorizedPageModule',
            },
            {
                'path': 'faq',
                'loadChildren': '.\/pages\/user\/faq\/faq.module#FaqModule',
            },
            {
                'path': 'user-job',
                'loadChildren': '.\/pages\/user\/user-job\/user-job.module#UserJobModule',
            },
            {
                'path': 'other-profile/:idx',
                'loadChildren': '.\/pages\/user\/other-profile\/other.module#OtherProfileModule',
            },
            // {
            //     'path': 'download-apps',
            //     'loadChildren': '.\/pages\/user\/dwApps\/dwApps.module#dwAppsModule',
            // },
            {
                'path': 'circle',
                'loadChildren': '.\/pages\/user\/circle\/circle.module#circleModule',
            },
            {
                'path': 'circle\/:friendID',
                'loadChildren': '.\/pages\/user\/circle\/circle.module#circleModule',
            },
            {
                'path': 'notifications',
                'loadChildren': '.\/pages\/user\/notifications\/notifications.module#NotificationsModule',
            },
          
            // {
            //     'path': 'happy-meter',
            //     'loadChildren': '.\/pages\/user\/happy-meter\/meter\/meter.module#MeterModule',
            // },
            {
                'path': 'happy-meter',
                'loadChildren': '.\/pages\/user\/happy-meter\/feel\/feel.module#FeelModule',
            },
            {
                'path': 'meter-feel/:idx',
                'loadChildren': '.\/pages\/user\/happy-meter\/meter-feel\/meter-feel.module#MeterFeelModule',
            },
            {
                'path': 'feel-thank/:idx',
                'loadChildren': '.\/pages\/user\/happy-meter\/feel-thank\/feel-thank.module#FeelThankModule',
            },
              

            //IDP Module
            {
                'path': 'idp',
                'loadChildren': '.\/pages\/user\/idp\/idp.module#IDPModule',
            },

            //Talent Classification 
            // {
            //     'path': 'talent',
            //     'loadChildren': '.\/pages\/user\/talent\/talent.module#TalentModule',
            // },
            //Succession Depth
            {
                'path': 'nomination',
                'loadChildren': '.\/pages\/user\/nomination\/nomination.module#nominationModule',
            },
            //ask us
            {
                'path': 'ask-us',
                'loadChildren': '.\/pages\/user\/ask-us\/ask-us.module#AskUsModule',
            },
            //maps
            {
                'path': 'maps',
                'loadChildren': '.\/pages\/user\/maps\/maps.module#MapsModule',
            },
            //features
            {
                'path': 'features',
                'loadChildren': '.\/pages\/user\/features\/features.module#FeaturesModule',
            },
            //VRP MESRA 2021 module
            {
                'path': 'vrp',
                'loadChildren': '.\/pages\/user\/vrp\/vrp.module#vrpModule',
            },
            //MESRA 2.0 2021 vsp module 20210705
            {
                'path': 'vsp',
                'loadChildren': '.\/pages\/user\/vsp\/vsp.module#vspModule',
            },
            //Annoucement Module 20210603
            {
                'path': 'annoucement',
                'loadChildren': '.\/pages\/user\/annoucement\/annoucement.module#annoucementModule',
            },            
            //e-Letter Module 20210813
            {
                'path': 'e-letter',
                'loadChildren': '.\/pages\/user\/e-letter\/e-letter.module#ELetterModule',
            },    

        ],
    },
    /*** :end User ***/

    /*
    ** :: start Engagement
    */

    {
        'path': 'engage',
        'component': ThemeComponent,
        'canActivate': [AuthGuard],
        'children': [
            {
                'path': '',
                'loadChildren': '.\/pages\/engage\/default\/blank\/blank.module#EngageBlankModule',
            },
            {
                'path': 'index_happy',
                'loadChildren': '.\/pages\/engage\/default\/blank_happy\/blank_happy.module#EngageBlankHappyModule',
            },
            {
                'path': 'index',
                'loadChildren': '.\/pages\/engage\/default\/blank\/blank.module#EngageBlankModule',                
            },
            {
                'path': 'profile',
                'loadChildren': '.\/pages\/engage\/profile\/profile.module#EngageProfileModule',
            },
            {
                'path': 'track',
                'loadChildren': '.\/pages\/engage\/tracking\/tracking.module#EngageTrackingModule',
            },
            {
                'path': 'user-mngt',
                'loadChildren': '.\/pages\/engage\/user-mngt\/user-mngt.module#UserMngtModule',
            },
            {
                'path': 'broadcast',
                'loadChildren': '.\/pages\/engage\/broadcast\/broadcast.module#EngageBroadcastModule',
            },
            {
                'path': 'unauthorized',
                'loadChildren': '.\/pages\/engage\/unauthorized\/unauthorized.module#EngageUnauthorizedPageModule',
            },
            {
                'path': 'unauthorized/:idx',
                'loadChildren': '.\/pages\/engage\/unauthorized\/unauthorized.module#EngageUnauthorizedPageModule',
            },
        ],
    },

    /*** :end Engagement ***/

    {
        'path': '**',
        'redirectTo': 'index',
        'pathMatch': 'full',
    },

    {
        'path': '**',
        'redirectTo': 'index',
        'pathMatch': 'full',
    },

    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ThemeRoutingModule { }