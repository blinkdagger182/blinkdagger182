import {
    ViewChild,
    ViewContainerRef, Component, ComponentFactoryResolver, OnInit, AfterViewInit, ViewEncapsulation, Injectable
} from '@angular/core';

import { Http, Headers, Response, RequestOptions, URLSearchParams } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { Router, Routes, RouterModule, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Qualification, quaArr, ComLvl, comLvlArr, ComCluster, comClusterArr, ComCat, comCatArr, ComCom, comComArr } from "./arrCons";
import { GlobalVariable } from "../../../../../../environments/environment";
//import { GlobalVariable } from '../../../../../../../ghcm-global';
import { JADVars } from './career-tm-detail-vars';
//import { IdleTimeoutService } from '../../../../_services/idleTimeout.service';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { POST_Service } from '../../../../api/post.service';
import { GET_Service } from '../../../../api/get.service';
import { DatePipe } from '@angular/common';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../../auth/_directives/alert.component';
import { ComVars } from '../../../user/user-job/comments/comments-vars';
import { JobsVars } from '../../../user/user-job/user-job-vars';
import { NotifierService } from 'angular-notifier';

import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';

import * as image2base64 from 'image-to-base64';
import { NonNullAssert } from '@angular/compiler';
import * as moment from 'moment';

import { PagerService } from '../shared/pager/pager.component';


pdfMake.vfs = pdfFonts.pdfMake.vfs;

declare let Dropzone: any;
declare var mWizard: any;
declare var thisPosId: any;
@Component({
    selector: 'app-career-tm-detail',
    templateUrl: './career-tm-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    // styleUrls: ['../job-css.css']
    styleUrls: ['../job-css.css']
})

@Injectable()
export class CareerTMDetailComponent implements OnInit, AfterViewInit {
    advApplDwBtn = JADVars.advApplDwBtn; downloadCSV = false; dwApplDisabled = true;
    dwApplAPI = JADVars.eraAdvApplicant; dwApplPagingAPI = JADVars.eraAdvApplicantPaging;
    ads = GlobalVariable.ADS;
    loading = true; btnGotoCareerProfile = JADVars.btnGotoCareerProfile; btnGotoJobProfile = JADVars.btnGotoJobProfile;
    myNextTodayDt = new Date(); myTodayDt = new Date(); myStartDt = new Date(); myEndDt = new Date();
    dataUpdPurpose: any = {};
    test: any;
    rJobProfDetails = JADVars.rJobProfDetailsCareer;
    // all data array
    data: {}; aor: {}; functional: {}; profile: {}; purpose: {}; info: {};
    qualification: {}; requirements: {}; success: {}; technical: {}; history: {};
    digital: {}; applicant: any; interviewee: {};
    jobAdvpostCloseAds = JADVars.jobAdvpostCloseAds;
    joblistcloseAdsAPI = JADVars.joblistcloseAdsAPI;

    // panel title
    title1 = JADVars.title1; title2 = JADVars.title2; title3 = JADVars.title3; title4 = JADVars.title4;
    title5 = JADVars.title5; title6 = JADVars.title6; title7 = JADVars.title7; title8 = JADVars.title8; title9 = JADVars.title9;

    // default error message
    noData = JADVars.noData;
    errNoData = JADVars.errNoData;
    errNoApplicant = JADVars.errNoApplicant; errNoIview = JADVars.errNoIview;

    // Action for iview list
    btnCallIview = JADVars.btnCallIview;
    aplcPanel = JADVars.showPanelApplList; // show or hide panel based on advertisement status
    aplcAct = JADVars.aplcAct; // choose applicant from list and also submit button (multiple choose)
    aplcSubmit = JADVars.aplcSubmit;
    aplcStatus = JADVars.aplcStatus;
    formSelAppl: FormGroup;

    // Action for Iview List
    btnAcceptForPosition = JADVars.btnAcceptForPosition;
    iviewPanel = JADVars.iviewPanel; // show or hide panel based on advertisement status
    iviewAct = JADVars.iviewAct; // choose applicant from list and also submit button (multiple choose)
    iviewSubmit = JADVars.iviewSubmit; // disable submit button if applicant selected <1
    iviewStatus = JADVars.iviewStatus;
    formSelIview: FormGroup;

    showPanelApplList = false; showPanelIviewList = false;
    btnApprove = false; btnReject = false; btnRevert = false; disableSubmitAdv = true;
    chooseApplicant = false; // hide action to choose applicant from list
    chooseSuccesIview = false; // hide action to choose successful interview applicant
    resubmitAdv = false; // hide resubmit action panel
    withdrawAdv = false; // withdraw at any stage
    closeAdv = false; // close at evaluate and interview stage

    advStatus = 0; // advertisement status
    advType = 0; // advertisement type
    openPanelIview = "collapse"; icoPanelIview = "collapsed";
    apprRemark = false; errAdvPeriod = false;
    idx: string;
    clickAct: string;
    pendApprForm: FormGroup;
    msgAdvPeriod = '';// 'Please select start date and end date';
    actAPIUrl: string;
    // actHCBD = JADVars.actApprHCBD;
    // actHCBO = JADVars.actApprHCBO;
    act = JADVars.actAppr;
    //actType = 0; // 1-HEADHCBD; 2:ADMINHCBO
    apprPosMsg: string; apprStyle: string; apprReq = false; dataAdvPos: any = {};// Message approval
    btnCloseAds = false;

    advExpDate = JADVars.advExpDate;
    advExceedDate = JADVars.advExceedDate;
    advErrMsg: string;
    advPeriod = false;
    userId;
    theDate;
    theTime;
    imgDataUrl;
    imgDataUrl2;

    vacancy;
    constVac;
    tVacancy = 0;
    limitVac;
    hData;
    tempB = 0;
    resVal = 1;
    resTF = false;
    optionRadio = false;
    optionCheckbox = false;
    //private apiUrl = GlobalVariable.BASE_API_URL;
    //private baseApiToken = GlobalVariable.API_KEY;
    //private token = '?api_key=' + this.baseApiToken;
    //private getJobDataAPI = this.apiUrl + JADVars.jobProfById + this.token;

    addComntForm = new FormGroup({
        newComnt: new FormControl()
    });

    editComntForm = new FormGroup({
        editComnt: new FormControl()
    });
    commentLoading2 = true;
    word: any;
    commentsData: any;
    imgAPIUrl = GlobalVariable.BASE_API_URL + ComVars.getImgAPI;

    pager: any = {};
    pagedItems: any[];
    pageSize = 100;

    private readonly notifier: NotifierService;

    @ViewChild('alertError',
        { read: ViewContainerRef }) alertError: ViewContainerRef;
    constructor(
        private routers: Router,
        private _GET_api_Service: GET_Service,
        private _POST_api_Service: POST_Service,
        private datePipe: DatePipe,
        private http: Http,
        private activeRoute: ActivatedRoute,
        private formBuilder: FormBuilder, private _script: ScriptLoaderService,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver,
        private pagerService: PagerService) 
    {

    }

    getJobDetail(idx) {
        let data = {
            id: idx //this.posId2
        }
        
        return this._POST_api_Service.POST_data(JADVars.jobProfById, data); //this.POSTMethodByAPI(this.getJobDataAPI, data);
    }

    errLoadData = JADVars.errLoadData;
    getJobDetailData(idx) {
        this.loading = true;

        // console.log("resTF value in top of getJobDetailData: " +this.resTF + " and resVal value is : " +this.resVal);
        if (this.resTF === true) {this.closeAdv = false; this.btnCloseAds = false; }

        this.getJobDetail(idx).subscribe(data => {

            this.data = data;
            this.hData = data;
            if (data.info.length == 0) {
                this.info = 'err';//=this.errNoData;
            } else {
                this.info = data.info;
                this.constVac = parseInt(data.profile[0].vacancies);
                this.vacancy = this.constVac;

                this.pendApprForm.setValue({
                    advId: idx,//data.profile[0].position_id,
                    advRemark: '',
                    //advStartDt: this.datePipe.transform(this.info[0].start, "MM-dd-yyyy"),
                    //advEndDt: this.datePipe.transform(this.info[0].close, "MM-dd-yyyy"),
                    advApprove: '',
                    // Datepicker v1 advDtRangeadvDtRange: this.datePipe.transform(this.info[0].start, "MM-dd-yyyy") + " to " +
                    //    this.datePipe.transform(this.info[0].close, "MM-dd-yyyy")
                    dtStart: this.datePipe.transform(this.info[0].start), dtEnd: this.datePipe.transform(this.info[0].close),
                });
                // this.myTodayDt = new Date(this.info[0].start);
                // this.myNextTodayDt = new Date(this.info[0].close);
                // this.myNextTodayDt.setDate(this.myNextTodayDt.getDate()+14);
                this.myStartDt = new Date(this.info[0].start); this.myEndDt = new Date(this.info[0].close);
                this.advStatus = this.info[0].status;
                this.advType = this.info[0].type;
                //this.setAllowedAction();

                this.advDateError = this.dateComparison(new Date(moment(this.myStartDt, 'DD/MM/YYYY').format('MM/DD/YYYY')),new Date (moment(this.myEndDt, 'DD/MM/YYYY').format('MM/DD/YYYY')), true);
                if(this.advDateError.isError){
                    this.advApprDateMsg = this.advDateError.errorMessage;
                    this.advApprDateStyle = " alert-danger ";
                } else {
                    this.advApprDateMsg = 'Date has been validate successfully';
                    this.advApprDateStyle = " alert-success ";
                }
            }
            if (data.profile.length == 0) {
                this.profile = 'err';
            } else {
                this.profile = data.profile;
                // PREVIOUS FLOW => only owenr can change => this.setAllowedAction(data.profile[0].isOwner, data.profile[0].status);
                let canChange = 0;
                if (data.info[0].sameLob == true) { canChange = 1; }
                this.setAllowedAction(canChange, data.profile[0].status);
                
                if(this.profile[0].source == 'era')
                    this.rJobProfDetails = JADVars.rJobProfDetailsERA;
            }
            if (data.purpose.length == 0) {
                this.purpose = 'err';//=this.errNoData;
            } else { this.purpose = data.purpose[0].job_purpose; }
            if (data.qualification.length == 0) {
                this.qualification = 'err';//=this.errNoData;
            } else { this.qualification = data.qualification; }
            if (data.functional.length == 0) {
                this.functional = 'err';//=this.errNoData;
            } else { this.functional = data.functional; }
            if (data.technical.length == 0) {
                this.technical = 'err';//=this.errNoData;
            } else { this.technical = data.technical; }
            if (data.success.length == 0) {
                this.success = 'err';//=this.errNoData;
            } else { this.success = data.success; }
            if (data.digital.length == 0) {
                this.digital = 'err';//=this.errNoData;
            } else { this.digital = data.digital; }
            if (data.aor.length == 0) {
                this.aor = 'err';//=this.errNoData;
            } else { this.aor = data.aor; }
            if (data.requirements.length == 0) {
                this.requirements = 'err';//=this.errNoData;
            } else { this.requirements = data.requirements; }
            if (data.history.length == 0) {
                this.history = 'err';//=this.errNoData;
            } else { this.history = data.history; }
            if (data.applicants.length == 0) {
                this.applicant = 'err';//=this.errNoData;
            } else {
                this.applicant = data.applicants;
                this.setPage(1);
                let cnApp = 0;
                for (let i = 0; i < data.applicants.length; i++) {
                    if (data.applicants[i].status == 10) cnApp++;
                }
                if (cnApp < 1) { this.chooseApplicant = false; this.aplcAct = false; }
            }
            if (data.interviewee.length == 0) {
                this.interviewee = 'err';//=this.errNoData;
            } else { this.interviewee = data.interviewee; this.openPanelIview = "show"; this.icoPanelIview = ""; }
        
            this.loading = false;
        },
        ror => {
                this.showAlert('alertError');
                this._alertService.error(this.errLoadData);
                this.loading = false;
            }
        )
    }
    pageNo = 1;
    pageNoStart = 0;
    setPage(page: number) {
        this.pageNo = page;
        this.pageNoStart = (page-1) * this.pageSize;
        // get pager object from service
        this.pager = this.pagerService.getPager(this.applicant.length, page, this.pageSize);
        // get current page of items
        this.pagedItems = this.applicant.slice(this.pager.startIndex, this.pager.endIndex + 1);
        this.callDwApplFunc();
    }

