import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
// import { Helpers } from '../../../helpers'; 
import { NavVars } from './aside-nav-vars';
import { Router } from "@angular/router";
import { GlobalVariable} from "../../../../environments/environment";

declare let mLayout: any;
@Component({
    selector: "app-aside-nav",
    templateUrl: "./aside-nav.component.html",
    styleUrls: ['aside-nav.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class AsideNavComponent implements OnInit, AfterViewInit {
    isAdmin = false;
    isEngage = false;
    isRPM = false;
    // Dashboard
    jDashTtl = NavVars.jDashTtl;
    jDashHappTtl = NavVars.jDashHappTtl;
    rIndex;
    rIndexHappy;
    user_mngt;
    track;
    enBroadcast;

    // Job Profile - all can view
    jobProfShow = true;
    jProfHeader = NavVars.jProfHeader;
    jProfTtl = NavVars.jProfTtl;
    rProf = NavVars.rProf;
    jCareerAdvNew = NavVars.jCareerAdvNew;
    rAdvCareerProd = NavVars.rAdvCareerProd;

    //interview
    ivSesShow = false;
    ivTtl = NavVars.ivTtl;
    ivDash = NavVars.ivDash;
    rIvDash = NavVars.rIvDash;
    ivReport = NavVars.ivReport;
    rIvReport = NavVars.rIvReport;
    ivRepShow = false;
    ivDsShow = false;
    ivPanelShow = false;
    ivPanel = NavVars.ivPanel;
    rIvPanel = NavVars.rIvPanel;
    ivSessionShow=false;
    ivSession=NavVars.ivSession;
    rIvS = NavVars.rIvS;
    ivSessionMgmtShow=false;
    ivSessionMgmt=NavVars.ivSessionMgmt;
    rIvSM = NavVars.rIvSM;
    nePromoIVShow = false;
    nePromoIvTtl = NavVars.nePromoIvTtl;
    rnePromoIV = NavVars.rnePromoIV;

    //VRP
    vrpTitleShow = false;
    vrpBatchesShow = false;
    vrpTrackingShow = false;
    vrpTitle = NavVars.vrpTitle;
    vrpBatch = NavVars.vrpBatch;
    rVrpBatch = NavVars.rVrpBatch;
    vrpTracking = NavVars.vrpTracking;
    rVrpTracking = NavVars.rVrpTracking;

    newsTitleShow = false;
    newsMainShow = false;
    newsTitle = NavVars.newsTitle;
    newsMain = NavVars.newsMain;
    rNewsMain = NavVars.rNewsMain;   

    // Job Advertisement
    jobAdvShow = false;
    jAdvTtl = NavVars.jAdvTtl;
    trackTtl = NavVars.trackTtl;
    jAdvNew = NavVars.jAdvNew;
    jAdvNewShow = false;
    rAdvProd = NavVars.rAdvProd;
    jAdvPend = NavVars.jAdvPend;
    jAdvPendShow = false;
    rAdvPend = NavVars.rAdvPend;
    jAdvTrack = NavVars.jAdvTrack;
    jAdvTrackShow = false;
    rAdvTrack = NavVars.rAdvTrack;
    careerTM = NavVars.careerTM;
    rCareer = NavVars.rCareer;
    jCareerTMShow = false;
    internship = NavVars.internship;
    rInternship = NavVars.rInternship;
    idpBatches = NavVars.idpBatches;
    rIDP = NavVars.rIDP;
    tc = NavVars.tc;
    calibration = NavVars.calibration;
    rcalibration = NavVars.rcalibration;
    tcm = NavVars.tcm;
    rtcm = NavVars.rtcm;
    report = NavVars.report;
    reportTc = NavVars.reportTc;
    tcsession = NavVars.tcsession;
    rTCSession = NavVars.rTCSession;
    tcques = NavVars.tcques;
    rTCques = NavVars.rTCques;
    IDP = NavVars.idp;
    rsearchIDP = NavVars.rSearchIDP;
    sp = NavVars.sp;
    spsession = NavVars.spsession;
    rSPSession = NavVars.rSPSession;
    sptracking = NavVars.sptracking;
    rSPtracking = NavVars.rSPtracking;
    spreport = NavVars.spreport;
    rSPreport = NavVars.rSPreport;
    spdashboard = NavVars.spdashboard;
    rSPdashboard = NavVars.rSPdashboard;
    recruitmt = NavVars.recruitmt;
    sprecruitmt = NavVars.sprecruitmt;
    rsprecruitmt = NavVars.rsprecruitmt;

    rNePromo = NavVars.rNePromo;
    nePromo = NavVars.nePromo;
    nePromoShow = false;


    showIDPTrack = false;
    showIDPBatch = false;
    showTC = false;
    showSP = false;
    showSPS = false;
    showTCMGMT = false;
    showRecrtmt = false;
    showMapsNE = false;
    hideMainDash = false;
    showEVL = false;
    showDocEVL = false;
    //MAPSNE

    mapsneHeader = NavVars.mapsneHeader;
    mapsNESession = NavVars.mapsNESession;

    rIndexMapsAdmLnk = NavVars.rIndexMapsAdmLnk;
    rMapsNESessionAdmLnk = NavVars.rMapsNESessionAdmLnk;
    rMapsNETrackingAdmLnk = NavVars.rMapsNETrackingAdmLnk;

    mapsNETracking = NavVars.mapsNETracking;

    //EVL

    eVLHeader = NavVars.eVLHeader;
    rEVLTrackingAdmLnk = NavVars.rEVLTrackingAdmLnk;
    eVLTracking = NavVars.eVLTracking;

    rEVLDocEndAdmLnk = NavVars.rEVLDocEndAdmLnk;
    eVLDocEnd = NavVars.eVLDocEnd;
    
    searchShow = false;
    searchTalent = NavVars.searchTalent;
    rSearch = NavVars.rSearch;

    searchTalentNew = NavVars.searchTalentNew;
    rTalentSearch = NavVars.rTalentSearch;

    userRole: string;

    //user
    jMyProfile = NavVars.jMyProfile;
    rProfile = NavVars.rProfile;
    exorTitle = NavVars.exorTitle;
    rExor = NavVars.rExor;
    exorShow = false;
    rJobs = NavVars.rJobs;
    jobsTitle = NavVars.jobsTitle;

    env = GlobalVariable.ENV_NAME;

    constructor(private _router: Router) {
        this.verifyadmin();
    }

    env_prod = false;
    showSetting = false;
    adminFeedbacks;
    enAdmin = false; enUser = false;
    ngOnInit() {
       
        if(this.env === 'prod'){
            this.env_prod = true;
            // this.adminFeedbacks = '/admin/settings/feedbacks';
            this.adminFeedbacks = '/admin/settings/feedbacks_dev';
         }
        else{
            this.env_prod = false;
            this.adminFeedbacks = '/admin/settings/feedbacks_dev';
        }

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
         
        if(currentUser.isEngagement == true){
            this.isEngage = true;
            if(currentUser.engagement_role === '2'){
                this.enUser = true;
            }
                    
            else {
                this.enAdmin = true;
            }
        }

        if(currentUser.job_role == '10'){
            this.showMapsNE = true;
            this.jobProfShow = false; //hide Job Profile
            this.hideMainDash = true;
            this.rIndex = "/admin/maps";
        }      
        

        if(currentUser.job_role == '9'){
            this.isRPM = true;
            this.showMapsNE = true;
            this.jobProfShow = false; //hide Job Profile
            this.hideMainDash = true;
            this.rIndex = "/admin/maps";
        }

        if(currentUser.job_role == '8'){
            this.jobProfShow = false; //hide Job Profile
            this.hideMainDash = true;
         }
                    
        let usrLoginLvl = currentUser.userlevel;
        if (usrLoginLvl >= 100) {
            this.showSetting = true;
        }
        this.userRole = currentUser.job_role;
        if (this.userRole) {
            let roleArr = this.userRole.split(",");
            for (let i = 0; i < roleArr.length; i++) {
                if (roleArr[i] === '1' || roleArr[i] === '2' || roleArr[i] === '3' || roleArr[i] === '5') {
                    this.jAdvTrackShow = true;
                    this.jCareerTMShow = true;
                }
                if (roleArr[i] === '2' || roleArr[i] === '5') {
                    this.jAdvPendShow = true;
                }

                if (roleArr[i] === '2' || roleArr[i] === '3') {
                    this.ivSesShow = true;
                    this.ivDsShow = true;
                    this.ivPanelShow= true;
                    this.ivSessionMgmtShow = true;
                    this.ivRepShow = true;
                    this.nePromoIVShow = true;
                }

                if (roleArr[i] === '1' || roleArr[i] === '5') {
                    this.ivSesShow = true;
                    this.ivDsShow = true;
                    this.ivPanelShow= true;
                    this.ivSessionShow = true;
                    this.ivSessionMgmtShow = true;
                    this.ivRepShow = true;
                    this.nePromoIVShow = true;

                    this.vrpTitleShow = true;
                    // this.vrpBatchesShow = true;
                    //this.vrpTrackingShow = true;
                }

                //admin or vrp hcbo
                if (roleArr[i] === '1' || roleArr[i] === '11') {

                    this.vrpTitleShow = true;
                    this.vrpBatchesShow = true;
                    this.vrpTrackingShow = true;
                }


                //hcbd aka editor
                if (roleArr[i] === '4') {

                    this.vrpTitleShow = true;
                    this.vrpTrackingShow = true;
                }

                if (roleArr[i] === '3') {
                    this.jAdvNewShow = true; this.exorShow = true; this.nePromoShow = true; this.jobAdvShow = true;
                    this.nePromoIVShow = true;
                }

                if(roleArr[i] === '1' || roleArr[i] === '4' || roleArr[i] === '6'){
                    this.searchShow = true;
                }
                if(roleArr[i] === '6') {

                    this.showIDPTrack = true;
                    this.showIDPBatch = true;
                    this.showSP = true;
                    this.showSPS = true;
                    this.showTC = true;
                    this.showTCMGMT = true;

                }

                if(roleArr[i] === '7') {
                    this.showSP = true;
                    this.showTC = true;
                    this.showIDPTrack = true;
                }

                if(roleArr[i] === '8') {
                    this.showRecrtmt = true;
                    this.ivSesShow = true;
                    this.ivPanelShow= true;        
                }
                
                if(roleArr[i] === '9') {
                    this.isRPM = true;
                    this.showMapsNE = true;     
                }

                if(roleArr[i] === '10') {
                    this.showMapsNE = true;     
                }   

                if(roleArr[i] === '12') {
                    this.newsTitleShow = true;
                    this.newsMainShow = true;  
                }
                
                // if(roleArr[i] === '13') {
                //     this.showSP = true;
                // }

                if(roleArr[i] === '15') {

                    this.showEVL = true;
                    this.showDocEVL = false;
                }

                if(roleArr[i] === '16') {

                    this.showEVL = true;

                }

                if(roleArr[i] === '17') {

                    this.showDocEVL = true;
                }

            }

            //if(this.env_prod === true){
            //    this.showMapsNE = false;
            //}

            if (  
                (!/1/i.test(this.userRole)) && (!/2/i.test(this.userRole)) && (!/3/i.test(this.userRole)) && 
                (!/4/i.test(this.userRole)) && (!/5/i.test(this.userRole)) && (!/6/i.test(this.userRole)) && 
                (!/7/i.test(this.userRole)) && (!/8/i.test(this.userRole)) && (!/9/i.test(this.userRole)) && 
                (!/10/i.test(this.userRole)) && (!/11/i.test(this.userRole))&& (!/12/i.test(this.userRole)) && 
                (!/13/i.test(this.userRole))
            ) {
                // console.log("Normal");
            } 
            else {
                if (currentUser.isAdmin == true)
                    this.isAdmin = true;
                else
                    this.isAdmin = false;            
            }

        }

        if(this.isAdmin == true){
            this.rIndex = "/admin" + NavVars.rIndex;
        }
        else if(this.isEngage == true){
            this.jobProfShow = false; //hide Job Profile for Engagement
            this.rIndex = "/engage/index";
            this.rIndexHappy = "/engage/index_happy";
            this.user_mngt = "/engage/user-mngt";
            this.track = "/engage/track";
            this.enBroadcast = "/engage/broadcast";
        }
        
    }

    ngAfterViewInit() {
        mLayout.initAside();
    }

    verifyadmin() {
        if (this.isAdmin) {
            let usrLoginLvl = JSON.parse(localStorage.getItem('currentUser'));
            if ((!usrLoginLvl) || (usrLoginLvl.job_role == null)) {
                this.redirect('/unauthorized');
            }
        }
    }

    redirect(myUrl) {
        this._router.navigate([myUrl]);
    }
}
