import { ComponentFactoryResolver, Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { INVars } from './evl-tracking-vars';
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
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';


@Component({
    selector: 'app-evl',
    templateUrl: './evl-tracking.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./evl-tracking.component.css']
})

export class EVLetterComponent implements OnInit, AfterViewInit {


    // pager object
    pager: any = {};
    pageSize = 20;
    pagedItems: any[];

    constructor(
        private pagerService: PagerService, private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service,
        private http: Http, private activeRoute: ActivatedRoute, private routers: Router,
        private datePipe: DatePipe, private _script: ScriptLoaderService,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver) {
    }

    loading = true;
    showTable = true;
    filterForm: FormGroup;

    evlData;
    descEmptyData = 'For better response, please customize your filter';
    ngOnInit() {

        this.checkLevel();
        this.filterForm = new FormGroup({
            fnameFilter: new FormControl('', Validators.required),
            empgroupFilter: new FormControl('', Validators.required),
            ltypeFilter: new FormControl('0', Validators.required),
            bandFilter: new FormControl('', Validators.required),
            stateFilter: new FormControl('', Validators.required),
            lstatusFilter: new FormControl('0', Validators.required),
            lobFilter: new FormControl('', Validators.required),
            monthFilter: new FormControl('0', Validators.required),
            yearFilter: new FormControl('2021', Validators.required),//startDate: new FormControl('', Validators.required),//endDate: new FormControl('', Validators.required),
        });

        var currentTime = new Date()

        this.filterForm.setValue({
            fnameFilter: "",
            empgroupFilter: "",
            ltypeFilter: "0",
            bandFilter: "",
            stateFilter: "",
            lstatusFilter: "0",
            lobFilter: "",
            monthFilter: currentTime.getMonth() + 1,
            yearFilter: currentTime.getFullYear(),
        });

        this.evlData = [];
        this.setPage(1);
        this.loading = false;
        this.getEmpgroup();
        this.getBands();
        this.getLtypes();
        this.getStates();
        this.getStatus();
        this.getLob();

    }

    ngAfterViewInit() {
        this._script.loadScripts('app-evl',
            [
                'assets/js/jobs/job-adv-tracking.js',
            ]);
    }

    setPage(page: number) {
        // get pager object from service
        this.pager = this.pagerService.getPager(this.evlData.length, page, this.pageSize);
        // get current page of items
        this.pagedItems = this.evlData.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    checkLevel() {
        let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role);
        if ((!/3/i.test(usrRole)) && (!/5/i.test(usrRole)) && (!/1/i.test(usrRole)) && (!/2/i.test(usrRole)) && (!/4/i.test(usrRole))) {
            this.routers.navigate(['/admin/unauthorized']);
            return false;
        }
    }

    monthList = [
        { Value: 1, Text: 'Jan' },
        { Value: 2, Text: 'Feb' },
        { Value: 3, Text: 'Mar' },
        { Value: 4, Text: 'Apr' },
        { Value: 5, Text: 'May' },
        { Value: 6, Text: 'June' },
        { Value: 7, Text: 'July' },
        { Value: 8, Text: 'Aug' },
        { Value: 9, Text: 'Sep' },
        { Value: 10, Text: 'Oct' },
        { Value: 11, Text: 'Nov' },
        { Value: 12, Text: 'Dec' }
    ];

    yearList = [
        { Value: 2020, Text: '2020' },
        { Value: 2021, Text: '2021' },
        { Value: 2022, Text: '2022' },
        { Value: 2023, Text: '2023' }
    ];

    empgroupsInfo;
    getEmpgroup() {
        this._GET_api_Service.GET_IDP_data(INVars.getEmpgroupsAPI).subscribe(data => {
            console.log(data)
            this.empgroupsInfo = data;

        }, error => {
            console.log('[ERROR - Fail to get empgroup] ' + error);
        });
    }

    ltypesInfo;
    getLtypes() {
        this._GET_api_Service.GET_IDP_data(INVars.getLtypeAPI).subscribe(data => {
            console.log(data)
            this.ltypesInfo = data;

        }, error => {
            console.log('[ERROR - Fail to get letter types] ' + error);
        });
    }

    statesInfo;
    getStates() {
        this._GET_api_Service.GET_IDP_data(INVars.getStatesAPI).subscribe(data => {
            console.log(data)
            this.statesInfo = data;

        }, error => {
            console.log('[ERROR - Fail to get states] ' + error);
        });
    }

    bandsInfo;
    getBands() {
        this._GET_api_Service.GET_IDP_data(INVars.getBandsPI).subscribe(data => {
            console.log(data)
            this.bandsInfo = data;

        }, error => {
            console.log('[ERROR - Fail to get bands] ' + error);
        });
    }

    lstatusInfo;
    getStatus() {
        this._GET_api_Service.GET_IDP_data(INVars.getStatusAPI).subscribe(data => {
            console.log(data)
            this.lstatusInfo = data;

        }, error => {
            console.log('[ERROR - Fail to get status] ' + error);
        });
    }