    perPageChange(val) {
        this.pageSize = parseInt(val);
        this.setPage(1);
    }
    
    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    applListData = [];
    fetching = false;
    timeOut = false;
    callDwApplFunc() {
        this.timeOut = false;
        this.fetching = true;
        this.dwApplDisabled = true;
        // let data = {
        //     adv_id: this.idx
        // }
        let data = {
            adv_id: this.idx,
            offset: (this.pageNo -1) * this.pageSize,
            limit: this.pageSize
        }
        //let updPosDescSend = this._POST_api_Service.POST_data(this.dwApplAPI, data);
        let updPosDescSend = this._POST_api_Service.POST_data(this.dwApplPagingAPI, data);

        let ret = updPosDescSend.subscribe(data => {
            this.applListData = data;
           
            this.dwApplDisabled = false;
            this.fetching = false;
        },
        error => {
            console.log('[ERROR - Download Applicant List] ' + error);
            this.dwApplDisabled = true;
            this.fetching = false;
            this.timeOut = true;
        })
    }

    ConvertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = ''; var row = "";
        

        for (var index in objArray[0]) {
            row += index + ',';//Now convert each value to string and comma-separated
        }
        row = row.slice(0, -1);
        //append Label row with line break
        str += row + '\r\n';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','
                line += '"' + array[i][index] + '"';
            }
            str += line + '\r\n';
        }
        return str;
    }

    download() {
        
        var csvData = this.ConvertToCSV(this.applListData);
        var a = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob([csvData], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        let todayDate = new Date();
        let dateToday = (todayDate.getFullYear() + '' + ((todayDate.getMonth() + 1)) + '' + todayDate.getDate() + '' + todayDate.getHours() + '' + todayDate.getMinutes() + '' + todayDate.getSeconds());
        a.download = 'ApplicantList_Adv' + this.idx + '_' + dateToday + '.csv';
        a.click();
        return 'success';
    }
    /** :end DOWNLOAD CSV  */

    ngOnInit() {

        this.idx = this.activeRoute.snapshot.paramMap.get('id');
        this.pendApprForm = new FormGroup({
            advId: new FormControl(null, Validators.required),
            advRemark: new FormControl(),
            //advStartDt: new FormControl(null, Validators.required),
            //advEndDt: new FormControl(null, Validators.required),
            advApprove: new FormControl(null, Validators.required),
            // datepicker v1 advDtRange: new FormControl(),
            dtStart: new FormControl(), dtEnd: new FormControl(),
        });

        this.resubmitForm = new FormGroup({
            advId: new FormControl(null, Validators.required),
            advRemark: new FormControl(),
            advResubmit: new FormControl(null, Validators.required),
            // datepicker v1 advDtRange: new FormControl(),
            dtStart: new FormControl(), dtEnd: new FormControl(),
        });

        this.formSelAppl = new FormGroup({
            //applAdvId: new FormControl(null, Validators.required),
            appl: new FormControl(null, Validators.required),
        });
        this.formSelIview = new FormGroup({
            iview: new FormControl(null, Validators.required),
        });

        this.applInfoForm = new FormGroup({
            applId: new FormControl(null, Validators.required),
            applType: new FormControl(null, Validators.required),
            applIndex: new FormControl(null, Validators.required),
        });

        this.getJobDetailData(this.idx);
        this.getCommentsData();
    }



    setAllowedAction(isOwner, advStatus) {
        let displayState = this.activeRoute.snapshot.paramMap.get('display-state');

        /*switch (displayState) {
            case 'advertisement-tracking':
                this.showPanelApplList = true; this.showPanelIviewList = true;
                this.btnApprove = false; this.btnReject = false;
                break;
            case 'pending-approval':
                this.showPanelApplList = false; this.showPanelIviewList = false;
                break;
        }*/

        // if ((displayState == 'advertisement-tracking') && (this.advStatus == 17) || (this.advStatus == 3) || (this.advStatus == 4) || (this.advStatus == 5) || (this.advStatus == 6) || (this.advStatus == 14) || (this.advStatus == 18)) {
        //     this.showPanelApplList = true; this.showPanelIviewList = true;
        //     this.btnApprove = false; this.btnReject = false; 
        // }
        // if ((displayState == 'advertisement-tracking') && (this.advStatus == 3) || (this.advStatus == 4)) {
        //     this.showPanelIviewList = false;
        // }

        if ((displayState == 'career-tm') && (this.advStatus == 17) || (this.advStatus == 3) || (this.advStatus == 4) || (this.advStatus == 5) || (this.advStatus == 6) || (this.advStatus == 14) || (this.advStatus == 18)) {
            this.showPanelApplList = true; this.showPanelIviewList = true;
            this.btnApprove = false; this.btnReject = false;
        }
        if ((displayState == 'career-tm') && (this.advStatus == 3) || (this.advStatus == 4)) {
            this.showPanelIviewList = false;
        }



        // :new Start
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser.job_role) {
            let roleArr = currentUser.job_role.split(",");
            for (let i = 0; i < roleArr.length; i++) {
                roleArr[i] = roleArr[i].trim();
            }

            //button
            if (roleArr.indexOf('2') >= 0) {
                if (this.advStatus == 1) {
                    if (this.advType == 1 || this.advType == 2) {
                        this.btnApprove = true; this.btnReject = true; this.btnRevert = true;
                    }
                }
            }
            //Head HCBD and advertise
            if (roleArr.indexOf('2') >= 0) {
                if (this.advStatus == 3) {
                    if (this.advType == 1 || this.advType == 2) {
                        if (this.resTF === true) {this.btnCloseAds = false; }
                        else if (this.resTF === false) {this.btnCloseAds = true};
                    }
                }
            }
            if (roleArr.indexOf('3') >= 0) {
                if (this.advStatus == 4 || this.advStatus == 5) {
                    if (this.advType == 1 || this.advType == 2) {
                        if (this.resTF === true) {this.closeAdv = false;}
                        else if (this.resTF === false) {this.closeAdv = true;}
                    }
                }
            }
            if (roleArr.indexOf('3') >= 0) {
                if (this.advStatus == 15 || this.advStatus == 16) {
                    if (this.advType == 1 || this.advType == 2 || this.advType == 3) {
                        this.withdrawAdv = true;
                    }
                }
            }
            if (roleArr.indexOf('5') >= 0) {
                if (this.advStatus == 2) {
                    if (this.advType == 3) {
                        this.btnApprove = true; this.btnReject = true; this.btnRevert = true;
                    }
                }
            }
            if (roleArr.indexOf('5') >= 0) {
                if (this.advStatus == 4 || this.advStatus == 5) {
                    if (this.advType == 3) {
                        if (this.resTF === true) {this.closeAdv = false; }
                        else if (this.resTF === false) {this.closeAdv = true};
                    }
                }
            }

            //display
            if (this.advStatus == 3 || this.advStatus == 4) {
                this.showPanelApplList = true;
            }
            if (this.advStatus == 5 || this.advStatus == 6 || this.advStatus == 18) {
                this.showPanelApplList = true; this.showPanelIviewList = true;
            }

            //control
            if (roleArr.indexOf('3') >= 0) {
                if (this.advStatus == 4) {
                    if (this.advType == 1 || this.advType == 2) {
                        this.chooseApplicant = true; this.aplcAct = true;
                    }
                }
            }
            if (roleArr.indexOf('3') >= 0) {
                if (this.advStatus == 5) {
                    if (this.advType == 1 || this.advType == 2) {
                        this.chooseApplicant = true; this.aplcAct = true; this.iviewAct = true;
                    }
                }
            }
            if (roleArr.indexOf('5') >= 0) {
                if (this.advStatus == 4) {
                    if (this.advType == 3) {
                        this.chooseApplicant = true; this.aplcAct = true;
                    }
                }
            }
            if (roleArr.indexOf('5') >= 0) {
                if (this.advStatus == 5) {
                    if (this.advType == 3) {
                        this.chooseApplicant = true; this.aplcAct = true; this.iviewAct = true;
                    }
                }
            }

            this.actAPIUrl = this.act;
        }
        if (this.info[0].type === 3) {
            this.btnRevert = false;
        }

    }

    // setcheckAdvPeriod() {
    //     this.advPeriodadvPeriod = true;
    // }
    showErrMsg = false;
    setApprove(act) {
        if (act == '1') {
            this.clickAct = 'Approve';
            this.apprRemark = false; //this.showErrMsg=true;
            let st = new Date(this.info[0].start);// new Date(this.datePipe.transform(this.info[0].start, "full"));
            let ed = new Date(this.info[0].close);// new Date(this.datePipe.transform(this.info[0].close, "full"));
            let dtErr = this.dateComparison(st, ed, false);
            if (dtErr.isError == false) {
                this.advPeriod = true; this.showErrMsg = false;
            } else {
                this.advPeriod = false; this.showErrMsg = true; this.advErrMsg = dtErr.errorMessage;
            }
            this.checkIsOccupied();
        } else if (act == '2') {
            this.clickAct = 'Reject';
            this.apprRemark = true; this.advPeriod = true; this.showErrMsg = false;
        } else if (act == '3') {
            this.clickAct = 'Revert';
            this.apprRemark = true; this.advPeriod = true; this.showErrMsg = false;
        }
        this.pendApprForm.setValue(
            {
                advId: this.idx,
                advRemark: '',
                // advStartDt: this.datePipe.transform(this.info[0].start, "MM-dd-yyyy"),
                // advEndDt: this.datePipe.transform(this.info[0].close, "MM-dd-yyyy"),
                advApprove: act,
                // datepicker v1 advDtRange: this.datePipe.transform(this.info[0].start, "MM-dd-yyyy") + " to " +
                //    this.datePipe.transform(this.info[0].close, "MM-dd-yyyy")
                //dtStart: this.datePipe.transform(this.info[0].start), dtEnd: this.datePipe.transform(this.info[0].close),
                dtStart: this.info[0].start, dtEnd: this.info[0].close,
            });

    }

    setCloseAds

    advErrMsg2: string;
    checkIsOccupied() {
        if (this.profile && this.profile[0].Occupied == 1) {
            this.showErrMsg = true;
            this.advErrMsg2 = JADVars.advIsOccupied;
        }
    }

    ngAfterViewInit() {
        this._script.loadScripts('app-career-tm-detail',
            [
                'assets/js/jobs/job-details-form.js',
                'assets/js/jobs/job-adv-details-alert.js',
                'assets/js/superadmin/close-ads-headHcbd.js',

            ]);
        Dropzone._autoDiscoverFunction();
    }

    advApprDateStyle: string;
    advApprDateMsg: string;

    pendApprFormTriggerSubmit() {
        if (!this.advDateError.isError) {
            $("#appr_close_modal").trigger("click");
            $("#btnApprRevDec").trigger("click");
        }
    }

    pendApprFormFormSubmit() {
        if (!this.advDateError.isError) {
            let advStartDt = ((document.getElementById("startDate2") as HTMLInputElement).value);
            let advEndDt = ((document.getElementById("endDate2") as HTMLInputElement).value);

            let advId = this.pendApprForm.get('advId').value;
            let advRemark = this.pendApprForm.get('advRemark').value;
            let advApprove = this.pendApprForm.get('advApprove').value;

            if (advRemark == '') {
                this.apprPosMsg = 'Fail to perform request. Please insert remarks'; //this.dataAdvPos.msg
                this.apprStyle = ' alert-danger  ';
                this.apprReq = true;
            } else {
                let apprData = {
                    'id': advId,
                    'start': advStartDt,
                    'close': advEndDt,
                    'remark': advRemark,
                    'approve': advApprove
                }
                let generalMsg = "";
                if (advApprove == '1') {
                    generalMsg = 'Approved.'
                } else if (advApprove == '2') {
                    generalMsg = 'Rejected.'
                } else if (advApprove == '3') {
                    generalMsg = 'Reverted.'
                }
                let apprSend = this._POST_api_Service.POST_data(this.actAPIUrl, apprData);
                let ret = apprSend.subscribe(dataQuaRes => {
                    this.dataAdvPos = dataQuaRes;
                    console.log(' this.dataAdvPos',  this.dataAdvPos)
                    if (this.dataAdvPos && this.dataAdvPos.status == "OK") {
                        this.apprPosMsg = 'Advertisement Request has been ' + generalMsg;
                        //this.apprPosMsg += " [<a href=\"#\">Click Here</a>] to go now.";
                        this.apprStyle = ' alert-success ';
                        this.btnApprove = false; this.btnReject = false; this.btnRevert = false;
                        this.apprReq = true;
                        setTimeout(function () {
                            this.apprReq = false;
                            this.routers.navigate(['admin/job/pending-approval']);
                        }.bind(this), 3000); //wait 3 Seconds and hide
                    } else {
                        this.apprPosMsg = 'Fail to perform request.'; //this.dataAdvPos.msg
                        this.apprStyle = ' alert-danger  ';
                        this.apprReq = true;
                    }
                },
                    error => {
                        console.log('[ERROR] Job Profile: ' + generalMsg + ' - ' + error);
                        this.apprPosMsg = 'Fail to perform request. Please contact your administrator.'; //this.dataAdvPos.msg
                        this.apprStyle = ' alert-danger  ';
                        this.apprReq = true; this.btnApprove = false; this.btnReject = false; this.btnRevert = false;
                    })
            }
        }
    }

    checkedList = [];
    onCheckboxChange(option, event) {
        if (event.target.checked) {
            this.checkedList.push(option.id);
        } else {
            for (var i = 0; i < this.checkedList.length; i++) {
                if (this.checkedList[i] == option.id) {
                    this.checkedList.splice(i, 1);
                }
            }
        }
        this.countCheckbox();
    }





    /** START: SELECT APPLICANT FOR INTERVIEW */
    applInfoForm: FormGroup;
    applName: string;
    applSelType: string;
    applId: string; applStatus: string;
    applIndex: string;
    applLoading: boolean;
    applProfile: object;
    eraUserProfile: object;
    eraUserEdu: object;
    eraUserExp: object;
    eraJobApply: object;
    applHistory: object;
    jobsApply: object;
    applDownloadFlag: boolean;
    applResumeFlag = true;
    eraResumeFlag = true;
    opnApplType: string;

    // Content for PDF
    titlePdf: String;
    docDefinition;
    resumeUrl;
    eraResumeUrl;
    openApplicantInfo(type, applId, applIndex, appStt) {


        this.applStatus = appStt; this.opnApplType = type;
        // Remarks: We use applId because it shows the actual index of the user being call
        let data = {
            id: applId
        };
        let applDetailsSend = this._POST_api_Service.POST_data(JADVars.getApplicantDetailsAPI, data);
        let eraUserDetailsSend = this._POST_api_Service.POST_data(JADVars.getEraUserDetailsAPI, data);
        // Activate the loading icon
        //this.applInfoForm.setValue ({applId: applId, applIndex: applIndex, applType: type});
        this.applLoading = true;
        this.applName = `Applicant Information - ${applId}`;
        this.applDownloadFlag = true;


       
      

        /*afdzal get eraUserDetail*/

        let resERAuser = eraUserDetailsSend.subscribe(dataQuaRes => {
            this.eraResumeFlag = true;
            // Try to get more information about the requestor from localStorage 
            try {
                this.userId = JSON.parse(localStorage.getItem('currentUser')).userid;
            } catch (e) {
                console.error("Failed to get localStorage for currentUser");
            }
            this.theDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy h:mm a');



            
            this.eraUserProfile = dataQuaRes.persdata[0];
            this.eraUserEdu = dataQuaRes.edu;
            this.eraUserExp = dataQuaRes.workExp;
            this.eraJobApply = dataQuaRes.jobsApplied;



            //let theUrl = `${JADVars.getProfilePictureAPI}/${dataQuaRes.persdata[0].photo_url}`;
            //let theUrl = `${dataQuaRes.persdata[0].upload_photo_loc}`;
            let theUrl = `${dataQuaRes.persdata[0].photo_url}`;

            // uploaded photo
            
            let profilePictureSend = this._GET_api_Service.GET_PictureByUrl(theUrl);
           
            profilePictureSend.subscribe(pictureResults => {
                this.imgDataUrl = '';
                 let profilePictureBase64 = this._GET_api_Service.GET_Base64(pictureResults);
                profilePictureBase64.subscribe(myData => {
                    this.imgDataUrl = myData;
                });
            }, () => {
                this.imgDataUrl = 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCACCAGQDASIAAhEBAxEB/8QAGwABAAIDAQEAAAAAAAAAAAAAAAUGAQMEAgj/xAAzEAACAQMCAgkDAQkAAAAAAAAAAQIDBBESMQUhBhMVQVFhZKPhFCJxNSMyQnOBgrGy0f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD7LAAAAAAG8Bc0ABrqVqVPHWVIQztqkke4yUkmuae2AMgIAAAAAAAAAHsaq9aFGm6k5KKXibXsV3pBdxq1lbww1TfOXn4AeL3i9xcZjT/ZQ8nzf9SPnKU5OU5SlJ97eWYAGMG2hXrW+XRqSh+NjWAJu041CNKEK8ZOp/FLCxv/AMJmlONSnGcXmMllPxKWSXArvqbjqZyeifKOZYUQLIAAAAAAAA9ir8eVNcSno3wnL84LPOWmEpPuWSnXdZ17qpWw1rlnDewGsAAAAAMweJxaaWGubMAC50akalKM4yUk1utmezk4VFQsKKUnJaU8vzOsAAAAAA5+J/p9x/Lf+Colm47WdKwko7zej8LvKyAAAAAADNNKVSMXs2kYOnhdOVXiFGKjqxJSfhhbgWulThSpxhBYjFYSPQAAAAAABEdJot21KXdGeGQBaeM2/X2E1qacPvSS3x3FWAAAAAABL9G6LdWdxn7UtGMbtkTThKpVjCCzKTwi3WVvG2toUo9278WBvAAAAAAABiaTi09mioX9BW97UorZPl+HzLg8YIDpLGmqtKSkusaw15dwEQAAAAAlejdOErqpUksyhH7fLJYVsVzo7V0XkqWM9ZHfO2CxLYDIAAAAAcl9xC3tVJSmnUS/cW7Osq3Hf1Wt/b/qgNlbjN1OadOMacc7b5/JwVatStUc6knKT72zyAAAAAADMZSjJSi2muaZP8N4tSqU4wuZaKi5Z7pFfMY55Au2UZKtacUureDhqVSPdry8Fjsa6ubWFeKaUs8n5PAG4AACLv8AhH1V1Ov9Ro1Y5aM4wseJKACE7A9X7fyOwPV+38k2AITsD1ft/I7A9X7fyTYAhOwPV+38jsD1ft/JNgCE7A9X7fyOwPV+38k2AITsD1ft/JKWFv8AS2sKGvXpz92MZy8m8AAAAAAAAAAAAAAAAAAAAAAH/9k=';
            });
            this.eraResumeUrl = '';

            try{
            this.eraResumeUrl = dataQuaRes.resume[0].r_url;
            }catch (e) {};

            

            if (this.eraResumeUrl) {
                this.eraResumeFlag = false;
            }

           


            this.applName = `Applicant Information - ${dataQuaRes.persdata[0].full_name}`;
            this.applSelType = type;
            this.applId = applId;
            this.applIndex = applIndex;
            this.applLoading = false;
            this.applInfoForm.setValue({ applId: applId, applIndex: applIndex, applType: type });


            /*** GETTING PDF */    


            // Set the title
           // Set the title
           this.titlePdf = `Career Profile_${dataQuaRes.persdata[0].user_id}.pdf`;       
           //alert("loading 1");
           setTimeout(() => {

               let user = this.userId;
               
               let profile_img = this.imgDataUrl;

              // let profile_img2 = this.imgDataUrl2;

               
               let bdtStr = this.datePipe.transform (dataQuaRes.persdata[0].birth_date ,"dd-MMM-yyyy" );
               this.docDefinition = {
                   pageSize: 'A4',
                   pageMargins: [20, 90],
                   watermark: { text: `By: ${this.userId}@${this.theDate}`, color: '#e0e0d1', opacity: 0.3, bold: true },
                   background: function (page) {
                       if (page !== 1) {
                           return [
                               {
                                   columns: [
                                       {
                                           width: 175,
                                           alignment: 'center',
                                           table: {
                                               width: ['auto'],
                                               body: [
                                                   [{ image: profile_img, width: 95, height: 95 }],
                                                   [{ text: `\n` }],

                                      
                                                   [{ text: `${dataQuaRes.persdata[0].full_name}`, style: 'profile_name' }],
                                                   [{ text: `${dataQuaRes.persdata[0].u_email}`, style: 'greySize10' }],
                                                  // [{ text: `${dataQuaRes.profile[0].Post_Desc}`, style: 'blackSize10' }],
                                                  // [{ text: `${dataQuaRes.profile[0].Company_Desc}`, style: 'blackSize10' }],
                                                  //[{ columns: [{ text: 'Pers. No ', style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${dataQuaRes.profile[0].Pers_no}`, style: 'blackSize10' },] }],
                                                  [{ columns: [{ text: 'Nationality ', style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${dataQuaRes.persdata[0].nationality} `, style: 'blackSize10' },] }],
                                                  [{ columns: [{ text: 'National ID ', style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${dataQuaRes.persdata[0].primary_ic} `, style: 'blackSize10' },] }],
                                                  [{ columns: [{ text: 'Contact No. ', style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${dataQuaRes.persdata[0].phone} `, style: 'blackSize10' },] }],
                                                  [{ columns: [{ text: 'Birth Date ', style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${bdtStr} `, style: 'blackSize10' },] }],
                                                  [{ columns: [{ text: 'Age ', style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${dataQuaRes.persdata[0].age}`, style: 'blackSize10' },] }],
                                                   //[{ columns: [{ text: 'Emp. Group ', style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${dataQuaRes.profile[0].EmpGroup}`, style: 'blackSize10' },] }],
                                                   //[{ columns: [{ text: 'Years in Service ', style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${dataQuaRes.profile[0].YIS_HireDt}`, style: 'blackSize10' },] }],
                                                   //[{ columns: [{ text: 'Years in Band ', style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${dataQuaRes.profile[0].YIB}`, style: 'blackSize10' },] }],
                                                   //[{ columns: [{ text: 'Salary Grade ', style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${dataQuaRes.profile[0].Job_Grad}`, style: 'blackSize10' },] }],
                                                   //[{ columns: [{ text: 'Talent ', style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${dataQuaRes.profile[0].Talent}`, style: 'blackSize10' },] }],
            

                                               ]
                                           },
                                           layout: 'noBorders',
                                           margin: [20, 105, 0, 0]
                                       },
                                       {

                                       }
                                   ],
                               }
                           ];
                       }
                   },
                   header: {},
                   footer: function (currentPage, pageCount) {
                       return {
                           // text: `Profile of: ${dataQuaRes.profile[0].Name}, ${dataQuaRes.profile[0].Staff_No} \n
                           //         Page : ` + currentPage.toString() + ' / ' + pageCount,
                           text: 'Page : ' + currentPage.toString() + ' / ' + pageCount,
                           color: 'gray',
                           bold: 'true',
                           alignment: 'right',
                           fontSize: 11,
                           margin: 20
                       };
                   },
                   content: [],
                   images: {
                       logoEra: 'data:image/png;base64,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',
                       logoTM: 'data:image/png;base64,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'
                   },
                   styles: {
                       era_title: {
                           color: '#ea1819',
                           fontSize: 20,
                           bold: true,
                           alignment: 'center',
                           margin: [0, 20, 0, 0]

                       },
                       profile_name: {
                           bold: true,
                           color: '#fd5806',
                           fontSize: 12,
                           alignment: 'left',
                       },
                       header: {
                           color: '#fd5806',
                           bold: true,
                           fontSize: 14,
                       },
                       profile_header: {
                           color: '#5e6063',
                           bold: true,
                           fontSize: 12,
                           alignment: 'left',
                       },
                       wm_title: {
                           bold: true,
                           fontSize: 30,
                           color: '#5e6063',
                           opacity: 0.3
                       },
                       wm_staffId: {
                           bold: true,
                           fontSize: 40,
                           color: '#5e6063',
                           opacity: 0.3
                       },
                       lst_data: {
                           bold: true,
                           fontSize: 11,
                       },
                       lst_data_color: {
                           bold: true,
                           fontSize: 11,
                           color: '#fd5806'
                       },
                       red10: {
                           fontSize: 10,
                           color: 'red',
                           bold: true
                       },
                       lst_title_no: {
                           fontSize: 11,
                           bold: false,
                           color: '#5c6066',
                       },
                       lst_title: {
                           fontSize: 11,
                           bold: false,
                           color: '#5c6066',
                           margin: [20, 0, 0, 0]

                       },
                       bold: {
                           bold: true
                       },
                       greySize10: {
                           fontSize: 10,
                           color: '#5e6063',
                           bold: true,
                           alignment: 'left'
                       },
                       blackSize10: {
                           fontSize: 10,
                           bold: true,
                           alignment: 'left'
                       }
                   }
               };

               // Populate the header of the PDF 
               this.docDefinition.header = {
                   table: {
                       widths: ['auto', '*', 'auto'],
                       //headerRows: 1,
                       body: [
                           [{ rowSpan: 3, image: 'logoEra', fit: [80, 80], margin: [0, 7, 0, 10], bold: true }, { rowSpan: 3, text: `EMPLOYEE CAREER PROFILE`, style: 'era_title' }, { rowSpan: 3, image: 'logoTM', fit: [100, 100] }],
                           [{ text: `` }, '', ''],
                           [{ text: ``, margin: [0, 0, 0, 10], bold: true }, '', ''],
                           [{ colSpan: 3, text: '', fillColor: '#ff3300' }]
                       ]
                   },
                   layout: 'noBorders',
                   margin: [20, 20, 20, 40]
               };


               // Get the Date and Time
               // Can consider to use momentjs in the future for better format control
               // let myDate = new Date();
               // let theDate;
               // let theTime;
               // theDate = myDate.toLocaleDateString();
               // theTime = myDate.toLocaleTimeString();

               // Populate the footer of the PDF
               // this.docDefinition.footer = {
               //     text: `Profile of: ${dataQuaRes.profile[0].Name}, ${dataQuaRes.profile[0].Staff_No}`,
               //     color: 'gray',
               //     alignment: 'right',
               //     fontSize: 10,
               //     margin: 20
               // };

               // Populate the content of PDF
               let myContent;
               this.docDefinition.content = [];

               // We invoke another request to convert the blob to Base64
               // let profilePictureBase64 = this._GET_api_Service.GET_Base64(pictureResults);
               // profilePictureBase64.subscribe (myData => {


               // Remarks:
               // URL to convert to Base64 image
               // https://www.base64-image.de/
               myContent = [
                   {
                       // 0.
                       table: {
                           widths: [350],
                           body: [
                               [{ text: '' }]
                           ]
                       },
                       layout: 'noBorders',
                       margin: [0, 20, 0, 5]
                   },
                   {
                       // 1.

                       columns: [
                           {
                               width: 175,
                               alignment: 'center',
                               table: {
                                   width: ['auto'],
                                   body: [
                                       [{ image: this.imgDataUrl, width: 95, height: 95 }],
                                       [{ text: `\n` }],

                                       [{ text: `${dataQuaRes.persdata[0].full_name}`, style: 'profile_name' }],
                                       [{ text: `${dataQuaRes.persdata[0].u_email}`, style: 'greySize10' }],
                                      // [{ text: `${dataQuaRes.profile[0].Post_Desc}`, style: 'blackSize10' }],
                                      // [{ text: `${dataQuaRes.profile[0].Company_Desc}`, style: 'blackSize10' }],
                                      //[{ columns: [{ text: 'Pers. No ', style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${dataQuaRes.profile[0].Pers_no}`, style: 'blackSize10' },] }],
                                      [{ columns: [{ text: 'Nationality ', style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${dataQuaRes.persdata[0].nationality} `, style: 'blackSize10' },] }],
                                      [{ columns: [{ text: 'National ID ', style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${dataQuaRes.persdata[0].primary_ic} `, style: 'blackSize10' },] }],
                                      [{ columns: [{ text: 'Contact No ', style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${dataQuaRes.persdata[0].phone} `, style: 'blackSize10' },] }],
                                      [{ columns: [{ text: 'Birth Date ', style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${bdtStr} `, style: 'blackSize10' },] }],
                                      [{ columns: [{ text: 'Age ', style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${dataQuaRes.persdata[0].age}`, style: 'blackSize10' },] }],
                                       //[{ columns: [{ text: 'Emp. Group ', style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${dataQuaRes.profile[0].EmpGroup}`, style: 'blackSize10' },] }],
                                       //[{ columns: [{ text: 'Years in Service ', style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${dataQuaRes.profile[0].YIS_HireDt}`, style: 'blackSize10' },] }],
                                       //[{ columns: [{ text: 'Years in Band ', style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${dataQuaRes.profile[0].YIB}`, style: 'blackSize10' },] }],
                                       //[{ columns: [{ text: 'Salary Grade ', style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${dataQuaRes.profile[0].Job_Grad}`, style: 'blackSize10' },] }],
                                       //[{ columns: [{ text: 'Talent ', style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${dataQuaRes.profile[0].Talent}`, style: 'blackSize10' },] }],

                                   ]
                               },
                               layout: 'noBorders',
                           },
                           {
                               width: 'auto', margin: 5,
                               type: 'none',
                               ul:
                                   [
                                       {   //ul[0]
                                           table: {
                                               body: [
                                                   [{ text: 'JOB EXPERIENCE', style: 'header' }]
                                               ]
                                           }, layout: 'noBorders',
                                       },
                                       {   //ul[1]
                                           text: '\n'
                                       },
                                       {   //ul[2]
                                           type: 'none',
                                           ul: [
                                               { text: [{ text: `#.    `, style: 'red10' }, { text: 'NIL\n', style: 'lst_title' }] }
                                           ]
                                       },

                                       {   //ul[3]
                                           text: '\n\n'
                                       },

                                       {   //ul[4]
                                           table: {
                                               body: [
                                                   [{ text: 'EDUCATION BACKGROUND', style: 'header' }]
                                               ]
                                           }, layout: 'noBorders',
                                       },
                                       {   //ul[5]
                                           text: '\n'
                                       },
                                       {   //ul[6]
                                           type: 'none',
                                           ul: [
                                               { text: [{ text: `#.    `, style: 'red10' }, { text: 'NIL\n', style: 'lst_title' }] }
                                           ]
                                       },

                                       {   //ul[7]
                                           text: '\n\n'
                                       },

                                       {   //ul[8]
                                           table: {
                                               body: [
                                                   [{ text: 'PROFESSIONAL QUALIFICATION', style: 'header' }]
                                               ]
                                           }, layout: 'noBorders',
                                       },
                                       {   //ul[9]
                                           text: '\n'
                                       },
                                       {   //ul[10]
                                           type: 'none',
                                           ul: [
                                               { text: [{ text: `#.    `, style: 'red10' }, { text: 'NIL\n', style: 'lst_title' }] }
                                           ]
                                       },

                                       {   //ul[11]
                                           text: '\n\n'
                                       },

                                       {   //ul[12]
                                           table: {
                                               body: [
                                                   [{ text: 'AWARDS / MERIT', style: 'header' }]
                                               ]
                                           }, layout: 'noBorders',
                                       },
                                       {   //ul[13]
                                           text: '\n'
                                       },
                                       {   //ul[14]
                                           type: 'none',
                                           ul: [
                                               { text: [{ text: `#.    `, style: 'red10' }, { text: 'NIL\n', style: 'lst_title' }] }
                                           ]
                                       },

                                       {   //ul[15]
                                           text: '\n\n'
                                       },
/**
                                       {   //ul[16]
                                           table: {
                                               body: [
                                                   [{ text: 'PERFORMANCE APPRAISAL', style: 'header' }]
                                               ]
                                           }, layout: 'noBorders',
                                       },
                                       {   //ul[17]
                                           text: '\n'
                                       },
                                       {   //ul[18]
                                           type: 'none',
                                           ul: [
                                               { text: [{ text: `#.    `, style: 'red10' }, { text: 'NIL\n', style: 'lst_title' }] }
                                           ]
                                       },

                                       {   //ul[19]
                                           text: '\n\n'
                                       },

                                       {   //ul[20]
                                           table: {
                                               body: [
                                                   [{ text: 'UPGRADING AND PROMOTION', style: 'header' }]
                                               ]
                                           }, layout: 'noBorders',
                                       },
                                       {   //ul[21]
                                           text: '\n'
                                       },
                                       {   //ul[22]
                                           type: 'none',
                                           ul: [
                                               { text: [{ text: `#.    `, style: 'red10' }, { text: 'NIL\n', style: 'lst_title' }] }
                                           ]
                                       },

                                       {   //ul[23]
                                           text: '\n\n'
                                       },

                                       {   //ul[24]
                                           table: {
                                               body: [
                                                   [{ text: 'ASSESSMENT RESULT', style: 'header' }]
                                               ]
                                           }, layout: 'noBorders',
                                       },
                                       {   //ul[25]
                                           text: '\n'
                                       },
                                       {   //ul[26]
                                           type: 'none',
                                           ul: [
                                               { text: [{ text: `#.    `, style: 'red10' }, { text: 'NIL\n', style: 'lst_title' }] }
                                           ]
                                       },

                                       {   //ul[27]
                                           text: '\n\n'
                                       },

                                       {   //ul[28]
                                           table: {
                                               body: [
                                                   [{ text: 'SKILLSET MATCHUP', style: 'header' }]
                                               ]
                                           }, layout: 'noBorders',
                                       },
                                       {   //ul[29]
                                           text: '\n'
                                       },
                                       {   //ul[30]
                                           type: 'none',
                                           ul: [
                                               { text: [{ text: `#.    `, style: 'red10' }, { text: 'NIL\n', style: 'lst_title' }] }
                                           ]
                                       },

                                       {   //ul[31]
                                           text: '\n\n'
                                       },
                                       **/


                                   ],

                           },

                       ]
                   },

               ];

               // Populate - JOB EXPERIENCE (ul[2])
               if (dataQuaRes.workExp.length) {
                   let exprienceList = {
                       type: 'none',
                       ul: [

                       ]
                   };
                   let num = 1;
                   
                   dataQuaRes.workExp.forEach(function (myVal) {
                    
                       let dp:DatePipe = new DatePipe('en-US');

                       
                       
                    let dateJoinStr = dp.transform(new Date(), 'dd-MM-yyyy');
          
                       let myRow = [];
                       var n = (num < 10) ? ('0' + num++) : num++;
                       myRow.push({ columns: [{ width: 100, text: [{ text: `${n}.  `, style: 'red10' }, { text: 'Position ' }], style: 'lst_title_no' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.postTitle}`, style: 'lst_data' }] });
                       myRow.push({ columns: [{ width: 100, text: 'Company ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.compName}`, style: 'lst_data' }] });
                       myRow.push({ columns: [{ width: 100, text: 'Date Join ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${dateJoinStr}`, style: 'lst_data' }] });
                       myRow.push({ columns: [{ width: 100, text: 'Duration ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.yearInPost}`, style: 'lst_data' }] });
                    

                       myRow.push({ text: '\n' });

                       exprienceList.ul.push(myRow);
                      // alert("loading experience");
                   });

                   myContent[1].columns[1].ul[2] = exprienceList;
               }



               // Populate - EDUCATION BACKGROUND (ul[6])
               if (dataQuaRes.edu.length) {
                   let eduBackList = {
                       type: 'none',
                       ul: [

                       ]
                   };
                   let num = 1;
                   dataQuaRes.edu.forEach(function (myVal) {
                       var n = (num < 10) ? ('0' + num++) : num++;
                       let myRow = [];
                       myRow.push({ columns: [{ width: 100, text: [{ text: `${n}.  `, style: 'red10' }, { text: 'Institution ' }], style: 'lst_title_no' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.institution}`, style: 'lst_data' }] });
                       myRow.push({ columns: [{ width: 100, text: 'Educational level ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.educational_level}`, style: 'lst_data' }] });
                       myRow.push({ columns: [{ width: 100, text: 'Branch of Study ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.area_of_study}`, style: 'lst_data' }] });
                       //myRow.push({ columns: [{ width: 100, text: 'Certificate ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.Certificate}`, style: 'lst_data' }] });
                       myRow.push({ text: '\n' });

                       eduBackList.ul.push(myRow);
                   });

                   myContent[1].columns[1].ul[6] = eduBackList;
               }

               // Populate - PROFESSIONAL QUALIFICATION (ul[10])
               if (dataQuaRes.certs.length) {
                   let profQualList = {
                       type: 'none',
                       ul: [

                       ]
                   };
                   let num = 1;
                   
                   dataQuaRes.certs.forEach(function (myVal) {
                       var n = (num < 10) ? ('0' + num++) : num++;
                       let myRow = [];
                       myRow.push({ columns: [{ width: 100, text: [{ text: `${n}.  `, style: 'red10' }, { text: 'Cert Name ' }], style: 'lst_title_no' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.certName}`, style: 'lst_data' }] });
                       myRow.push({ columns: [{ width: 100, text: 'Cert Issuer ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.certIssuer}`, style: 'lst_data' }] });
                     
                       myRow.push({ columns: [{ width: 100, text: 'Cert Year ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.certYear}`, style: 'lst_data' }] });
                     
                       myRow.push({ text: '\n' });

                       profQualList.ul.push(myRow);
                   });

                   

                   myContent[1].columns[1].ul[10] = profQualList;
               }

               // Populate - AWARDS/MERITS (ul[14])
               if (dataQuaRes.accomp.length) {
                   let awardList = {
                       type: 'none',
                       ul: [

                       ]
                   };
                   let num = 1;
                   
                   dataQuaRes.accomp.forEach(function (myVal) {
                       var n = (num < 10) ? ('0' + num++) : num++;
                       let myRow = [];
                       myRow.push({ columns: [{ width: 100, text: [{ text: `${n}.  `, style: 'red10' }, { text: 'Award ' }], style: 'lst_title_no' }, { width: 5, text: ':', style: 'lst_data' }, { text: `${myVal.accomp_name}`, style: 'lst_data' }] });
                       myRow.push({ columns: [{ width: 100, text: 'Awarded On ', style: 'lst_title' }, { width: 5, text: ':', style: 'lst_data' }, { text: `${myVal.recv_year} / ${myVal.recv_month}`, style: 'lst_data' }] });
                       myRow.push({ text: '\n' });

                       awardList.ul.push(myRow);
                   });

                   

                   myContent[1].columns[1].ul[14] = awardList;
               }

               // Populate - PERFORMANCE APPRAISAL (ul[18])
               if (1) {
                   let performList = {
                       type: 'none',
                       ul: [

                       ]
                   };
                   let num = 1;
                   /** 
                   dataQuaRes.career.performance.forEach(function (myVal) {
                       var n = (num < 10) ? ('0' + num++) : num++;
                       let myRow = [];
                       myRow.push({ columns: [{ width: 100, text: [{ text: `${n}.  `, style: 'red10' }, { text: 'Year ' }], style: 'lst_title_no' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.years}`, style: 'lst_data' }] });
                       myRow.push({ columns: [{ width: 100, text: 'Rating ', style: 'lst_title' }, { text: [{ text: `: `, style: 'lst_data' }, { text: `${myVal.rating} `, style: 'lst_data_color' }, { text: `(${myVal.description})`, style: 'lst_data' }] }] });
                       myRow.push({ text: '\n' });

                       performList.ul.push(myRow);
                   });

                   */

                   myContent[1].columns[1].ul[18] = performList;
               }

               // Populate - UPGRADING AND PROMOTION (ul[22])


               // Populate - ASSESSMENT RESULT (ul[26])
               if (1) {
                   let assessmentList = {
                       type: 'none',
                       ul: [

                       ]
                   };
                   let num = 1;
                   /**
                   dataQuaRes.career.assessment.forEach(function (myVal) {
                       var n = (num < 10) ? ('0' + num++) : num++;
                       let myRow = [];
                       myRow.push({ columns: [{ width: 100, text: [{ text: `${n}.  `, style: 'red10' }, { text: 'Year ' }], style: 'lst_title_no' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.years}`, style: 'lst_data' }] });
                       myRow.push({ columns: [{ width: 100, text: 'Assessment ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.assessment}`, style: 'lst_data' }] });
                       myRow.push({ columns: [{ width: 100, text: 'Rating ', style: 'lst_title' }, { width: 5, text: `:`, style: 'lst_data' }, { text: `${myVal.rating}`, style: 'lst_data' }] });
                       myRow.push({ text: '\n' });

                       assessmentList.ul.push(myRow);
                   });
                   **/

                   myContent[1].columns[1].ul[26] = assessmentList;
               }

               // Populate - SKILLSET MATCHUP (ul[30])
               if (1) {
                   let skillsetList = {
                       type: 'none',
                       ul: [

                       ]
                   };
                   let num = 1;
                   /**
                   dataQuaRes.career.skillset.forEach(function (myVal) {
                       var n = (num < 10) ? ('0' + num++) : num++;
                       let myRow = [];
                       myRow.push({ columns: [{ width: 120, text: [{ text: `${n}.  `, style: 'red10' }, { text: 'Skill | Endorsements ' }], style: 'lst_title_no' }, { text: [{ text: `: ${myVal.skillset} `, style: 'lst_data' }, { text: `| ${myVal.skill_endorsement}`, style: 'lst_data_color' }] }] });
                       myRow.push({ columns: [{ width: 120, text: 'Skill Level ', style: 'lst_title' }, { text: `: ${myVal.skill_level}`, style: 'lst_data' }] });
                       myRow.push({ text: '\n' });

                       skillsetList.ul.push(myRow);
                   });

                   **/

                   myContent[1].columns[1].ul[30] = skillsetList;
               }

               this.applDownloadFlag = false;
               this.docDefinition.content.push(myContent);
               //});
           }, 1500);

            /*** END GETTING PDF */








        }
            , error => {
                console.error("Failed to get information for user " + applId);
            }


        );


    }

    /*afdzal END get eraUserDetail*/


    applInfoFormSubmit(): void {
        let selId = this.applInfoForm.get('applId').value;
        let applIndex = this.applInfoForm.get('applIndex').value;
        let selType = this.applInfoForm.get('applType').value;

        if (selType.match('forInterview') != null) {
            this.checkedList.push(selId);
            this.countCheckbox();
        } else if (selType.match('forSuccess') != null) {
            // TODO
            // Check radio
            this.selRadioSucc = selId;
            this.countRadio();
        }
    }
    countCheckbox() {
        if (this.checkedList.length < 1) {
            this.aplcSubmit = false;
        } else {
            this.aplcSubmit = true;
        }
    }
    countRadio() {
        if (this.selRadioSucc != 0) {
            this.iviewSubmit = true;
        }
    }

    countCheckbox2() {
        if (this.checkedList2.length < 1) {
            this.iviewSubmit = false;
        } else {
            this.iviewSubmit = true;
        }
    }

    // send list for iview
    selectApplicantForIviewAPI = JADVars.selectApplicantForIviewAPI;
    selApplReq = false;
    selectApplicant() {
        this.aplcSubmit = false;
        let data2 = {
            adv_id: this.idx,
            id: this.checkedList
        }
        let updPurposeSend = this._POST_api_Service.POST_data(JADVars.selectApplicantForIviewAPI, data2);
        let ret = updPurposeSend.subscribe(dataQuaRes => {
            this.dataAdvPos = dataQuaRes;
            if (this.dataAdvPos && this.dataAdvPos.status == "OK") {
                this.apprPosMsg = 'Selected applicants has been processed';
                this.apprStyle = ' alert-success ';
                this.selApplReq = true;
                this.getJobDetailData(this.idx);
                this.checkedList = [];
                this.aplcAct = false;
                setTimeout(function () {
                    this.selApplReq = false;
                }.bind(this), 3000); //wait 3 Seconds and hide
            } else {
                this.apprPosMsg = 'Fail to perform request.';
                this.apprStyle = ' alert-danger  ';
                this.selApplReq = true;
            }
            this.aplcSubmit = true;
        },
            error => {
                console.log('[ERROR] Select Applicant for Interview' + ' - ' + error);
                this.apprPosMsg = 'Fail to perform request. Please contact your administrator.'; //this.dataAdvPos.msg
                this.apprStyle = ' alert-danger  ';
                this.apprReq = true; this.btnApprove = false; this.btnReject = false; this.btnRevert = false;
            })
    }
    /** END: SELECT APPLICANT */

    /** :start SELECT SUCCESS IVIEW */
    selIviewReq = false; // DIsplay message success/fail
    selRadioSucc = 0;
    onRadioSelect(option, event) {
        if (event.target.checked) {
            this.optionRadio = true;
            this.selRadioSucc = option.id;
        }
        this.countRadio();
        /*if (this.selRadioSucc!=0){
            this.iviewSubmit=true;
        }*/
    }

    checkedList2 = [];
    onCheckboxChange2(option, event) {
        this.optionCheckbox = true;
        this.tVacancy = 0;
        for (let tmp in this.hData.interviewee) {
               if (this.hData.interviewee[tmp].status_text === "Interview in Progress")
               {
                   this.tVacancy++;
               }
         }
        var maxAllowed = this.tVacancy
        let maxAllowed2 = maxAllowed;
        this.vacancy = this.constVac;
        this.vacancy = this.constVac - this.tVacancy;

        $(document).ready(function () {
            $("input[name='vacan']").change(function () {
                
                var cnt = $("input[name='vacan']:checked").length;
                if (cnt > maxAllowed) {
                    $(this).prop("checked", "");
                    alert('You can select maximum ' + maxAllowed + ' to interview');
                }
            });
        });

        if (event.target.checked && this.tempB < maxAllowed2) {
            this.checkedList2.push(option.id);
            this.tempB++;

        } else if (!event.target.checked && this.tempB <= maxAllowed2) {
            for (var i = 0; i < this.checkedList2.length; i++) {
                if (this.checkedList2[i] == option.id) {
                    this.checkedList2.splice(i, 1);
                    this.tempB--;
                    this.tVacancy--;
                }            
            }
            
        } else if (this.tempB > maxAllowed2)  {
            // console.log('tempB sama atau lebih besar dr vacancy');
        }

        this.resVal = maxAllowed2 - this.tempB;
        // console.log("variable of resVal: " +this.resVal);

        this.countCheckbox2();
    }

    selectSuccessIview() {
        
        if(this.optionRadio === true){ 
            this.iviewSubmit = false;
            if (this.resVal === 0) { this.resTF = true;}
            let data2 = {
                adv_id: this.idx,
                id: (this.selRadioSucc).toString()
            }
            let updPurposeSend = this._POST_api_Service.POST_data(JADVars.selectSuccessFromIviewAPI, data2);
            let ret = updPurposeSend.subscribe(dataQuaRes => {
                this.dataAdvPos = dataQuaRes;
                if (this.dataAdvPos && this.dataAdvPos.status == "OK") {
                    this.apprPosMsg = 'Selected applicants has been processed';
                    this.apprStyle = ' alert-success ';
                    this.selIviewReq = true;
                    this.iviewAct = false;
                    this.getJobDetailData(this.idx);
                    this.selRadioSucc = 0;
                    this.optionRadio = false;
                    this.tVacancy = 0;
                    setTimeout(function() {
                        this.selIviewReq = false;
                    }.bind(this), 3000); //wait 3 Seconds and hide
                } else {
                    this.apprPosMsg = 'Fail to perform request.';
                    this.apprStyle = ' alert-danger  ';
                    this.selIviewReq = true;
                }
            },
            error => {
                console.log('[ERROR] Select Applicant for Interview' + ' - ' + error);
                this.apprPosMsg = 'Fail to perform request. Please contact your administrator.'; //this.dataAdvPos.msg
                this.apprStyle = ' alert-danger  ';
                this.apprReq = true; this.btnApprove = false; this.btnReject = false; this.btnRevert = false;
            })
        }
            
        if(this.optionCheckbox === true){    
            this.iviewSubmit = false;
            if (this.resVal === 0) { this.resTF = true;}
            let data2 = {
                adv_id: this.idx,
                id: this.checkedList2
            }
            let updPurposeSend = this._POST_api_Service.POST_data(JADVars.selectMulSuccFromIviewAPI, data2);
            
            let ret = updPurposeSend.subscribe(dataQuaRes => {
                this.dataAdvPos = dataQuaRes;
                if (this.dataAdvPos && this.dataAdvPos.status == "OK") {
                    this.apprPosMsg = 'Selected applicants has been processed';
                    this.apprStyle = ' alert-success ';
                    this.selIviewReq = true;
                    this.iviewAct = false;
                    this.checkedList2 = [];
                    this.tVacancy = 0;
                    this.optionCheckbox = false;
                    this.tempB = 0;
                    this.getJobDetailData(this.idx);
                    setTimeout(function() {
                        this.selIviewReq = false;
                    }.bind(this), 3000); //wait 3 Seconds and hide
                } 
                else {
                    this.apprPosMsg = 'Fail to perform request.';
                    this.apprStyle = ' alert-danger  ';
                    this.selIviewReq = true;
                }
            },
            error => {
                console.log('[ERROR] Select Applicant for Interview' + ' - ' + error);
                this.apprPosMsg = 'Fail to perform request. Please contact your administrator.'; //this.dataAdvPos.msg
                this.apprStyle = ' alert-danger  ';
                this.apprReq = true; this.btnApprove = false; this.btnReject = false; this.btnRevert = false;
            })
        }
    }
    /** :end SELECT SUCCESS IVIEW */

    /** :start Resubmit/Withdraw/Closed Advertisement */
    btnReSubmit = JADVars.btnReSubmit;
    btnWithDraw = JADVars.btnWithDraw;
    btnClose = JADVars.btnClose;
    apiResubmit = JADVars.apiResubmit;
    apiClosed = JADVars.apiClosed;
    clickResubmit = "";
    resubmitForm: FormGroup;
    resubmitRemark = false;
    setResubmit(act) {
        // this.myStartDt=new Date(this.info[0].start); this.myEndDt=new Date(this.info[0].close);
        let input1 = document.getElementById("stResubmit") as HTMLInputElement;
        input1.value = this.datePipe.transform(new Date(this.info[0].start), "dd-MM-yyyy");;
        let input2 = document.getElementById("etResubmit") as HTMLInputElement;
        input2.value = this.datePipe.transform(new Date(this.info[0].close), "dd-MM-yyyy");;
        //myStartDt=new Date(); myEndDt=new Date();
        //let i=this.dateComparison(new Date(input1.value),new Date(input2.value),true);
        let i = this.dateComparison(this.myStartDt, this.myEndDt, true);
        if (i.isError === true) this.advDateError = { isError: true, errorMessage: '' };
        //let resetForm= <HTMLFormElement>document.getElementById('m_modal_resubmit');
        //resetForm.reset();
        let subAct = "";
        if (act == '1') {
            subAct = "true";
            this.clickResubmit = 'resubmit';
            this.resubmitRemark = false;
            let st = new Date(this.info[0].start);// new Date(this.datePipe.transform(this.info[0].start, "full"));
            let ed = new Date(this.info[0].close);// new Date(this.datePipe.transform(this.info[0].close, "full"));
            let dtErr = this.dateComparison(st, ed, true);
            if (dtErr.isError == false) {
                this.advPeriod = true; this.showErrMsg = false;
            } else {
                this.advPeriod = false; this.showErrMsg = true; this.advErrMsg = dtErr.errorMessage;
                if (i.isError === true) { this.advDateError = { isError: true, errorMessage: '' }; }
            }
            //document.getElementById("m_modal_resubmit");
            /*let checkAdvPeriod = this.checkAdvPeriod();
            if (checkAdvPeriod == 1) { // date OK
                this.advPeriod = true;
            } else {
                this.advPeriod = false; this.showErrMsg = true;
                if (checkAdvPeriod == 2) { // exceed 60 days
                    this.advErrMsg = this.advExceedDate;
                } else if (checkAdvPeriod == 3) { // expired
                    this.advErrMsg = this.advExpDate;
                }
            }*/
        } else if (act == '0') {
            subAct = "false"; this.clickResubmit = 'cancel'; this.resubmitRemark = true; this.advPeriod = true;
            this.advDateError = { isError: false, errorMessage: '' };
        } else if (act == '2') {
            subAct = "false"; this.clickResubmit = 'close'; this.resubmitRemark = true; this.advPeriod = true;
            this.advDateError = { isError: false, errorMessage: '' };
        }
        this.resubmitForm.setValue(
            {
                advId: this.idx,
                advRemark: '',//this.info[0].remark,
                advResubmit: act,
                // datetimepicker v1 advDtRange: this.datePipe.transform(this.info[0].start, "MM-dd-yyyy") + " to " +
                // datetimepicker v1 this.datePipe.transform(this.info[0].close, "MM-dd-yyyy")
                dtStart: this.datePipe.transform(this.info[0].start), dtEnd: this.datePipe.transform(this.info[0].close),
            });
        this.checkIsOccupied();
    }

    resubmitReq = false; resubmitStyle: string; resubmitPosMsg: string; resubmitButton = true;
    resubmitFormSubmit() {
        let advId = this.resubmitForm.get('advId').value;
        let advRemark = this.resubmitForm.get('advRemark').value;
        let advResubmit = this.resubmitForm.get('advResubmit').value;

        /* :start datepicker v1
        let advDtRangeb = ''; let advStartDt = ''; let advEndDt = '';
        if (document.getElementById("advDtRangeb")) {
            advDtRangeb = ((document.getElementById("advDtRange") as HTMLInputElement).value); // this.pendApprForm.get('advDtRangeb').value;
            advStartDt = advDtRangeb.substr(0, 10);//this.pendApprForm.get('advStartDt').value;
            advEndDt = advDtRangeb.substr(14, 10); //this.pendApprForm.get('advEndDt').value;
        } else {
            let today = Date();
            advStartDt = this.datePipe.transform(today, "MM-dd-yyyy");
            advEndDt = advStartDt;
        }
        :end datepicker v1 */
        let advStartDt = ((document.getElementById("startDate2Resubmit") as HTMLInputElement).value);//this.resubmitForm.get('dtStart').value;
        let advEndDt = ((document.getElementById("endDate2Resubmit") as HTMLInputElement).value);//this.resubmitForm.get('dtEnd').value;

        let generalMsg = "";
        let advResubmit2: boolean;
        if (advResubmit == '1') {
            generalMsg = 'Resubmit.'; advResubmit2 = true;
        } else if (advResubmit == '0') {
            generalMsg = 'Cancel.'; advResubmit2 = false;
        } else if (advResubmit == '2') {
            generalMsg = 'Close.'; advResubmit2 = false;
        }

        let apprData = {
            'id': advId,
            'start': advStartDt,
            'close': advEndDt,
            'remark': advRemark,
            'resubmit': advResubmit2
        }
        if (advResubmit === '1' || advResubmit === '0') {
            let apprSend = this._POST_api_Service.POST_data(this.apiResubmit, apprData);
            let ret = apprSend.subscribe(dataQuaRes => {
                this.dataAdvPos = dataQuaRes;
                if (this.dataAdvPos && this.dataAdvPos.status == "OK") {
                    this.resubmitPosMsg = 'Advertisement Request has been ' + generalMsg;
                    this.resubmitPosMsg += ' You will be redirected to Advertisement Tracking List page shortly. ';
                    this.resubmitStyle = ' alert-success ';
                    //this.btnApprove = false; this.btnReject = false; this.btnRevert = false;
                    this.resubmitReq = true; this.resubmitButton = false;
                    setTimeout(function () {
                        this.resubmitReq = false;
                        this.routers.navigate(['admin/job/advertisement-tracking/all']);
                    }.bind(this), 3000); //wait 3 Seconds and hide
                } else {
                    this.resubmitPosMsg = 'Fail to perform request.'; //this.dataAdvPos.msg
                    this.resubmitStyle = ' alert-danger  ';
                    this.resubmitReq = true;
                }
            },
                error => {
                    console.log('[ERROR] Job Profile: ' + generalMsg + ' - ' + error);
                    this.resubmitPosMsg = 'Fail to perform request. Please contact your administrator.'; //this.dataAdvPos.msg
                    this.resubmitStyle = ' alert-danger  ';
                    this.resubmitReq = true; this.btnApprove = false; this.btnReject = false; this.btnRevert = false;
                }
            );
        } else if (advResubmit === '2') {
            let dataPos = {
                id: advId,
                remark: advRemark,
            }
            this._POST_api_Service.POST_data(this.apiClosed, dataPos).subscribe(dataRes => {
                this.dataAdvPos = dataRes;
                if (this.dataAdvPos && this.dataAdvPos.status == "OK") {
                    this.resubmitPosMsg = 'Advertisement Request has been ' + generalMsg;
                    this.resubmitPosMsg += ' You will be redirected to Advertisement Tracking List page shortly. ';
                    this.resubmitStyle = ' alert-success ';
                    //this.btnApprove = false; this.btnReject = false; this.btnRevert = false;
                    this.resubmitReq = true; this.resubmitButton = false;
                    setTimeout(function () {
                        this.resubmitReq = false;
                        // this.routers.navigate(['admin/job/advertisement-tracking/18_0_0_0_0']);
                        this.routers.navigate(['admin/job/career-tm/all_0_0_0_0']);
                    }.bind(this), 3000); //wait 3 Seconds and hide
                } else {
                    this.resubmitPosMsg = 'Fail to perform request.'; //this.dataAdvPos.msg
                    this.resubmitStyle = ' alert-danger  ';
                    this.resubmitReq = true;
                }
            },
                error => {
                    console.log('[ERROR] Job Profile: ' + generalMsg + ' - ' + error);
                    this.resubmitPosMsg = 'Fail to perform request. Please contact your administrator.'; //this.dataAdvPos.msg
                    this.resubmitStyle = ' alert-danger  ';
                    this.resubmitReq = true; this.btnApprove = false; this.btnReject = false; this.btnRevert = false;
                }
            )
        }
    }
    /** :end Resubmit/Withdraw/Closed Advertisement */

    advDateError: any = { isError: false, errorMessage: '' };
    dateComparison(mySt, myEd, chckStartDt) {
        let isErr = false; let errMsg = '';
        //let retErr : any = { isError: isErr, errorMessage: errMsg };
        var ONE_DAY = 1000 * 60 * 60 * 24;
        let days = Math.round((Math.abs(myEd.getTime() - mySt.getTime()) / ONE_DAY));
        //if (Math.round(((myEd.getTime() - mySt.getTime()) / ONE_DAY)) < 0) {
        if ((myEd.setHours(0, 0, 0, 0) - mySt.setHours(0, 0, 0, 0)) / ONE_DAY < 0) {
            isErr = true; errMsg += 'Invalid advertisement period. End date should not be less than start date. ';
            //} else if (days > 14) {
        } else if ((myEd.setHours(0, 0, 0, 0) - mySt.setHours(0, 0, 0, 0)) / ONE_DAY > (14 - 1)) {
            isErr = true; errMsg += 'Advertisement period should not be more than 14 days. ';
        }
        if (chckStartDt) {
            let today = new Date(); // new Date();
            //if  (Math.round(((mySt.getTime() - today.getTime()) / ONE_DAY)) < 0)  {
            if (myEd.setHours(0, 0, 0, 0) <= today.setHours(0, 0, 0, 0)) {
                isErr = true; errMsg += 'Advertisement period date has expired. ';
            }

            // if ((today.setHours(0, 0, 0, 0) - myEd.setHours(0, 0, 0, 0)) / ONE_DAY < 0) {
            //     isErr = true; errMsg += 'Advertisement end date has expired. ';
            // }
        }
        let retErr = { isError: isErr, errorMessage: errMsg };
        return retErr;
    }
    compareTwoDates() { //this.advPosForm.get('advPosIdx2').value;
        let mySt = new Date((document.getElementById("startDate2") as HTMLInputElement).value);
        let myEd = new Date((document.getElementById("endDate2") as HTMLInputElement).value);
        this.advDateError = this.dateComparison(mySt, myEd, true);
    }

    compareTwoDatesResubmit() { //this.advPosForm.get('advPosIdx2').value;
        let mySt = new Date((document.getElementById("startDate2Resubmit") as HTMLInputElement).value);
        let myEd = new Date((document.getElementById("endDate2Resubmit") as HTMLInputElement).value);
        this.advDateError = this.dateComparison(mySt, myEd, true);
    }

    onClickResumeBtn() {
        /**
        let openUrl ='https://career-tm-api-era.apps.cp.tmrnd.com.my/api/profile/resume/get/'
            + this.eraResumeUrl + '?api_key=' + GlobalVariable.API_KEY;
            **/
        let openUrl = this.eraResumeUrl;
        //alert(this.eraResumeUrl);

        window.open(openUrl, "_blank");
    }

    // Function added by Harris
    // to alert when download button is clicked
    onClickDownloadBtn() {
        // Export it as PDF
        pdfMake.createPdf(this.docDefinition).download(this.titlePdf);
        this.imgDataUrl = '';
    }


    //Comments Part
    getCommentsData() {
        type comments = {
            comId: number, name: string, staff_no: string, img: string, comment: string, date: string,
            likeCount: number, isLiked: number
        }
        let commentAry: comments[] = [];
        let postData = { id: this.idx };
        let getAdsComntAPI = ComVars.getAdsComntAPI;
        let imgSrc;
        this._POST_api_Service.POST_data(getAdsComntAPI, postData).subscribe(data => {

            for (let i = 0; i < data.length; i++) {
                let imgURL;

                imgURL = data[i].image_url;
                if (imgURL) {
                    imgSrc = this.imgAPIUrl + '/' + imgURL + '?api_key=' + GlobalVariable.API_KEY;
                }
                else
                    imgSrc = './assets/app/media/img/users/ghcm-user-default.jpg';

                commentAry.push({
                    comId: data[i].id, name: data[i].Name, staff_no: data[i].Staff_No,
                    img: imgSrc, comment: data[i].comment, date: data[i].update_on,
                    likeCount: data[i].likeCount, isLiked: data[i].isLiked
                })

            }

            this.commentsData = commentAry;
            this.commentLoading2 = false;

        });
    }

    newComment = false;
    get sortCommentsData() {
        return this.commentsData.sort((a, b) => {
            return <any>new Date(a.date) - <any>new Date(b.date);
        })
    }

    checkSameUser(staffNo) {
        let userId = JSON.parse(localStorage.getItem('currentUser')).userid;

        if (staffNo.toUpperCase() === userId.toUpperCase())
            return true;
        else
            return false;
    }
    now: any = new Date();
    before;
    older_24Hrs(date) {
        this.before = new Date(date);
        return ((this.now - this.before) > (1000 * 60 * 60 * 24)) ? true : false;
    }

    addComment() {
        let comnt = this.addComntForm.get('newComnt').value;
        document.getElementById('reset-btn').click();

        this.commentLoading2 = true;
        let addComntApi = ComVars.addCommentAPI;

        let post = {
            id: this.idx,
            comment: comnt
        }

        this._POST_api_Service.POST_data(addComntApi, post).subscribe(data => {
            this.getCommentsData();
            this.commentLoading2 = false;
        })
    }

    modalTitle: any;
    modalBody: any;
    delBtn = false;
    index: any; commentId: any;
    deleteCommentModal(index, comId) {
        this.index = index;
        this.commentId = comId;
        this.modalTitle = 'Delete';
        this.modalBody = 'Are you sure you want to delete this comment?';
        this.delBtn = true;
    }

    deleteComment() {
        let api = ComVars.delOwnCommentAPI;
        let data = { id: this.commentId }

        this._POST_api_Service.POST_data(api, data).subscribe(res => {
            this.commentsData.splice(this.index, 1);
            document.getElementById('close_btn').click();
            //this.getCommentsData();
        })
    }

    editModeClicked(index, comId) {
        $('#edit_' + this.commentId).removeClass('m--hide');
        $('#edit2_' + this.commentId).addClass('m--hide');

        this.index = index;
        this.commentId = comId;

        $('#edit_' + comId).addClass('m--hide');
        $('#edit2_' + comId).removeClass('m--hide');
    }

    updateComnt(index, comId) {
        this.index = index;
        this.commentId = comId;

        let updtdComnt = (<HTMLInputElement>document.getElementById("updComnt_" + comId)).value;

        let editOwnCommentAPI = ComVars.editOwnCommentAPI;

        let data = {
            id: this.commentId,
            comment: updtdComnt
        }

        this._POST_api_Service.POST_data(editOwnCommentAPI, data).subscribe(res => {
            this.commentsData[index].comment = updtdComnt;
            $('#edit_' + comId).removeClass('m--hide');
            $('#edit2_' + comId).addClass('m--hide');

        })

    }

    cancelUpdComnt(comId) {
        $('#edit_' + comId).removeClass('m--hide');
        $('#edit2_' + comId).addClass('m--hide');
    }

    likeClicked(index, comId) {
        let liked = this.commentsData[index].isLiked;
        let posData = {
            id: comId
        }

        if (liked) {
            let api = ComVars.dislikeACommentAPI;
            this._POST_api_Service.POST_data(api, posData).subscribe(res => {
                this.commentsData[index].isLiked = res[0].isLiked;
                this.commentsData[index].likeCount = res[0].likeCount;
            });
        }
        else {
            let api = ComVars.likeACommentAPI;
            this._POST_api_Service.POST_data(api, posData).subscribe(res => {
                this.commentsData[index].isLiked = res[0].isLiked;
                this.commentsData[index].likeCount = res[0].likeCount;
            });
        }
    }


    likeLoading = true;
    likedList;
    totalLikes;
    totalLikeClicked(index, comId) {
        this.likeLoading = true;
        let currUsrId = JSON.parse(localStorage.getItem('currentUser')).userid;
        this.totalLikes = this.commentsData[index].likeCount;

        type likes = {
            staffId: string, name: string, pos: string, isCircle: string, img: string; currUser: number
        }

        let likeAry: likes[] = [];

        let api = ComVars.getUserLikedComntAPI;
        let pos = {
            id: comId
        }

        let imgSrc; let sameUser;

        this._POST_api_Service.POST_data(api, pos).subscribe(data => {

            for (let i = 0; i < data.length; i++) {

                let imgURL = data[i].image_url;
                if (imgURL) {
                    imgSrc = GlobalVariable.BASE_API_URL + JobsVars.imgAPI + imgURL + '?api_key=' + GlobalVariable.API_KEY;
                }
                else
                    imgSrc = './assets/app/media/img/users/ghcm-user-default.jpg';

                if (data[i].Staff_No === currUsrId)
                    sameUser = 1;
                else
                    sameUser = 0;


                likeAry.push({
                    staffId: data[i].Staff_No, name: data[i].Name, pos: data[i].Post_Desc,
                    isCircle: data[i].isCircle, img: imgSrc, currUser: sameUser
                })
            }

            this.likedList = likeAry;
            this.likeLoading = false

        });

    }



}

