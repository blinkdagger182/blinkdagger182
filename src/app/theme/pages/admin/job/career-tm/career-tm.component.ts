import { ComponentFactoryResolver, Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { JADVars } from './career-tm-vars';
import { GlobalVariable } from "../../../../../../environments/environment";
//import { GlobalVariable } from '../../../../../../../ghcm-global';
import { DatePipe } from '@angular/common';
import { Routes, Router, RouterModule, ActivatedRoute, NavigationStart, ActivatedRouteSnapshot, NavigationEnd, Event as NavigationEvent } from '@angular/router';
// import { Router, NavigationStart, NavigationEnd, Event as NavigationEvent } from '@angular/router';
// import { Helpers } from '../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { Requestor, reqArr } from "./arrCons";

import { PagerService } from '../../job/shared/pager/pager.component';
import { Headers, RequestOptions } from '@angular/http';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../../auth/_directives/alert.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

//declare let Dropzone: any; 
@Component({
    selector: 'app-career-tm',
    templateUrl: './career-tm.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../job-css.css']
})

export class CareerTMComponent implements OnInit, AfterViewInit {
    
    currUsr = JSON.parse(localStorage.getItem('currentUser'));

    lgnName = this.currUsr.userid;
    // lgnName = this.currUsr.userid + ' - ' + this.currUsr.body.name;
    rCareer = JADVars.rCareer;

    loading = true; errLoadData = JADVars.errLoadData; downloadAllXLS = JADVars.downloadAllXLS;
    ads = GlobalVariable.ADS; adsId = GlobalVariable.ADS_ID; posName = GlobalVariable.POS_NAME; posId = GlobalVariable.POS_ID;
    title1 = JADVars.title1; title2 = JADVars.title2; pageSize = JADVars.pageSize;

    private baseUrl = GlobalVariable.BASE_API_URL;
    private baseApiKey = GlobalVariable.API_KEY;
    private token = '?api_key=' + this.baseApiKey;
    private jobDataAPIAll = JADVars.jobAdvListAllAPI;
    private jobDataAPIActive = JADVars.jobAdvListActiveAPI;
    private jobDataAPIAdvertised = JADVars.jobAdvListAdvertisedAPI;
    private jobDataAPIEvaluate = JADVars.jobAdvLisEvaluateAPI;
    private jobDataAPIInterview = JADVars.jobAdvListInterviewAPI;
    private jobDataAPIRevert = JADVars.jobAdvListRevertAPI;
    private jobDataAPIComplete = JADVars.jobAdvListCompleteAPI;
    // private apiUrl = this.baseUrl + this.jobDataAPIAll + this.token;
    apiUrl: string;
    /*usrLoginLvl = GlobalVariable.USER_LEVEL;
    usrLoginRole=GlobalVariable.USER_ROLE;
    usrLoginToken=GlobalVariable.USER_TOKEN;*/

    showAdvId = true; showPosId = true; showPosName = true; showCreator = true; showLOB = true; showTtlApl = false;
    showStatus = true; showDtStart = true; showDtEnd = true; showAct = true;

    data: any = {};
    data2: any = {};
    public term: string;
    styleTypeViewAll: string; styleTypeViewAct: string;
    styleTypeViewEva: string; styleTypeViewIv: string;
    styleTypeViewCom: string; styleTypeViewRev: string;
    descEmptyData = 'For better response, please customize your filter';


    // FIlter params
    public termAdvId: string;
    public termPosId: string; public termJobTtl: string; public termPosName: string;
    public termLOB: string; public termTtlApp: string; public termStatus: string;
    public termDtStart: string; public termDtEnd: string;
    public termDtStart2: Date; public termDtEnd2: Date;
    public termTtlAppMin: string; public termTtlAppMax: string;
    public termCreator: string;

    // array of all items to be paged
    private allItems: any[];
    // pager object
    pager: any = {};
    // paged items
    pagedItems: any[];

    reportFilter = JADVars.reportFilter;
    applyReportFilter = JADVars.applyReportFilter;

    filterForm: FormGroup;

    constructor(
        private pagerService: PagerService, private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service,
        private http: Http, private activeRoute: ActivatedRoute, private routers: Router,
        private datePipe: DatePipe, private _script: ScriptLoaderService,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver) {
        this.defDataTable();
            
    }