    lobInfo;
    getLob() {
        this._GET_api_Service.GET_IDP_data(INVars.getLobAPI).subscribe(data => {
            console.log(data)
            this.lobInfo = data;

        }, error => {
            console.log('[ERROR - Fail to get lob] ' + error);
        });
    }

    errorDate = false;
    submitFilter(type) {
        this.loading = true;
        this.showTable = true;
        this.errorDate = false;

        if (type === 1) {

            this.errorDate = false;
            let dataPos;
            let ftxtkey = '';
            let fltype = '0';
            let fempgroup = '';
            let fband = '';
            let fstate = '';
            let fstatus = '0';
            let flob = '';
            let fyear = '0';
            let fmonth = '0';

            if (this.filterForm.get('fnameFilter').value !== '' && this.filterForm.get('fnameFilter').value !== null){
           
                ftxtkey = this.filterForm.get('fnameFilter').value;
            }

            if (this.filterForm.get('ltypeFilter').value !== '' && this.filterForm.get('ltypeFilter').value !== null){
           
                fltype = this.filterForm.get('ltypeFilter').value;
            }

            if (this.filterForm.get('empgroupFilter').value !== '' && this.filterForm.get('empgroupFilter').value !== null){
           
                fempgroup = this.filterForm.get('empgroupFilter').value;
            }

            if (this.filterForm.get('bandFilter').value !== '' && this.filterForm.get('bandFilter').value !== null){
           
                fband = this.filterForm.get('bandFilter').value;
            }

            if (this.filterForm.get('stateFilter').value !== '' && this.filterForm.get('stateFilter').value !== null){
           
                fstate = this.filterForm.get('stateFilter').value;
            }

            if (this.filterForm.get('lstatusFilter').value !== '' && this.filterForm.get('lstatusFilter').value !== null){
           
                fstatus = this.filterForm.get('lstatusFilter').value;
            }

            if (this.filterForm.get('lobFilter').value !== '' && this.filterForm.get('lobFilter').value !== null){
           
                flob = this.filterForm.get('lobFilter').value;
            }

            if (this.filterForm.get('monthFilter').value !== '' && this.filterForm.get('monthFilter').value !== null){
           
                fmonth = this.filterForm.get('monthFilter').value;
            }

            if (this.filterForm.get('yearFilter').value !== '' && this.filterForm.get('yearFilter').value !== null){
           
                fyear = this.filterForm.get('yearFilter').value;
            }

                dataPos = {
                    txtkeyword: ftxtkey,
                    empgroup: fempgroup,
                    ltype: fltype,
                    band: fband,
                    state: fstate,
                    status: fstatus,
                    lob: flob,
                    month: fmonth,
                    year: fyear,
                }

                console.log(dataPos)

                this._POST_api_Service.POST_EVL_data(INVars.postSearchLettrsAPI, dataPos).subscribe(data => {
                    console.log(data)

                    this.evlData = data;
                    if (data.length === 0) {
                        this.descEmptyData = 'List is Empty';
                    }

                    this.setPage(1);
                    this.loading = false;
                }, error => {
                    this.loading = false;
                    console.log('[ERROR] Fail to submit filter: ' + error);
                });


            //}

        }

        else if (type === 2) {

            this.filterForm.setValue({
                fnameFilter: "",
                empgroupFilter: "",
                ltypeFilter: "0",
                bandFilter: "",
                stateFilter: "",
                lstatusFilter: "0",
                lobFilter: "",
                monthFilter: 0,
                yearFilter: 2021,
            });
            this.evlData = [];
            this.setPage(1);
            this.loading = false;
        }



    }

    letterDetails;
    staffDetails;
    attachmentDetails;
    loading2 = false;
    evlInfo;
    gotPhoto;
    userImg;
    openLetterDetails(item) {
        this.showTable = false;
        //$('#info_tab').click();
        // type letterData {
        //     id, pers_no, name, post_desc, staff_no, purpose, location, destination, approver
        // }

        //let myarray:letterData[] = [];

        this._GET_api_Service.GET_IDP_data(INVars.getLetterDetails + item).subscribe(data => {
            
            this.letterDetails = data.letterInfo.basicInfo[0];
            this.staffDetails = data.letterInfo.staffInfo[0];
            this.attachmentDetails = data.letterInfo.attachment[0];

        }, error => {
            console.log('[ERROR - Fail to get letter details] ' + error);
        });

    }

    downloading = false;
    download() {
        this.downloading = true;

        var csvData = this.ConvertToCSV(this.evlData);
        var a = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob([csvData], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        let todayDate = new Date();
        let dateToday = (todayDate.getFullYear() + '' + ((todayDate.getMonth() + 1)) + '' + todayDate.getDate() + '' + todayDate.getHours() + '' + todayDate.getMinutes() + '' + todayDate.getSeconds());
        a.download = 'evl_Tracking_' + dateToday + '.csv';
        a.click();
        this.downloading = false;
        return 'success';

    }

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

}