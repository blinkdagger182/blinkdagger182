import { ComponentFactoryResolver, Component, OnInit, ElementRef, ViewChild, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { INVars } from './mapsnetracking-vars';
import { IBVars } from '../mapsne-session/mapsne-session-vars';
import { LOB, lobArr } from "./arrCons";
import { GlobalVariable } from "../../../../../../environments/environment";
import { DatePipe } from '@angular/common';
import { Routes, Router, RouterModule, ActivatedRoute, NavigationStart, ActivatedRouteSnapshot, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
// import { Requestor, reqArr } from "./arrCons";
import { PagerService } from '../shared/pager/pager.component';
import { Headers, RequestOptions } from '@angular/http';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../../auth/_directives/alert.component';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { DataSource } from '@angular/cdk/table';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


import { CommentsModule } from '../../../user/user-job/comments/comments.module';

import * as jsPDF from 'jspdf';
import * as _html2canvas from "html2canvas";

declare var $: any;

//import jsPDF from 'jspdf';
//import html2canvas from 'html2canvas';

export interface IOption {
    name: string,
    positionId: string,
    positionName: string,
    status: string
}
export interface IOptionD {
    orgUnitDept: string
}
export interface IOptionU {
    orgUnit: string
}

@Component({
    selector: 'mapsne-tracking',
    templateUrl: './mapsne-tracking.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./mapsne-tracking.component.css']
})
export class MapsneTrackingComponent implements OnInit {

    @ViewChild('contentToConvert') contentToConvert: ElementRef;

    //loading: boolean = true;
    loadingEv: boolean = true;
    evData: boolean = false;

    // pager object
    pager: any = {};
    pageSize = 10;
    pagedItems: any[] = [];
    pager2: any = {};
    pageSize2 = 10;

    word: any;
    downloading3 = true;

    showTable = true;
    showEmpDetail = false;
    private readonly notifier: NotifierService;
    selBatchVal: any;
    data: any = {};
    data2;
    jrDeliverable;
    siDeliverable;
    stateInfo;

    userProfile;
    feedbackName;
    cursorType = 'default';
    rateZero = 0;
    userName = '';

    errMsg = '';
    errMsgUnexpected = 'Unexpected Error, please contact developer.'

    modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
        ]
    }

    ktOptionsJr = [
        {
            name: 'People',
            name_bh: 'Anggota',
            value: 1
        },
        {
            name: 'Customer',
            name_bh: 'Pelanggan',
            value: 2
        },
        {
            name: 'Business',
            name_bh: 'Perniagaan',
            value: 3
        }
    ];

    ktOptionsSi = [
        {
            name: 'Stretch Assignment',
            name_bh: 'Tugasan Tambahan',
            value: 1
        },
        {
            name: 'Cross Functional',
            name_bh: 'Fungsi Bersilang',
            value: 2
        },
        {
            name: 'Innovation',
            name_bh: 'Inovasi',
            value: 3
        }
    ];

    constructor(
        private pagerService: PagerService, private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service,
        private http: Http, private activeRoute: ActivatedRoute, private routers: Router,
        private datePipe: DatePipe, private _script: ScriptLoaderService,
        notifierService: NotifierService, private formBuilder: FormBuilder,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver) {
        this.notifier = notifierService;

        this.submitForm2 = this.formBuilder.group({
            //chkboxPos2: this.formBuilder.array([], )
        });
    }

    loading = true;
    loading2 = true;
    loading1 = true;
    downloading = true;
    downloading2 = true;
    displaybutton = false;
    displaybutton45 = false;



    filterForm: FormGroup;
    submitForm2: FormGroup;
    changeStatusForm: FormGroup;

    mySearch: string;
    userList = [];
    applLoading: boolean;
    imgOptArrList: any;

    applListCrData; applList45Data;
    MapsGetBasicInfo = INVars.MapsGetBasicInfo;
    getLOBAPI = INVars.getLOBJobAdsAPI;
    getmapsnesessionList = IBVars.getMAPSNESessionList;
    APIPostInfo = INVars.APIPostInfo;
    APIGetImg = INVars.APIGetImg;
    optLob: LOB = new LOB();
    //optLobList = Array<lobArr>();
    optLobList = [];
    descEmptyData = 'For better response, please customize your filter';
    descEmptyData2 = 'For better response, please customize your filter';
    selectDeptMult; selectUnitMult;
    ngOnInit() {
        //this.syncTokenMaps();
        this.checkLevel();
        this.filterForm = new FormGroup({
            fltrFormName: new FormControl('', Validators.required),
            filterLOB: new FormControl('', Validators.required),
            filterPernr: new FormControl('', Validators.required),
            filterStaff: new FormControl('', Validators.required),
            fltrStatus: new FormControl('', Validators.required),
        });

        this.filterForm.setValue({
            fltrFormName: (new Date()).getFullYear(),
            filterLOB: "",
            filterPernr: "",
            filterStaff: "",
            fltrStatus: "All",
        });

        this.loading = false;
        this.loading2 = false;

        this.data2 = [];
        this.jrDeliverable = [];
        this.siDeliverable = [];
        this.stateInfo = [];
        this.getState();
        this.getlob();
        this.getReportFilter();

        this.changeStatusForm = new FormGroup({
            routeStatus: new FormControl(''),
            remark: new FormControl('')
        })
    }


    // token for MAPS
    syncTokenMaps() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        let req = {
            staff_id: currentUser.userid,
            u_token: currentUser.token
        }

        this._POST_api_Service.POST_MAPS_data('/maps/facilitate/sync_token', req).subscribe(res => {
            if (res.status === 'OK') {//Do nothing
            }
        }, error => {
            console.log('[ERROR] cannot get token ' + error);
        })
    }


    setPage(page: number) {
        // get pager object from service
        this.pager = this.pagerService.getPager(this.data2.length, page, this.pageSize);
        // get current page of items
        this.pagedItems = this.data2.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    myrole;
    checkLevel() {
        let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role);
        if ((!/9/i.test(usrRole)) && (!/10/i.test(usrRole))) {
            this.routers.navigate(['/admin/unauthorized']);
            return false;
        }
        this.myrole = usrRole;
    }

    loadingState = true;
    getState() {
        type states = {
            value: number, status: string
        };

        let myarray: states[] = [];

        this._GET_api_Service.GET_MAPS_data(INVars.getStatusAPI).subscribe(data => {
            for (let i = 0; i < data.length; i++) {
                myarray.push({
                    value: data[i].value,
                    status: data[i].name
                });
            }

            this.stateInfo = myarray.slice();

        }, error => {
            console.log('[ERROR - Fail to get state] ' + error);
            this.loadingState = true;
        });
    }

    mylob = '';
    alllob = '';
    alllob2 = '';
    admintype;
    cntlob;
    loadingLob = true;
    getlob() {
        this._GET_api_Service.GET_MAPS_data(this.getLOBAPI).subscribe(data => {
            this.optLobList = data;
            this.loadingLob = false;
            if (data.length === 1) {
                this.admintype = this.optLobList[0].admin;
                this.mylob = this.optLobList[0].lob;
                this.alllob = this.optLobList[0].lob;
                this.alllob2 = "'" + this.optLobList[0].lob + "'";
                this.filterForm.patchValue({ filterLOB: this.alllob });
                this.cntlob = 1;
            }
            //if (data.length > 1){
            else {
                let ids = this.optLobList.map(function (item) {
                    return item['lob'];
                });
                let ids2 = this.optLobList.map(function (item) {
                    return "'" + item['lob'] + "'";
                });

                this.alllob = ids.join('|');
                this.alllob2 = ids2.join(',');
                this.admintype = this.optLobList[0].admin;
                this.cntlob = 99;
            }
        },
            error => {
                console.log('[ERROR - Get Lob List Talent HCBD] ' + error);
                this.loadingLob = true;
            }
        );
    }

    ds: any = {};
    ds2: any = {};
    formYear;

    getReportFilter() {
        type mapsnesession = {
            m_id: number, m_year: number, m_name: string, s_date_goalstg: Date, e_date_endyear: Date
        };
        let myarray: mapsnesession[] = [];
        this._GET_api_Service.GET_MAPS_data(this.getmapsnesessionList).subscribe(ds => {
            for (let i = 0; i < ds.length; i++) {
                myarray.push({
                    m_id: ds[i].id,
                    m_year: ds[i].year,
                    m_name: ds[i].name,
                    s_date_goalstg: ds[i].s_date_goalstg,
                    e_date_endyear: ds[i].e_date_endyear
                });
            }
            this.ds2 = myarray;
            this.setSessionList();
            this.loading = false;
        }, error => {
            console.log('[ERROR - Fail to get report filters] ' + error);
        });
    }

    sessionList: any[];

    setSessionList() {
        this.sessionList = this.ds2.slice();
    }


    //dx: any = {};
    dx2: any = {};

    empty = true;
    submitFilter(type) {
        //this.backToSearchTable();

        this.loading = true;
        this.loading1 = true;
        this.downloading3 = true;

        if (type == '1') {

            var persno = this.filterForm.get('filterPernr').value === '' ? null : this.filterForm.get('filterPernr').value;

            let isPersNoInputNumber;
            let dataPos = {};

            if (persno !== '') {

                if (persno !== null) {
                    isPersNoInputNumber = /^\d+$/.test(persno);

                    if (isPersNoInputNumber === false) {

                        this.notifier.notify('error', 'PersNo not in number format!');
                        return;
                    }
                }

            }


            dataPos = {
                Lob_Desc: this.filterForm.get('filterLOB').value === 'All' || this.filterForm.get('filterLOB').value === null || this.filterForm.get('filterLOB').value === '' ? '' : this.filterForm.get('filterLOB').value,
                TM_Band: '',
                Staff_no: this.filterForm.get('filterStaff').value,
                Pernr_No: this.filterForm.get('filterPernr').value === '' ? '' : this.filterForm.get('filterPernr').value,
                Year: this.filterForm.get('fltrFormName').value,
                Status: this.filterForm.get('fltrStatus').value,
            }

            type mapsnedata = {
                maps_year: number, maps_id: number, pers_no: number, staff_no: string, pers_name: string, ps_group: string,
                rept_to_pers_no: number, rept_to_name: string, comp_id: string, comp_desc: string,
                lob: string, division: string, department: string, unit: string, state: string,
                appraiser_pers_no: number, appraiser_pers_name: string, reviewer_pers_no: number,
                reviewer_pers_name: string, status: string, mid_year_perf_result: string, mid_year_completion_date: string,
                year_end_perf_result_reviewer: string,year_end_perf_result_reviewer_2nd: string, emp_acceptance: string, year_end_completion_date: string,year_end_completion_date_2nd: string,
                appraiser_comments: string, reviewer_comments: string, employee_comments: string, reject_reason: string,reviewer_comments_2nd: string,
            };

            let myarray: mapsnedata[] = [];

            this._POST_api_Service.POST_MAPS_data('/maps/admin/get_formsdata', dataPos).subscribe(dx => {

                for (let i = 0; i < dx.length; i++) {
                    myarray.push({
                        maps_year: dx[i].MAPS_YEAR,
                        maps_id: dx[i].MAPS_ID,
                        pers_no: dx[i].PERS_NO,
                        staff_no: dx[i].STAFF_NO,
                        pers_name: dx[i].PERS_NAME,
                        ps_group: dx[i].PSGROUP,
                        rept_to_pers_no: dx[i].REPT_TO_PERS_NO,
                        rept_to_name: dx[i].REPT_TO_NAME,
                        comp_id: dx[i].COMP_ID,
                        comp_desc: dx[i].COMP_DESC,
                        lob: dx[i].LOB,
                        division: dx[i].DIVISION,
                        department: dx[i].DEPARTMENT,
                        unit: dx[i].UNIT,
                        state: dx[i].STATE,
                        appraiser_pers_no: dx[i].APPRAISER_PERS_NO,
                        appraiser_pers_name: dx[i].APPRAISER_PERS_NAME,
                        reviewer_pers_no: dx[i].REVIEWER_PERS_NO,
                        reviewer_pers_name: dx[i].REVIEWER_PERS_NAME,
                        status: dx[i].STATUS,
                        mid_year_perf_result: dx[i].MID_YEAR_PERF_RESULT,
                        mid_year_completion_date: dx[i].MID_YEAR_COMPLETION_DATE,
                        year_end_perf_result_reviewer: dx[i].YEAR_END_PERF_RESULT_REVIEWER,
                        year_end_perf_result_reviewer_2nd: dx[i].YEAR_END_PERF_RESULT_REVIEWER_2nd,
                        emp_acceptance: dx[i].EMP_ACCEPTANCE,
                        year_end_completion_date: dx[i].YEAR_END_COMPLETION_DATE,
                        year_end_completion_date_2nd: dx[i].YEAR_END_COMPLETION_DATE_2nd,
                        appraiser_comments: dx[i].APPRAISER_COMMENTS,
                        reviewer_comments: dx[i].REVIEWER_COMMENTS,
                        reviewer_comments_2nd: dx[i].REVIEWER_COMMENTS_2nd,
                        employee_comments: dx[i].EMPLOYEE_COMMENTS,
                        reject_reason: dx[i].REJECT_REASON
                    });
                }

                this.data2 = myarray;

                this.setPage(1);
                this.loading = false;
                this.loading1 = false;
                this.downloading = false;
            }, error => {
                console.log('[ERROR - Fail to get report filters] ' + error);
            });

        }

        //reset form
        else if (type === 2) {

            this.filterForm.setValue({
                fltrFormName: (new Date()).getFullYear(),
                filterLOB: "",
                filterPernr: "",
                filterStaff: "",
                fltrStatus: "All",
            });

            this.loading = false;
            this.loading2 = false;
            this.displaybutton = false;
            this.displaybutton45 = false;
            this.data2 = [];
            this.setPage(1);
            this.pagedItems.length = 0;
            this.pager2.pages.length = 0;
            this.pager.pages.length = 0;

        }
    }

    download() {
        this.downloading = true;
        var csvData = this.ConvertToCSV(this.data2);
        var a = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob([csvData], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        let todayDate = new Date();
        let dateToday = (todayDate.getFullYear() + '' + ((todayDate.getMonth() + 1)) + '' + todayDate.getDate() + '' + todayDate.getHours() + '' + todayDate.getMinutes() + '' + todayDate.getSeconds());
        a.download = 'MAPSNE_' + dateToday + '.csv';
        a.click();
        this.downloading = false;
        return 'success';
    }

    // Content for PDF
    resumeUrl;
    userId;
    theDate;
    theTime;
    imgDataUrl;

    personalList = [];
    infoLoading = true;

    staffNo;
    openStaffInfo(personID) {

        this.staffNo = personID
        this.showTable = false;
        this.showEmpDetail = true;

        this.jrDeliverable = [];
        this.siDeliverable = [];

        this.personalList = [];
        this.getEvForm(personID);

        let dataPos = {
            staff_id: personID,
            year: this.filterForm.get('fltrFormName').value
        }

        this._POST_api_Service.POST_MAPS_data(this.MapsGetBasicInfo, dataPos).subscribe(dataRes => {
            this.personalList = dataRes.personalInfo;
            this._GET_api_Service.GET_Picture('/get/image/' + this.personalList[0].image_url).subscribe(data => {
                if (data) {
                    this.imgOptArrList = GlobalVariable.BASE_API_URL + this.APIGetImg + "/" + this.personalList[0].image_url + "?api_key=" + GlobalVariable.API_KEY;

                    this.imgDataUrl = '';
                    this._GET_api_Service.GET_Base64(data).subscribe(myData => {
                        this.imgDataUrl = myData;
                    }, error => {
                        this.imgDataUrl = 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCACCAGQDASIAAhEBAxEB/8QAGwABAAIDAQEAAAAAAAAAAAAAAAUGAQMEAgj/xAAzEAACAQMCAgkDAQkAAAAAAAAAAQIDBBESMQUhBhMVQVFhZKPhFCJxNSMyQnOBgrGy0f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD7LAAAAAAG8Bc0ABrqVqVPHWVIQztqkke4yUkmuae2AMgIAAAAAAAAAHsaq9aFGm6k5KKXibXsV3pBdxq1lbww1TfOXn4AeL3i9xcZjT/ZQ8nzf9SPnKU5OU5SlJ97eWYAGMG2hXrW+XRqSh+NjWAJu041CNKEK8ZOp/FLCxv/AMJmlONSnGcXmMllPxKWSXArvqbjqZyeifKOZYUQLIAAAAAAAA9ir8eVNcSno3wnL84LPOWmEpPuWSnXdZ17qpWw1rlnDewGsAAAAAMweJxaaWGubMAC50akalKM4yUk1utmezk4VFQsKKUnJaU8vzOsAAAAAA5+J/p9x/Lf+Colm47WdKwko7zej8LvKyAAAAAADNNKVSMXs2kYOnhdOVXiFGKjqxJSfhhbgWulThSpxhBYjFYSPQAAAAAABEdJot21KXdGeGQBaeM2/X2E1qacPvSS3x3FWAAAAAABL9G6LdWdxn7UtGMbtkTThKpVjCCzKTwi3WVvG2toUo9278WBvAAAAAAABiaTi09mioX9BW97UorZPl+HzLg8YIDpLGmqtKSkusaw15dwEQAAAAAlejdOErqpUksyhH7fLJYVsVzo7V0XkqWM9ZHfO2CxLYDIAAAAAcl9xC3tVJSmnUS/cW7Osq3Hf1Wt/b/qgNlbjN1OadOMacc7b5/JwVatStUc6knKT72zyAAAAAADMZSjJSi2muaZP8N4tSqU4wuZaKi5Z7pFfMY55Au2UZKtacUureDhqVSPdry8Fjsa6ubWFeKaUs8n5PAG4AACLv8AhH1V1Ov9Ro1Y5aM4wseJKACE7A9X7fyOwPV+38k2AITsD1ft/I7A9X7fyTYAhOwPV+38jsD1ft/JNgCE7A9X7fyOwPV+38k2AITsD1ft/JKWFv8AS2sKGvXpz92MZy8m8AAAAAAAAAAAAAAAAAAAAAAH/9k=';
                    });

                } else {
                    this.imgOptArrList = './assets/app/media/img/users/ghcm-user-default.jpg';
                    this.imgDataUrl = 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCACCAGQDASIAAhEBAxEB/8QAGwABAAIDAQEAAAAAAAAAAAAAAAUGAQMEAgj/xAAzEAACAQMCAgkDAQkAAAAAAAAAAQIDBBESMQUhBhMVQVFhZKPhFCJxNSMyQnOBgrGy0f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD7LAAAAAAG8Bc0ABrqVqVPHWVIQztqkke4yUkmuae2AMgIAAAAAAAAAHsaq9aFGm6k5KKXibXsV3pBdxq1lbww1TfOXn4AeL3i9xcZjT/ZQ8nzf9SPnKU5OU5SlJ97eWYAGMG2hXrW+XRqSh+NjWAJu041CNKEK8ZOp/FLCxv/AMJmlONSnGcXmMllPxKWSXArvqbjqZyeifKOZYUQLIAAAAAAAA9ir8eVNcSno3wnL84LPOWmEpPuWSnXdZ17qpWw1rlnDewGsAAAAAMweJxaaWGubMAC50akalKM4yUk1utmezk4VFQsKKUnJaU8vzOsAAAAAA5+J/p9x/Lf+Colm47WdKwko7zej8LvKyAAAAAADNNKVSMXs2kYOnhdOVXiFGKjqxJSfhhbgWulThSpxhBYjFYSPQAAAAAABEdJot21KXdGeGQBaeM2/X2E1qacPvSS3x3FWAAAAAABL9G6LdWdxn7UtGMbtkTThKpVjCCzKTwi3WVvG2toUo9278WBvAAAAAAABiaTi09mioX9BW97UorZPl+HzLg8YIDpLGmqtKSkusaw15dwEQAAAAAlejdOErqpUksyhH7fLJYVsVzo7V0XkqWM9ZHfO2CxLYDIAAAAAcl9xC3tVJSmnUS/cW7Osq3Hf1Wt/b/qgNlbjN1OadOMacc7b5/JwVatStUc6knKT72zyAAAAAADMZSjJSi2muaZP8N4tSqU4wuZaKi5Z7pFfMY55Au2UZKtacUureDhqVSPdry8Fjsa6ubWFeKaUs8n5PAG4AACLv8AhH1V1Ov9Ro1Y5aM4wseJKACE7A9X7fyOwPV+38k2AITsD1ft/I7A9X7fyTYAhOwPV+38jsD1ft/JNgCE7A9X7fyOwPV+38k2AITsD1ft/JKWFv8AS2sKGvXpz92MZy8m8AAAAAAAAAAAAAAAAAAAAAAH/9k=';
                }
            },
                error => {
                    this.imgOptArrList = './assets/app/media/img/users/ghcm-user-default.jpg';
                    this.imgDataUrl = 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCACCAGQDASIAAhEBAxEB/8QAGwABAAIDAQEAAAAAAAAAAAAAAAUGAQMEAgj/xAAzEAACAQMCAgkDAQkAAAAAAAAAAQIDBBESMQUhBhMVQVFhZKPhFCJxNSMyQnOBgrGy0f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD7LAAAAAAG8Bc0ABrqVqVPHWVIQztqkke4yUkmuae2AMgIAAAAAAAAAHsaq9aFGm6k5KKXibXsV3pBdxq1lbww1TfOXn4AeL3i9xcZjT/ZQ8nzf9SPnKU5OU5SlJ97eWYAGMG2hXrW+XRqSh+NjWAJu041CNKEK8ZOp/FLCxv/AMJmlONSnGcXmMllPxKWSXArvqbjqZyeifKOZYUQLIAAAAAAAA9ir8eVNcSno3wnL84LPOWmEpPuWSnXdZ17qpWw1rlnDewGsAAAAAMweJxaaWGubMAC50akalKM4yUk1utmezk4VFQsKKUnJaU8vzOsAAAAAA5+J/p9x/Lf+Colm47WdKwko7zej8LvKyAAAAAADNNKVSMXs2kYOnhdOVXiFGKjqxJSfhhbgWulThSpxhBYjFYSPQAAAAAABEdJot21KXdGeGQBaeM2/X2E1qacPvSS3x3FWAAAAAABL9G6LdWdxn7UtGMbtkTThKpVjCCzKTwi3WVvG2toUo9278WBvAAAAAAABiaTi09mioX9BW97UorZPl+HzLg8YIDpLGmqtKSkusaw15dwEQAAAAAlejdOErqpUksyhH7fLJYVsVzo7V0XkqWM9ZHfO2CxLYDIAAAAAcl9xC3tVJSmnUS/cW7Osq3Hf1Wt/b/qgNlbjN1OadOMacc7b5/JwVatStUc6knKT72zyAAAAAADMZSjJSi2muaZP8N4tSqU4wuZaKi5Z7pFfMY55Au2UZKtacUureDhqVSPdry8Fjsa6ubWFeKaUs8n5PAG4AACLv8AhH1V1Ov9Ro1Y5aM4wseJKACE7A9X7fyOwPV+38k2AITsD1ft/I7A9X7fyTYAhOwPV+38jsD1ft/JNgCE7A9X7fyOwPV+38k2AITsD1ft/JKWFv8AS2sKGvXpz92MZy8m8AAAAAAAAAAAAAAAAAAAAAAH/9k=';
                    console.log('[ERROR Get Image]' + error);
                });

            this.infoLoading = false;

        },
            error => {
                this.infoLoading = false;
                console.log('[ERROR - Get list of performance] ' + error);

            });

        //let applDetailsSend = this._POST_api_Service.POST_data(SVars.getStaffDetailsAPI, data);

    }


    // to get evaluation MAPS form for employee
    EmpEvFormZero = ['1', '2', '3'];
    EmpEvFormOne = ['2', '3'];
    evMapsForm;
    evMapsFormName = null;
    evMapsFormFormId = null;
    evMapsFOrmDueDate = null;
    evMapsFormLastModf = null;
    evMapsFormStatus = '';
    jobResList = [];
    DeliverableList = [];
    sigInvList = [];
    empProgBar = 1;
    showRemark = false;
    image_url;
    getEvForm(candidate) {
        this.loading = true;
        let data = {
            staff_id: candidate,
            year: this.filterForm.get('fltrFormName').value,
            auth_no: JSON.parse(localStorage.getItem('currentUser')).body.gemsId

        }
        this._POST_api_Service.POST_MAPS_data(INVars.GETEvaluationForm ,data).subscribe(res => {

            if (res) this.evMapsForm = res;
            if (res.name) this.evMapsFormName = res.name;
            if (res.jr) this.jobResList = res.jr;
            if (res.si) this.sigInvList = res.si;
            if (res.due_date) this.evMapsFOrmDueDate = res.due_date.split("T")[0].split('-').reverse().join('/');
            if (res.last_updated_on) this.evMapsFormLastModf = res.last_updated_on.split("T")[0].split('-').reverse().join('/');
            if (res.status_id) this.empProgBar = res.status_id;
            if (res.maps_form_id) this.evMapsFormFormId = res.maps_form_id;
            if (res.status) this.evMapsFormStatus = res.status
            if ((this.empProgBar === 1 && res.sv_rv_rmk) || (this.empProgBar === 3 && res.midyr_sv_rv_rmk) || (this.empProgBar === 5 && res.endyr_sv_rv_rmk)) this.showRemark = true;
            if (this.empProgBar > 2 && this.evMapsFormFormId) this.getOverallRating(this.evMapsFormFormId)
            if (res.status_id > 2) this.getCompetency();

            setTimeout(() => {
                if (res.comment) $(".evMapsFormComment").html(res.comment);
                if (res.sv_cmt) $(".evMapsFormSvComment").html(res.sv_cmt);
                if (res.midyr_ee_cmt) $(".evMapsFormMidYrComment").html(res.midyr_ee_cmt);
                if (res.midyr_sv_cmt) $(".evMapsFormMidYrSvComment").html(res.midyr_sv_cmt);
                if (res.endyr_ee_cmt) $(".evMapsFormEndYrComment").html(res.endyr_ee_cmt);
                if (res.endyr_sv_cmt) $(".evMapsFormEndYrSvComment").html(res.endyr_sv_cmt);
                if (res.f_revr_cmt) $(".evMapsFormReviewerComment").html(res.f_revr_cmt);
            }, 3000);

            this.theDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy h:mm a');
            this.titlePdf = `MAPS NE FORM ${res.year} - ${res.staff_id}.pdf`;
            setTimeout(() => {
                this.downloading3 = false;
                let profile_img = this.imgDataUrl;
                this.docDefinition = {
                    pageSize: 'A4',
                    pageMargins: [20, 90],
                    watermark: { text: `By: ${this.staff_no}@${this.theDate}`, color: '#e0e0d1', opacity: 0.3, bold: true },
                    header: {},
                    footer: function (currentPage, pageCount) {
                        return {
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
                            color: '#234a86',
                            fontSize: 16,
                            bold: true,
                            alignment: 'center',
                            margin: [0, 20, 0, 0]

                        },
                        profile_name: {
                            bold: true,
                            color: '#black',
                            fontSize: 12,
                            alignment: 'left',
                        },
                        header: {
                            color: '#234a86',
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
                            fontSize: 12,
                        },
                        lst_title2: {
                            fontSize: 11,
                            bold: false,
                            color: '#5c6066',
                        },
                        lst_data2: {
                            bold: true,
                            fontSize: 11,
                            margin: [20, 0, 0, 5]
                        },
                        lst_data_color: {
                            bold: true,
                            fontSize: 11,
                            color: '#fd5806'
                        },
                        red10: {
                            fontSize: 10,
                            color: 'black',
                            // bold: true
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
                        body: [
                            [{ rowSpan: 3, text: `MAPS NE FORM - ${this.evMapsFormFormId}`, style: 'era_title' }, '', { rowSpan: 3, image: 'logoTM', fit: [100, 100] }],
                            [{ text: `` }, '', ''],
                            [{ text: ``, margin: [0, 0, 0, 10], bold: true }, '', ''],
                            [{ colSpan: 3, text: '', fillColor: '#234a86' }]
                        ]
                    },
                    layout: 'noBorders',
                    margin: [20, 20, 20, 40]
                };

                // Populate the content of PDF
                let myContent;
                this.docDefinition.content = [];

                myContent = [
                    { // myContent[0]
                        columns: [
                            { // columns[0]
                                width: 165,
                                alignment: 'center',
                                table: {
                                    width: ['auto'],
                                    body: [
                                        [{ image: profile_img, width: 95, height: 95 }],
                                        [{ text: '', fillColor: '#234a86' }],
                                        [{ text: `MAPS NE PROFILE`, style: 'profile_name' }],
                                        [{ text: '', fillColor: '#234a86' }],
                                        [{ columns: [{ width: 50, text: `Name `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${res.name} `, style: 'blackSize10' },] }],
                                        [{ columns: [{ width: 50, text: `Staff ID `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${res.staff_id} `, style: 'blackSize10' },] }],
                                        [{ columns: [{ width: 50, text: `Form ID `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${res.maps_form_id} `, style: 'blackSize10' },] }],
                                        [{ columns: [{ width: 50, text: `Year `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${res.year} `, style: 'blackSize10' },] }],
                                        [{ columns: [{ width: 50, text: `Status `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${res.status_id} - ${res.status} `, style: 'blackSize10' },] }],
                                        [{ columns: [{ width: 50, text: `Unit `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${this.personalList[0].sub_org_unit_desc} `, style: 'blackSize10' },] }],
                                        [{ columns: [{ width: 50, text: `Division `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${this.personalList[0].org_unit_desc} `, style: 'blackSize10' },] }],
                                        [{ text: '', fillColor: '#234a86' }],
                                        [{ columns: [{ width: 50, text: `Appraiser `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${res.eval1[0].Name} `, style: 'blackSize10' },] }],
                                        [{ columns: [{ width: 50, text: `Staff ID`, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${res.eval1[0].Staff_No} `, style: 'blackSize10' },] }],
                                        [{ text: '', fillColor: '#234a86' }],
                                        [{ columns: [{ width: 50, text: `Reviewer `, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${res.eval2[0].Name} `, style: 'blackSize10' },] }],
                                        [{ columns: [{ width: 50, text: `Staff ID`, style: 'greySize10' }, { width: 5, text: ':', style: 'blackSize10' }, { text: `${res.eval2[0].Staff_No} `, style: 'blackSize10' },] }],
                                        [{ text: '', fillColor: '#234a86' }],
                                    ]
                                },
                                layout: 'noBorders',
                            },
                            { // colums[1]
                                width: 'auto', margin: 5,
                                type: 'none',
                                ul: [
                                    {   //ul[0]
                                        table: {
                                            body: [
                                                [{ text: '1.0 Job Responsibility', style: 'header' }]
                                            ]
                                        }, layout: 'noBorders',
                                    },
                                    {   //ul[1]
                                        text: '\n'
                                    },
                                    {   //ul[2]
                                        type: 'none',
                                        ul: [
                                            { text: [{ text: `1.1.    `, style: 'red10' }, { text: 'No Data\n', style: 'lst_title' }] }
                                        ]
                                    },

                                    {   //ul[3]
                                        text: '\n\n'
                                    },

                                    {   //ul[4]
                                        table: {
                                            body: [
                                                [{ text: '2.0 Significant Involvement (if any)', style: 'header' }]
                                            ]
                                        }, layout: 'noBorders',
                                    },
                                    {   //ul[5]
                                        text: '\n'
                                    },
                                    {   //ul[6]
                                        type: 'none',
                                        ul: [
                                            { text: [{ text: `2.1.    `, style: 'red10' }, { text: 'No Data\n', style: 'lst_title' }] }
                                        ]
                                    },

                                    {   //ul[7]
                                        text: '\n\n'
                                    },

                                    {   //ul[8]
                                        table: {
                                            body: [
                                                [{ text: '3.0 Competency', style: 'header' }]
                                            ]
                                        }, layout: 'noBorders',
                                    },
                                    {   //ul[9]
                                        text: '\n'
                                    },
                                    {   //ul[10]
                                        type: 'none',
                                        ul: [
                                            { text: [{ text: `3.1.    `, style: 'red10' }, { text: 'No Data\n', style: 'lst_title' }] }
                                        ]
                                    },
                                    {   //ul[11]
                                        text: '\n\n'
                                    },

                                    {   //ul[12]
                                        table: {
                                            body: [
                                                [{ text: 'OVERALL RATINGS', style: 'header' }]
                                            ]
                                        }, layout: 'noBorders',
                                    },
                                    {   //ul[13]
                                        text: '\n'
                                    },
                                    {   //ul[14]
                                        type: 'none',
                                        ul: [
                                            { text: [{ text: `    `, style: 'red10' }, { text: 'No Data\n', style: 'lst_title' }] }
                                        ]
                                    }
                                ]

                            },

                        ]
                    },

                ];


                // Populate - 1.0 job responsibility (ul[2])              
                if (res.jr.length > 0) {
                    if (res.jr.length === 1) {
                        myContent[0].columns[1].ul[2] = [{
                            text: [
                                {
                                    text: [
                                        { text: `1.1: `, style: 'lst_data' }, { text: `${res.jr[0].name}`, style: 'lst_data' },
                                    ]
                                },
                                { text: '\n' },
                                {
                                    text: [
                                        { text: `KPI: `, style: 'red10' }, { text: `${res.jr[0].kpi}`, style: 'red10' },
                                        { text: '\n' },
                                        { text: `METRIC/MEASURE: `, style: 'red10' }, { text: `${res.jr[0].metric} %`, style: 'red10' },
                                        { text: '\n' },
                                        { text: `TARGET: `, style: 'red10' }, { text: `${res.jr[0].tgt}`, style: 'red10' },
                                        { text: '\n' },
                                        { text: `WEIGHTAGE: `, style: 'red10' }, { text: `${res.jr[0].wt} %`, style: 'red10' },
                                        { text: '\n' },
                                        { text: `MID-YEAR APPRAISEE: `, style: 'red10' }, { text: res.status_id > 3 ? `${res.jr[0].midyr_ee_rat}/4 ratings` : 'No Data', style: 'red10' },
                                        { text: '\n' },
                                        { text: `MID-YEAR APPRAISER: `, style: 'red10' }, { text: res.status_id > 4 ? `${res.jr[0].midyr_sv_rat}/4 ratings` : 'No Data', style: 'red10' },
                                        { text: '\n' },
                                        { text: `END YEAR APPRAISEE: `, style: 'red10' }, { text: res.status_id > 5 ? `${res.jr[0].endyr_ee_rat}/4 ratings` : 'No Data', style: 'red10' },
                                        { text: '\n' },
                                        { text: `END YEAR APPRAISER: `, style: 'red10' }, { text: res.status_id > 6 ? `${res.jr[0].endyr_sv_rat}/4 ratings` : 'No Data', style: 'red10' },
                                    ]
                                }
                            ]
                        }];
                    } else {
                        myContent[0].columns[1].ul[2] = [];
                        for (let i = 0; i < res.jr.length; i++) {
                            myContent[0].columns[1].ul[2].push({
                                text: [
                                    {
                                        text: [
                                            { text: `1.${i + 1}: `, style: 'lst_data' }, { text: `${res.jr[i].name}`, style: 'lst_data' },
                                        ]
                                    },
                                    { text: '\n' },
                                    {
                                        text: [
                                            { text: `KPI: `, style: 'red10' }, { text: `${res.jr[i].kpi}`, style: 'red10' },
                                            { text: '\n' },
                                            { text: `METRIC/MEASURE: `, style: 'red10' }, { text: `${res.jr[i].metric} %`, style: 'red10' },
                                            { text: '\n' },
                                            { text: `TARGET: `, style: 'red10' }, { text: `${res.jr[i].tgt}`, style: 'red10' },
                                            { text: '\n' },
                                            { text: `WEIGHTAGE: `, style: 'red10' }, { text: `${res.jr[i].wt} %`, style: 'red10' },
                                            { text: '\n' },
                                            { text: `MID-YEAR APPRAISEE: `, style: 'red10' }, { text: res.status_id > 3 ? `${res.jr[i].midyr_ee_rat}/4 ratings` : 'No Data', style: 'red10' },
                                            { text: '\n' },
                                            { text: `MID-YEAR APPRAISER: `, style: 'red10' }, { text: res.status_id > 4 ? `${res.jr[i].midyr_sv_rat}/4 ratings` : 'No Data', style: 'red10' },
                                            { text: '\n' },
                                            { text: `END YEAR APPRAISEE: `, style: 'red10' }, { text: res.status_id > 5 ? `${res.jr[i].endyr_ee_rat}/4 ratings` : 'No Data', style: 'red10' },
                                            { text: '\n' },
                                            { text: `END YEAR APPRAISER: `, style: 'red10' }, { text: res.status_id > 6 ? `${res.jr[i].endyr_sv_rat}/4 ratings` : 'No Data', style: 'red10' },
                                            { text: '\n' },
                                            { text: '\n' },
                                        ]
                                    }
                                ]
                            })
                        }
                    }
                }

                // Populate - 2.0 significant involvement (ul[6])              
                if (res.si.length > 0) {
                    if (res.si.length === 1) {
                        myContent[0].columns[1].ul[6] = [{
                            text: [
                                {
                                    text: [
                                        { text: `2.1: `, style: 'lst_data' }, { text: `${res.si[0].name}`, style: 'lst_data' },
                                    ]
                                },
                                { text: '\n' },
                                {
                                    text: [
                                        { text: `KPI: `, style: 'red10' }, { text: `${res.si[0].kpi}`, style: 'red10' },
                                        { text: '\n' },
                                        { text: `METRIC/MEASURE: `, style: 'red10' }, { text: `${res.si[0].metric} %`, style: 'red10' },
                                        { text: '\n' },
                                        { text: `TARGET: `, style: 'red10' }, { text: `${res.si[0].tgt}`, style: 'red10' },
                                        { text: '\n' },
                                        { text: `WEIGHTAGE: `, style: 'red10' }, { text: `${res.si[0].wt} %`, style: 'red10' },
                                        { text: '\n' },
                                        { text: `MID-YEAR APPRAISEE: `, style: 'red10' }, { text: res.status_id > 3 ? `${res.si[0].midyr_ee_rat}/4 ratings` : 'No Data', style: 'red10' },
                                        { text: '\n' },
                                        { text: `MID-YEAR APPRAISER: `, style: 'red10' }, { text: res.status_id > 4 ? `${res.si[0].midyr_sv_rat}/4 ratings` : 'No Data', style: 'red10' },
                                        { text: '\n' },
                                        { text: `END YEAR APPRAISEE: `, style: 'red10' }, { text: res.status_id > 5 ? `${res.si[0].endyr_ee_rat}/4 ratings` : 'No Data', style: 'red10' },
                                        { text: '\n' },
                                        { text: `END YEAR APPRAISER: `, style: 'red10' }, { text: res.status_id > 6 ? `${res.si[0].endyr_sv_rat}/4 ratings` : 'No Data', style: 'red10' },
                                    ]
                                }
                            ]
                        }];
                    } else {
                        myContent[0].columns[1].ul[6] = [];
                        for (let i = 0; i < res.si.length; i++) {
                            myContent[0].columns[1].ul[6].push({
                                text: [
                                    {
                                        text: [
                                            { text: `2.${i + 1}: `, style: 'lst_data' }, { text: `${res.si[i].name}`, style: 'lst_data' },
                                        ]
                                    },
                                    { text: '\n' },
                                    {
                                        text: [
                                            { text: `KPI: `, style: 'red10' }, { text: `${res.si[i].kpi}`, style: 'red10' },
                                            { text: '\n' },
                                            { text: `METRIC/MEASURE: `, style: 'red10' }, { text: `${res.si[i].metric} %`, style: 'red10' },
                                            { text: '\n' },
                                            { text: `TARGET: `, style: 'red10' }, { text: `${res.si[i].tgt}`, style: 'red10' },
                                            { text: '\n' },
                                            { text: `WEIGHTAGE: `, style: 'red10' }, { text: `${res.si[i].wt} %`, style: 'red10' },
                                            { text: '\n' },
                                            { text: `MID-YEAR APPRAISEE: `, style: 'red10' }, { text: res.status_id > 3 ? `${res.si[i].midyr_ee_rat}/4 ratings` : 'No Data', style: 'red10' },
                                            { text: '\n' },
                                            { text: `MID-YEAR APPRAISER: `, style: 'red10' }, { text: res.status_id > 4 ? `${res.si[i].midyr_sv_rat}/4 ratings` : 'No Data', style: 'red10' },
                                            { text: '\n' },
                                            { text: `END YEAR APPRAISEE: `, style: 'red10' }, { text: res.status_id > 5 ? `${res.si[i].endyr_ee_rat}/4 ratings` : 'No Data', style: 'red10' },
                                            { text: '\n' },
                                            { text: `END YEAR APPRAISER: `, style: 'red10' }, { text: res.status_id > 6 ? `${res.si[i].endyr_sv_rat}/4 ratings` : 'No Data', style: 'red10' },
                                            { text: '\n' },
                                            { text: '\n' },
                                        ]
                                    }
                                ]
                            })
                        }
                    }
                }

                // Populate - 3.0 competency (ul[10])              
                if (res.status_id > 2) {

                    myContent[0].columns[1].ul[10] = [];
                    for (let i = 0; i < this.compeList.length; i++) {
                        myContent[0].columns[1].ul[10].push({
                            text: [
                                {
                                    text: [
                                        { text: `3.${i + 1}: `, style: 'lst_data' }, { text: `${this.compeList[i].competency}`, style: 'lst_data' },
                                    ]
                                },
                                { text: '\n' },
                                {
                                    text: [
                                        { text: `COMPETENCY LEVEL: `, style: 'red10' }, { text: `${this.compeList[i].cc_just[0].justification}`, style: 'red10' },
                                        { text: '\n' },
                                        { text: `DESCRIPTION: `, style: 'red10' }, { text: `${this.compeList[i].desc}`, style: 'red10' },
                                        { text: '\n' },
                                        { text: `MID-YEAR APPRAISEE: `, style: 'red10' }, { text: res.status_id > 3 ? `${this.compeList[i].midyr_ee_rat}/4 ratings` : 'No Data', style: 'red10' },
                                        { text: '\n' },
                                        { text: `MID-YEAR APPRAISER: `, style: 'red10' }, { text: res.status_id > 4 ? `${this.compeList[i].midyr_sv_rat}/4 ratings` : 'No Data', style: 'red10' },
                                        { text: '\n' },
                                        { text: `END YEAR APPRAISEE: `, style: 'red10' }, { text: res.status_id > 5 ? `${this.compeList[i].endyr_ee_rat}/4 ratings` : 'No Data', style: 'red10' },
                                        { text: '\n' },
                                        { text: `END YEAR APPRAISER: `, style: 'red10' }, { text: res.status_id > 6 ? `${this.compeList[i].endyr_sv_rat}/4 ratings` : 'No Data', style: 'red10' },
                                        { text: '\n' },
                                        { text: '\n' },
                                    ]
                                }
                            ]
                        })
                    }

                }

                // Populate - overall ratings (ul[14])              
                if (res.status_id > 2) {

                    myContent[0].columns[1].ul[14] = [];
                    myContent[0].columns[1].ul[14].push({
                        text: [
                            {
                                text: [
                                    { text: `OVERALL RATING  BY APPRAISEE: `, style: 'lst_data' }
                                ]
                            },
                            { text: '\n' },
                            {
                                text: [
                                    { text: `MID YEAR: `, style: 'red10' }, { text: res.status_id > 3 ? `${this.overalRatObj[0].midyr_ee_rat}/4 ratings` : 'No Data', style: 'red10' },
                                    { text: '\n' },
                                    { text: `END YEAR: `, style: 'red10' }, { text: res.status_id > 5 ? `${this.overalRatObj[0].endyr_ee_rat}/4 ratings` : 'No Data', style: 'red10' },
                                    { text: '\n' },
                                    { text: '\n' },
                                ]
                            },
                            {
                                text: [
                                    { text: `OVERALL RATING  BY APPRAISER: `, style: 'lst_data' }
                                ]
                            },
                            { text: '\n' },
                            {
                                text: [
                                    { text: `MID YEAR: `, style: 'red10' }, { text: res.status_id > 4 ? `${this.overalRatObj[0].midyr_sv_rat}/4 ratings` : 'No Data', style: 'red10' },
                                    { text: '\n' },
                                    { text: `END YEAR: `, style: 'red10' }, { text: res.status_id > 6 ? `${this.overalRatObj[0].endyr_sv_rat}/4 ratings` : 'No Data', style: 'red10' },
                                    { text: '\n' },
                                    { text: '\n' },
                                ]
                            },
                            {
                                text: [
                                    { text: `OVERALL RATING  BY REVIEWER: `, style: 'lst_data' }
                                ]
                            },
                            { text: '\n' },
                            {
                                text: [
                                    { text: `END YEAR: `, style: 'red10' }, { text: res.status_id > 7 ? `${this.overalRatObj[0].f_revr_rat}/4 ratings` : 'No Data', style: 'red10' },
                                    { text: '\n' },
                                    { text: '\n' },
                                ]
                            }
                        ]
                    })

                }
                this.docDefinition.content.push(myContent);
            }, 1500);

            this.getImgOpt();

            this.getDeliverables();

        }, error => {
            console.log('[ERROR] cannot get evaluation form MAPS ' + error);
            console.log('this', JSON.parse(error._body)) // to show error body
        })
    }

    // get data before view modal for appraise
    viewDetailData = []
    viewDetailDeliverData = []
    viewDetailJustData = []
    apprId;
    apprType;
    viewModalApprais(num, type) {
        this.viewDetailData = [];
        this.viewDetailDeliverData = [];
        this.viewDetailJustData = [];
        this.apprType = type;
        this.apprId = num;

        let apiReq;
        if (this.empProgBar < 5) apiReq = INVars.POSTGetMidYearAppraiseeSupv;
        if (this.empProgBar > 4) apiReq = INVars.POSTGetEndYearAppraiseeSupv;

        let req = {
            id: num,
            type: type
        }

        this._POST_api_Service.POST_MAPS_data(apiReq, req).subscribe(res => {

            if (res) this.viewDetailData.push(res);
            if (res.deliverable) this.viewDetailDeliverData = res.deliverable;
            if (res.justification) this.viewDetailJustData = res.justification;

            if (this.viewDetailData.length > 0) {

                if (type === 'CC') $('#viewDetailCcBtn').click()
                else $('#viewDetailJrSiBtn').click()


            }
        }, error => {
            console.log('[ERROR] cannot view detail ' + error);
        })
    }

    // to get competency list by ev form id
    getDeliverables() {
        type jrDeliverableData = { id: number, form_id: number, jr_seq: number, seq: number, task: string, due_date: string, completion: number };

        let myarray: jrDeliverableData[] = [];

        let apiReq;
        if (this.empProgBar < 5) apiReq = INVars.POSTGetMidYearAppraiseeSupv;
        if (this.empProgBar > 4) apiReq = INVars.POSTGetEndYearAppraiseeSupv;

        for (let j = 0; j < this.jobResList.length; j++) {

            let req = {
                id: this.jobResList[j].id,
                type: 'JR'
            }

            this._POST_api_Service.POST_MAPS_data(apiReq, req).subscribe(res => {

                if (res.deliverable) {

                    for (let i = 0; i < res.deliverable.length; i++) {
                        myarray.push({
                            id: this.jobResList[j].id,
                            form_id: res.deliverable[i].form_id,
                            jr_seq: res.deliverable[i].jr_seq,
                            seq: res.deliverable[i].seq,
                            task: res.deliverable[i].task,
                            due_date: res.deliverable[i].due_date,
                            completion: res.deliverable[i].completion
                        });
                    }

                }

                if (this.empProgBar === 3) this.appraisRat = res.midyr_ee_rat;
                if (this.empProgBar === 4) this.appraisRat = res.midyr_sv_rat;
                if (this.empProgBar === 5) this.appraisRat = res.endyr_ee_rat;
                if (this.empProgBar === 6) this.appraisRat = res.endyr_sv_rat;

            }, error => {
                console.log('[ERROR] cannot view detail ' + error);
            });

        }

        this.jrDeliverable = myarray;

        type siDeliverableData = { id: number, form_id: number, si_seq: number, seq: number, task: string, due_date: string, completion: number };

        let myarray2: siDeliverableData[] = [];

        for (let k = 0; k < this.sigInvList.length; k++) {

            let req = {
                id: this.sigInvList[k].id,
                type: 'SI'
            }

            this._POST_api_Service.POST_MAPS_data(apiReq, req).subscribe(res => {

                if (res.deliverable) {

                    for (let l = 0; l < res.deliverable.length; l++) {
                        myarray2.push({
                            id: this.sigInvList[k].id,
                            form_id: res.deliverable[l].form_id,
                            si_seq: res.deliverable[l].si_seq,
                            seq: res.deliverable[l].seq,
                            task: res.deliverable[l].task,
                            due_date: res.deliverable[l].due_date,
                            completion: res.deliverable[l].completion
                        });
                    }

                }

            }, error => {
                console.log('[ERROR] cannot view detail ' + error);
            });

        }

        this.siDeliverable = myarray2;

    }

    fltrDeliverbales(jsDArr, jsRid) {

        return jsDArr.filter(t => t.id === jsRid);

    }

    // to get competency list by ev form id
    compeList = [];
    getCompetency() {
        // this.loading = true;
        this._GET_api_Service.GET_MAPS_data(INVars.GETCompetencyList + this.evMapsFormFormId).subscribe(res => {

            if (res) {
                this.compeList = res.cc_tmt
                this.cursorType = 'default'
            }

        }, error => {
            console.log('[ERROR] cannot get competency ' + error);
        })
    }

    // to get image of employee and evaluator
    profileImgEmp;
    profileImgEva;
    getImgOpt() {
        let evalOne = GlobalVariable.BASE_API_URL + INVars.GETImg + this.evMapsForm.eval1[0].img_url + "?api_key=" + GlobalVariable.API_KEY;
        this._GET_api_Service.GET_PictureByUrl(evalOne).subscribe(data => {
            if (data) this.profileImgEmp = evalOne;
            else this.profileImgEmp = '../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
            this.loading = false;
        },
            error => {
                this.profileImgEmp = '../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
                this.loading = false;
            });
        let evalTwo = GlobalVariable.BASE_API_URL + INVars.GETImg + this.evMapsForm.eval2[0].img_url + "?api_key=" + GlobalVariable.API_KEY;
        this._GET_api_Service.GET_PictureByUrl(evalTwo).subscribe(data => {
            if (data) this.profileImgEva = evalTwo;
            else this.profileImgEva = '../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
            this.loading = false;
        },
            error => {
                this.profileImgEva = '../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
                this.loading = false;
            });
    }
    // back to search table
    backToSearchTable() {
        this.showTable = true;
        this.showEmpDetail = false;
    }

    // show rating description when click the rating (not satisfy - excellent)
    appraisRat = 0
    finRat = 0
    proposEmpRat = 0;
    proposEvOneRat = 0;
    proposEvTwoRat = 0;
    overalRatObj = []
    getOverallRating(num) {
        this.overalRatObj = []
        this._GET_api_Service.GET_MAPS_data(INVars.GETReviewerRatingAll + num).subscribe(res => {
            this.overalRatObj.push(res)
            if (res.endyr_ee_rat) this.proposEmpRat = res.endyr_ee_rat;
            if (res.endyr_sv_rat) this.proposEvOneRat = res.endyr_sv_rat;
            if (res.f_revr_rat) this.proposEvTwoRat = res.f_revr_rat;

        }, error => {
            console.log('[ERROR] cannot get overall rating ' + error);
        })

    }

    downloadCSV = true;
    ConvertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = ''; var row = "";

        for (var index in objArray[0]) {
            if ((index !== 'st_date2') && (index !== 'end_date2')) {
                row += index + ',';//Now convert each value to string and comma-separated
            }
        }
        row = row.slice(0, -1);
        //append Label row with line break
        str += row + '\r\n';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','
                //line += '"' + array[i][index] + '"';
                if ((index !== 'st_date2') && (index !== 'end_date2')) {
                    line += '"' + array[i][index] + '"';
                }
            }
            str += line + '\r\n';
        }
        return str;
    }

    loadingAllBatch = true;
    allbatchInfo;


    modalTitle; isAddData;
    deptList: any = [];
    fltrDept2;

    // to get screen width
    windowWidth = window.innerWidth;
    mediaWidth() {
        this.windowWidth = window.innerWidth
    }
    // button on progress bar blue
    scrollValue: number = 0
    widthBar;
    scrolllLeft() {
        if (this.windowWidth > 1500) this.widthBar = 900
        else if (this.windowWidth > 1200 && this.windowWidth < 1501) this.widthBar = window.innerWidth
        else if (this.windowWidth > 1000 && this.windowWidth < 1201) this.widthBar = window.innerWidth + 300
        else this.widthBar = window.innerWidth + 600

        if (this.scrollValue > -1 && this.scrollValue <= this.widthBar) this.scrollValue = this.scrollValue - 80
        else if (this.scrollValue < 0) this.scrollValue = 0
        else if (this.scrollValue > this.widthBar) this.scrollValue = 800
        this.valueScroll()
    }
    scrollRight() {
        if (this.windowWidth > 1500) this.widthBar = 1000
        else if (this.windowWidth > 1200 && this.windowWidth < 1501) this.widthBar = window.innerWidth
        else if (this.windowWidth > 1000 && this.windowWidth < 1201) this.widthBar = window.innerWidth + 300
        else this.widthBar = window.innerWidth + 600

        if (this.scrollValue > -1 && this.scrollValue <= this.widthBar) this.scrollValue = this.scrollValue + 80
        else if (this.scrollValue < 0) this.scrollValue = 0
        this.valueScroll()
    }
    valueScroll() {
        $('#containerBlue').scrollLeft(this.scrollValue)
    }

    currentStatus;
    changeStatus(stat, id) {
        this.evMapsFormFormId = id;
        let num = this.stateInfo.findIndex(item => item.status === stat) + 1
        this.currentStatus = num;


        if (num > -1) {
            this.changeStatusForm.patchValue({
                routeStatus: num
            })
        }


        $("#changeStatus").modal();
    }

    newStat;
    newNameStat;
    changeNewStatus() {
        this.newStat = parseInt(this.changeStatusForm.get('routeStatus').value)
        let stsName = this.stateInfo.findIndex(item => item.value === this.newStat)
        if (stsName > -1) this.newNameStat = this.stateInfo[stsName].status;

    }

    remarkCompulsary: boolean = false;
    invalidLengthRevert: boolean = false;
    postChangeNewStatus() {
        let remark = this.changeStatusForm.get('remark').value
        let step = this.newStat - this.currentStatus

        if (remark && step) {

            if (remark.length < 101) {
                let post = {
                    id: this.evMapsFormFormId,
                    curr_status: this.currentStatus,
                    step: step,
                    remark: remark,
                    year: this.filterForm.get('fltrFormName').value,
                    auth_no: JSON.parse(localStorage.getItem('currentUser')).body.gemsId
                }

                this._POST_api_Service.POST_MAPS_data(INVars.POSTRouteStatus, post).subscribe(res => {

                    if (res.status === 'OK') {
                        $('#closeChangestatusModal').click();
                        this.invalidLengthRevert = false;
                        this.remarkCompulsary = false;
                        this.changeStatusForm.patchValue({
                            routeStatus: null,
                            remark: null
                        })

                        let sts = this.pagedItems.findIndex(item => item.maps_id == this.evMapsFormFormId)

                        if (sts > -1) this.pagedItems[sts].status = this.newNameStat;

                    }
                })
            }
        } else {
            this.remarkCompulsary = true;
        }

    }

    countRevert = '0/100' // revert textarea
    countColorRevert = 'black'
    counterRevert() {
        let c = this.changeStatusForm.get('remark').value
        if (c !== '' && c !== null) {
            this.remarkCompulsary = false;
            c = c.length;
            this.countRevert = c + '/100';
            if (c > 100) {
                this.countColorRevert = 'red';
                this.invalidLengthRevert = true;
            } else {
                this.countColorRevert = 'black';
                this.invalidLengthRevert = false;
            }
        } else {
            this.countRevert = '0/100';
            this.remarkCompulsary = true;
        }
    }

    persnoSVRoute;
    nameSVRoute;
    searchSVRoute;
    getRoute(emp) {
        this.selectRoute = false;
        this.persnoSVRoute = emp.employeeNo;
        this.nameSVRoute = emp.name;
        this.searchSVRoute = emp.search;
    }

    getSupvRouteData = [];
    getSupvRouteDataResults = [];
    selectRoute = false;
    staff_no = JSON.parse(localStorage.getItem('currentUser')).userid;
    getSupvforRoute(e) {

        this.selectRoute = true;
        if (e.length > 2) {
            this._POST_api_Service.POST_IDP_data(INVars.POSTSearchSupvForRoute, { ownStaffNo: this.staff_no, text: e }).subscribe(dataRes => {
                this.getSupvRouteData = dataRes;
                this.getSupvRouteDataResults = dataRes.results;
            }, error => {
                console.log('ERROR: ' + error)
            });
        }
    }

    supvLvl;
    lvlIndicator(lvl){
        this.supvLvl = lvl;
    }

    submitRoute() {
        this.loading = true;
        this.selectRoute = false;
        this.searchSVRoute = '';
        let data = {
            id: this.evMapsFormFormId,
            supv_empno: this.persnoSVRoute,
            lvl: this.supvLvl ,
        }
        this._POST_api_Service.POST_IDP_data(INVars.POSTSubmitRoute, data).subscribe(dataRes => {
            if (dataRes.status === "OK") {
                this.getEvForm(this.staffNo);
                this.loading = false;

            }
        }, error => {
            this.loading = false
        })
    }

    titlePdf: String;
    docDefinition;
    downloadPdfMaps() {
        // Export it as PDF
        pdfMake.createPdf(this.docDefinition).download(this.titlePdf);
        this.imgDataUrl = '';
    }




}