    JobAdvList(url3) {
        //return this.http.get(url3).map((res: Response) => res.json());
        return this._GET_api_Service.GET_data(url3);
    }


    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    defDataTable() {
        /* switch (JSON.parse(localStorage.getItem('currentUser')).job_role.toLocaleUpperCase()) {
             case 'HCBD':
                 this.showLOB = false; this.showPosName = true; this.showPosId = false; this.showStatus = true;
                 this.showTtlApl = true; this.showPeriod = false; break;
             case 'HEADHCBD':
                 this.showLOB = false; this.showPosName = true; this.showPosId = false; this.showStatus = true;
                 this.showTtlApl = true; this.showPeriod = false; break;
             case 'ADMINHCBO': case 'ADMINHCBO,HCBD':
                 this.showLOB = true; this.showPosName = true; this.showPosId = false; this.showStatus = true;
                 this.showTtlApl = true; this.showPeriod = false; break;
         } */
    }

    setPage(page: number) {
        // get pager object from service
        this.pager = this.pagerService.getPager(this.data2.length, page, this.pageSize);
        // get current page of items
        this.pagedItems = this.data2.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
    status = '';
    onChangeTab() {
        let url: string;

        if (this.typeView[0] == 'complete' || this.typeView[0] == '6') {
            this.styleTypeViewCom = 'btn-warning';
            this.styleTypeViewAll = 'btn-outline-warning';
            this.styleTypeViewEva = 'btn-outline-warning'; this.styleTypeViewIv = 'btn-outline-warning';
            this.styleTypeViewCom = 'btn-outline-warning'; this.styleTypeViewRev = 'btn-outline-warning';
            this.status = '6';
            this.submitFilter(0);
            // url = this.jobDataAPIComplete;
        } else if (this.typeView[0] == 'revert'|| this.typeView[0] == '15') {
            this.styleTypeViewRev = 'btn-warning'; this.styleTypeViewCom = 'btn-outline-warning';
            this.styleTypeViewAll = 'btn-outline-warning'; this.styleTypeViewAct = 'btn-outline-warning';
            this.styleTypeViewEva = 'btn-outline-warning'; this.styleTypeViewIv = 'btn-outline-warning';
            this.styleTypeViewCom = 'btn-outline-warning';
            this.status = '15';
            this.submitFilter(0);
            // url = this.jobDataAPIRevert;
        } else if (this.typeView[0] == 'evaluate'|| this.typeView[0] == '4') {
            this.styleTypeViewEva = 'btn-warning'; this.styleTypeViewCom = 'btn-outline-warning';
            this.styleTypeViewAll = 'btn-outline-warning'; this.styleTypeViewAct = 'btn-outline-warning';
            this.styleTypeViewIv = 'btn-outline-warning';
            this.styleTypeViewCom = 'btn-outline-warning'; this.styleTypeViewRev = 'btn-outline-warning';
            this.status = '4';
            this.submitFilter(0);
            // url = this.jobDataAPIEvaluate;
        } else if (this.typeView[0] == 'interview'|| this.typeView[0] == '5') {
            this.styleTypeViewIv = 'btn-warning'; this.styleTypeViewCom = 'btn-outline-warning';
            this.styleTypeViewAll = 'btn-outline-warning'; this.styleTypeViewAct = 'btn-outline-warning';
            this.styleTypeViewEva = 'btn-outline-warning';
            this.styleTypeViewCom = 'btn-outline-warning'; this.styleTypeViewRev = 'btn-outline-warning';
            this.status = '5';
            this.submitFilter(0);
            // url = this.jobDataAPIInterview;
        } else if (this.typeView[0] == 'all' || this.typeView[0] == '0') {
            this.styleTypeViewAll = 'btn-warning';
            this.styleTypeViewAct = 'btn-outline-warning'; this.styleTypeViewCom = 'btn-outline-warning';
            this.styleTypeViewEva = 'btn-outline-warning'; this.styleTypeViewIv = 'btn-outline-warning';
            this.styleTypeViewCom = 'btn-outline-warning'; this.styleTypeViewRev = 'btn-outline-warning';
            this.status = '';
            this.submitFilter(0);
            // url = this.jobDataAPIAll;
        } else if (this.typeView[0] == 'pending'|| this.typeView[0] == '1') {
            this.styleTypeViewAll = 'btn-warning';
            this.styleTypeViewAct = 'btn-outline-warning'; this.styleTypeViewCom = 'btn-outline-warning';
            this.styleTypeViewEva = 'btn-outline-warning'; this.styleTypeViewIv = 'btn-outline-warning';
            this.styleTypeViewCom = 'btn-outline-warning'; this.styleTypeViewRev = 'btn-outline-warning';
            this.status = '1';
            this.submitFilter(0);

        }
        else if(this.typeView[0] == 1 || this.typeView[0] == 3 || this.typeView[0] == 7  || this.typeView[0] == 17  || this.typeView[0] == 18){
            this.submitFilter(0);
        }
        // this.JobAdvListData(this.baseUrl + url + this.token);     
        // this.JobAdvListData(url);
    }

    /** :start DOWNLOAD CSV  */
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

    downloading = false;
    download() {
        this.downloading = true;
        let type = this.activeRoute.snapshot.paramMap.get('type')
        let typeView = type.split("_");
        let dwApi: string;
        let dwData = [];
        if (typeView[0] == 'complete') {
            dwApi = JADVars.dwApiComplete;
        } else if (typeView[0] == 'revert') {
            dwApi = JADVars.dwApiRevert;
        } else if (typeView[0] == 'evaluate') {
            dwApi = JADVars.dwApiEvaluate;
        } else if (typeView[0] == 'interview') {
            dwApi = JADVars.dwApiIview;
        } else if (typeView[0] == 'all') {
            dwApi = JADVars.dwApiAll;
        }
        this._GET_api_Service.GET_data(dwApi).subscribe(data => {
            dwData = data;
            this.download2(dwData);
            this.downloading = false;
        },
            error => {
                console.log('[ERROR - Populate data from Career@TM Tracking Download API] ' + error);
                dwData = this.data2;
                this.download2(dwData);
                this.downloading = false;

            });


    }
    download2(dwData) {
        var csvData = this.ConvertToCSV(dwData);
        var a = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob([csvData], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        let todayDate = new Date();
        let dateToday = (todayDate.getFullYear() + '' + ((todayDate.getMonth() + 1)) + '' + todayDate.getDate() + '' + todayDate.getHours() + '' + todayDate.getMinutes() + '' + todayDate.getSeconds());
        a.download = 'Ads_Tracking_' + dateToday + '.csv';
        a.click();
        return 'success';
    }
    /** :end DOWNLOAD CSV  */

    ngAfterViewInit() {
        this._script.loadScripts('app-career-tm',
            [
                'assets/js/jobs/job-adv-tracking.js',
            ]);
    }
    title: string;
    //getDeepestTitle:string;
    typeView = [];
    ngOnInit() {
        let type = this.activeRoute.snapshot.paramMap.get('type');
        this.typeView = type.split("_")
        this.checkLevel();
        this.filterForm = new FormGroup({
            advID: new FormControl('', Validators.required),
            advPosID: new FormControl('', Validators.required),
            advPosCreator: new FormControl('', Validators.required),
            filterLob: new FormControl('', Validators.required),
            filterStatus: new FormControl('', Validators.required),
            filterType: new FormControl('', Validators.required),
            filterStart: new FormControl('', Validators.required),
            filterEnd: new FormControl('', Validators.required),
        });
        let node = this.activeRoute.snapshot.queryParams['node'];
        let fillOn = 0;
        if(this.typeView[0] === 'evaluate'){
            fillOn = 4;
        } else if(this.typeView[0] === 'interview'){
            fillOn = 5;
        } else if(this.typeView[0] === 'revert'){
            fillOn = 15;
        }

        if(node == 1){
            this.filterForm.setValue({
                advID: "",
                advPosID: "",
                advPosCreator: "",
                filterLob: "",
                filterStatus: fillOn == 0 ? "" : fillOn,
                filterType: "",
                filterStart: "",
                filterEnd: "",
            });
        } else {
            this.filterForm.setValue({
                advID: "",
                advPosID: "",
                advPosCreator: "",
                filterLob: "",
                filterStatus: fillOn == 0 ? "" : fillOn,
                filterType: "",
                filterStart: moment(moment().startOf('month')).subtract(2, 'months').format('DD-MM-YYYY'),
                filterEnd: moment().format('DD-MM-YYYY'),
            });
        }

        // this.onChangeTab();
        this.data2 = [];
        this.setPage(1);
        this.loading = false;
        // this.routers.events.subscribe((event) => {
        //     if (event instanceof NavigationEnd) {
        //         this.onChangeTab();
        //     }
        // });
        this.getReportFilter();
        
        if(node == 1)
            this.submitFilter(1);
    }

    checkAdvertiser(advList){
        let adv = advList.find(stat => { if(this.lgnName == stat.staff_id) return true; })
        if (adv) {
            this.filterForm.patchValue({ advPosCreator: this.lgnName });
        };
    }

    checkLevel() {
        let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role);
        if ((!/3/i.test(usrRole)) && (!/5/i.test(usrRole)) && (!/1/i.test(usrRole)) && (!/2/i.test(usrRole)) && (!/4/i.test(usrRole))) {
            this.routers.navigate(['/admin/unauthorized']);
            return false;
        }
    }

    redirect(job_id: number) {
        this.routers.navigate(['admin/job/career-tm/detail', job_id]);
    }

    getStatusColor(status: number) {
        let ret: string;
        switch (status) {
            case 1: case 2: ret = 'info'; break;
            case 15: case 16: case 7: case 8: ret = 'danger'; break;
            case 17: ret = 'secondary'; break;
            case 3: ret = 'success'; break;
            case 6: ret = 'primary'; break;
            case 4: case 5: ret = 'warning'; break;
        }
        return ret;
    }
    getStatusName(status: string) {
        let ret = status;
        switch (status.toLocaleLowerCase()) {
            //case 'advertised': ret='Advertised' ; break;
            case 'pending approval': ret = 'Pend. Approval'; break;
        }
        return ret;
    }

    filters = {};
    filterUrl = '';
    newStatus = [];
    getReportFilter() {
        this.filters = {};
        this.newStatus = [];
        this._GET_api_Service.GET_data(this.reportFilter).subscribe(data => {
            this.filters = data.filter;
            this.checkAdvertiser(data.filter.advertiser);
            for (let i = 0; i < data.filter.status.length; i++) {
                this.newStatus.push({
                    id: data.filter.status[i].id,
                    text: data.filter.status[i].text,
                    select: this.status == data.filter.status[i].id ? true : false,
                });
            }
            let stat = this.newStatus.find(stat => { return stat.select === true })
            if (stat) {
                this.filterForm.patchValue({ filterStatus: stat.id });
            };
        }, error => {
            console.log('[ERROR - Fail to get report filters] ' + error);
        });
    }

    errorDate = false;
    submitFilter(type) {
        this.descEmptyData = 'List is Empty';
        this.loading = true;
        let filter = '';
        filter = this.activeRoute.snapshot.paramMap.get('type');
        let filterArr = [];
        filterArr = filter.split("_");

        if(filterArr[0] === 'evaluate'){
            filterArr[0] = 4;
        } else if(filterArr[0] === 'interview'){
            filterArr[0] = 5;
        } else if(filterArr[0] === 'revert'){
            filterArr[0] = 15;
        }

        this.errorDate = false;
        let arrSt = this.filterForm.get('filterStart').value.split("-");
        let arrEd = this.filterForm.get('filterEnd').value.split("-");
        let mySt = new Date(Date.parse(arrSt[1] + '-' + arrSt[0] + '-' + arrSt[2]));
        let myEd = new Date(Date.parse(arrEd[1] + '-' + arrEd[0] + '-' + arrEd[2]));

        let ONE_DAY = 1000 * 60 * 60 * 24;
        if ((myEd.setHours(0, 0, 0, 0) - mySt.setHours(0, 0, 0, 0)) / ONE_DAY < 0) {
            this.errorDate = true;
        } else {
            this.errorDate = false;
            let dataPos = {};
            if (type === 0) {
                if (filter === '4_0_0_0_0' || filter === '5_0_0_0_0' || filter === '15_0_0_0_0' || filter === '1_0_0_0_0'){
                    this.filterForm.patchValue({
                        filterStatus: filterArr[0],
                        filterStart: '',
                        filterEnd: '',
                    });
                    dataPos = {
                        lob: '',
                        status: filterArr[0],
                        type: '',
                        from: '',
                        to: '',
                    }
                } else if (filter === 'all_0_0_0_0') {
                    this.filterForm.patchValue({
                        // advID: "",
                        // advPosID: "",
                        // advPosCreator: this.lgnName,
                        filterLob: '',
                        filterStatus: '',
                        filterType: '',
                        filterStart: moment(moment().startOf('month')).subtract(2, 'months').format('DD-MM-YYYY'),
                        filterEnd: moment().format('DD-MM-YYYY'),
                    });
                    dataPos = {
                        adsId: this.filterForm.get('advID').value === '' ? 0 : this.filterForm.get('advID').value,
                        postId: this.filterForm.get('advPosID').value === '' ? '' : this.filterForm.get('advPosID').value,
                        advertiser: this.filterForm.get('advPosCreator').value === '' ? '' : this.filterForm.get('advPosCreator').value.split(" - ")[0],
                        lob: '',
                        status: '',
                        type: '',
                        from: moment(moment().startOf('month')).subtract(2, 'months').format(),
                        to: moment().format(),
                    }
                } else if(filter.length > 0) {
                    this.filterForm.patchValue({
                        // advID: "",
                        // advPosID: "",
                        // advPosCreator: this.lgnName,
                        filterStatus: filterArr[0] == 0 ? "" : filterArr[0],
                        filterLob: filterArr[1] == 0 ? "" : filterArr[1],
                        filterType: filterArr[2]== 0 ? "" : filterArr[2],
                        filterStart: filterArr[3] === "0" ? "" : moment(filterArr[3]).format('DD-MM-YYYY'),
                        filterEnd: filterArr[4] === "0" ? "" : moment(filterArr[4]).format('DD-MM-YYYY'),
                    });
                    dataPos = {
                        adsId: this.filterForm.get('advID').value === '' ? 0 : this.filterForm.get('advID').value,
                        postId: this.filterForm.get('advPosID').value === '' ? '' : this.filterForm.get('advPosID').value,
                        advertiser: this.filterForm.get('advPosCreator').value === '' ? '' : this.filterForm.get('advPosCreator').value.split(" - ")[0],
                        status: filterArr[0] === "0" ? "" : filterArr[0],
                        lob: filterArr[1] === "0" ? "" : filterArr[1],
                        type: filterArr[2] === "0" ? "" : filterArr[2],
                        from: filterArr[3] === "0" ? "" : filterArr[3],
                        to: filterArr[4] === "0" ? "" : filterArr[4],
                    }
                }
                this.loading = true;
                if(type == 2){
                    this.data2 = [];
                    this.setPage(1);
                    this.loading = false;
                } else {
                    type TrackingData = {
                        idx: number, pos_id: string, job_ttl: string, pos_name: string, st_date: string,
                        end_date: string, comp: string, creator: string, status: string, status_code: number,
                        total_applicant: number, total_view: number, total_anonymous: number, st_date2: Date, end_date2: Date
                    };
                    let myarray: TrackingData[] = [];
                    let sDt: string;
                    let eDt: string;
                    this._POST_api_Service.POST_data(this.applyReportFilter, dataPos).subscribe(data => {
                        for (let i = 0; i < data.length; i++) {
                            sDt = this.datePipe.transform(data[i].start, "dd-MMM-yyyy");
                            eDt = this.datePipe.transform(data[i].close, "dd-MMM-yyyy");
                            myarray.push({
                                idx: data[i].id, pos_id: data[i].position_id, job_ttl: data[i].job_title,
                                pos_name: data[i].job_title, st_date: sDt, end_date: eDt, comp: data[i].company, creator: data[i].creator,
                                status: data[i].status, status_code: data[i].status_code, total_applicant: data[i].total_applicant, total_view: data[i].total_view,
                                total_anonymous: data[i].total_anonymous, st_date2: data[i].start, end_date2: data[i].close
                            });
                        }
                        this.data2 = myarray;
                        this.setPage(1);
                        this.loading = false;
                    }, error => {
                        console.log('[ERROR] Fail to submit filter: ' + error);
                    });
                }
            }
            else if (type === 1) {
                // let condLob = this.filterForm.get('filterLob').value === 'All' || this.filterForm.get('filterLob').value === null || this.filterForm.get('filterLob').value === '' ? 0 : this.filterForm.get('filterLob').value;
                // let condStatus = this.filterForm.get('filterStatus').value === 'All' || this.filterForm.get('filterStatus').value === null || this.filterForm.get('filterStatus').value === '' ? 0 : this.filterForm.get('filterStatus').value;
                // let condType = this.filterForm.get('filterType').value === 'All' || this.filterForm.get('filterType').value === null || this.filterForm.get('filterType').value === '' ? 0 : this.filterForm.get('filterType').value;
                // let condFrom = $("#startDtAdd").val().toString().length === 0 || $("#startDtAdd").val() === null ? 0 : moment($("#startDtAdd").val(), 'DD-MM-YYYY').format();
                // let condTo = $("#endDtAdd").val().toString().length === 0 || $("#endDtAdd").val() === null ? 0 : moment($("#endDtAdd").val(), 'DD-MM-YYYY').format();
                // if(filter === '0_0_0_0_0')
                //     this.routers.navigate(['admin/job/career-tm/all_0_0_0_0']);
                // else{
                    // this.filterUrl = condStatus + '_' + condLob + '_' + condType + '_' + condFrom + '_' + condTo;
                    // this.routers.navigate(['admin/job/career-tm/' + this.filterUrl]);  
                // }

                let node = this.activeRoute.snapshot.queryParams['node'];
                var condFrom;
                var condTo;
                
                if(node != 1 || $("#startDtAdd").val() !== undefined || $("#endDtAdd").val() !== undefined){
                    this.filterForm.patchValue({
                        filterStart: $("#startDtAdd").val(),
                        filterEnd: $("#endDtAdd").val(),
                    });
                    condFrom = $("#startDtAdd").val().toString().length === 0 || $("#startDtAdd").val() === null ? 0 : moment($("#startDtAdd").val(), 'DD-MM-YYYY').format();
                    condTo = $("#endDtAdd").val().toString().length === 0 || $("#endDtAdd").val() === null ? 0 : moment($("#endDtAdd").val(), 'DD-MM-YYYY').format();
                } else {
                     condFrom = 0;
                     condTo = 0;
                }
                
                dataPos = {
                    adsId: this.filterForm.get('advID').value === '' ? 0 : this.filterForm.get('advID').value,
                    postId: this.filterForm.get('advPosID').value === '' ? '' : this.filterForm.get('advPosID').value,
                    advertiser: this.filterForm.get('advPosCreator').value === '' ? '' : this.filterForm.get('advPosCreator').value.split(" - ")[0],
                    lob: this.filterForm.get('filterLob').value === '' ? '' : this.filterForm.get('filterLob').value,
                    status: this.filterForm.get('filterStatus').value === '' ? '' : this.filterForm.get('filterStatus').value,
                    type: this.filterForm.get('filterType').value === '' ? '' : this.filterForm.get('filterType').value,
                    from: condFrom == 0 ? '' : condFrom,
                    to: condTo == 0 ? '' : condTo,
                }

                type TrackingData = {
                    idx: number, pos_id: string, job_ttl: string, pos_name: string, st_date: string,
                    end_date: string, comp: string, creator: string, status: string, status_code: number,
                    total_applicant: number, total_view: number, total_anonymous: number, st_date2: Date, end_date2: Date
                };
                let myarray: TrackingData[] = [];
                let sDt: string;
                let eDt: string;
                this._POST_api_Service.POST_data(this.applyReportFilter, dataPos).subscribe(data => {
                    for (let i = 0; i < data.length; i++) {
                        sDt = this.datePipe.transform(data[i].start, "dd-MMM-yyyy");
                        eDt = this.datePipe.transform(data[i].close, "dd-MMM-yyyy");
                        myarray.push({
                            idx: data[i].id, pos_id: data[i].position_id, job_ttl: data[i].job_title,
                            pos_name: data[i].job_title, st_date: sDt, end_date: eDt, comp: data[i].company, creator: data[i].creator,
                            status: data[i].status, status_code: data[i].status_code, total_applicant: data[i].total_applicant, total_view: data[i].total_view,
                            total_anonymous: data[i].total_anonymous, st_date2: data[i].start, end_date2: data[i].close
                        });
                    }
                    this.data2 = myarray;
                    this.setPage(1);
                    this.loading = false;
                }, error => {
                    console.log('[ERROR] Fail to submit filter: ' + error);
                });

                
            } else if (type === 2) {
                dataPos = {
                    lob: '',
                    type: '',
                    status: '',
                    from: '',
                    to: '',
                };
                this.filterForm.patchValue({
                    advID: "",
                    advPosID: "",
                    advPosCreator: "",
                    filterLob: '',
                    filterType: '',
                    filterStatus: '',
                    filterStart: '',
                    filterEnd: '',
                });

                $("#startDtAdd").val('');
                $("#endDtAdd").val('');
                this.data2 = [];
                this.setPage(1);
                this.loading = false;

                // this.routers.navigate(['admin/job/career-tm/all_0_0_0_0']);
                
            }
        }

    };
}