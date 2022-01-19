import { ComponentFactoryResolver, Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { INVars } from './intern-vars';
import { GlobalVariable } from "../../../../../../environments/environment";
import { DatePipe } from '@angular/common';
import { Routes, Router, RouterModule, ActivatedRoute, NavigationStart, ActivatedRouteSnapshot, NavigationEnd, Event as NavigationEvent } from '@angular/router';

import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
// import { Requestor, reqArr } from "./arrCons";

import { PagerService } from '../../job/shared/pager/pager.component';
import { Headers, RequestOptions } from '@angular/http';
import { AlertService } from '../../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../../auth/_directives/alert.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';


@Component({
    selector: 'app-intern',
    templateUrl: './internship.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../job-css.css']
})

export class InternshipComponent implements OnInit, AfterViewInit {


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
    filterForm: FormGroup;

    internData;
    descEmptyData = 'For better response, please customize your filter';
    ngOnInit() {

        this.checkLevel();
        this.filterForm = new FormGroup({
            fullname: new FormControl('', Validators.required),
            icno: new FormControl('', Validators.required),
            email: new FormControl('', Validators.required),
            area: new FormControl('', Validators.required),
            state: new FormControl('', Validators.required),
            cert: new FormControl('', Validators.required),
            location: new FormControl('', Validators.required),
            startDate: new FormControl('', Validators.required),
            endDate: new FormControl('', Validators.required),
        });

        this.filterForm.setValue({
            fullname: "",
            icno: "",
            email: "",
            area: "",
            state: "",
            cert: "",
            location: "",
            startDate: moment().format('DD-MM-YYYY'),
            endDate: moment(moment().startOf('month')).add(6, 'months').format('DD-MM-YYYY'),
        });

        this.internData = [];
        this.setPage(1);
        this.loading = false;
        this.getAreaStudy();
        this.getStates();

    }

    ngAfterViewInit() {
        this._script.loadScripts('app-intern',
            [
                'assets/js/jobs/job-adv-tracking.js',
            ]);
    }

    setPage(page: number) {
        // get pager object from service
        this.pager = this.pagerService.getPager(this.internData.length, page, this.pageSize);
        // get current page of items
        this.pagedItems = this.internData.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    checkLevel() {
        let usrRole = (JSON.parse(localStorage.getItem('currentUser')).job_role);
        if ((!/3/i.test(usrRole)) && (!/5/i.test(usrRole)) && (!/1/i.test(usrRole)) && (!/2/i.test(usrRole)) && (!/4/i.test(usrRole))) {
            this.routers.navigate(['/admin/unauthorized']);
            return false;
        }
    }

    studyAreas;
    getAreaStudy() {
        this._GET_api_Service.GET_data(INVars.getStudyAreaAPI).subscribe(data => {
            console.log(data)
            this.studyAreas = data;

        }, error => {
            console.log('[ERROR - Fail to get area of study] ' + error);
        });
    }

    statesInfo;
    getStates() {
        this._GET_api_Service.GET_data(INVars.getStatesAPI).subscribe(data => {
            console.log(data)
            this.statesInfo = data;

        }, error => {
            console.log('[ERROR - Fail to get area of study] ' + error);
        });
    }

    errorDate = false;
    submitFilter(type) {
        this.loading = true;
        this.errorDate = false;

        if (type === 1) {
            console.log($("#startDtAdd").val())
            console.log($("#endDtAdd").val())
            let arrSt = $("#startDtAdd").val().toString().split("-");
            let arrEd = $("#endDtAdd").val().toString().split("-");
            let mySt = new Date(Date.parse(arrSt[1] + '-' + arrSt[0] + '-' + arrSt[2]));
            let myEd = new Date(Date.parse(arrEd[1] + '-' + arrEd[0] + '-' + arrEd[2]));

            let ONE_DAY = 1000 * 60 * 60 * 24;
            if ((myEd.setHours(0, 0, 0, 0) - mySt.setHours(0, 0, 0, 0)) / ONE_DAY < 0) {
                this.errorDate = true;
                this.descEmptyData = 'Invalid Date Selection';
                this.loading = false;
            }

            else {
                this.errorDate = false;
                let dataPos;

                var condFrom;
                var condTo;

                if ($("#startDtAdd").val() !== undefined || $("#endDtAdd").val() !== undefined) {
                    this.filterForm.patchValue({
                        startDate: $("#startDtAdd").val(),
                        endDate: $("#endDtAdd").val(),
                    });
                    condFrom = $("#startDtAdd").val().toString().length === 0 || $("#startDtAdd").val() === null ? 0 : moment($("#startDtAdd").val(), 'DD-MM-YYYY').format();
                    condTo = $("#endDtAdd").val().toString().length === 0 || $("#endDtAdd").val() === null ? 0 : moment($("#endDtAdd").val(), 'DD-MM-YYYY').format();
                }
                else {
                    condFrom = 0;
                    condTo = 0;
                }

                dataPos = {
                    fullname: this.filterForm.get('fullname').value,
                    icno: this.filterForm.get('icno').value,
                    email: this.filterForm.get('email').value,
                    area: this.filterForm.get('area').value,
                    state: this.filterForm.get('state').value,
                    cert: '',
                    location: this.filterForm.get('location').value,
                    startDate: condFrom == 0 ? '' : condFrom,
                    endDate: condTo == 0 ? '' : condTo
                }

                console.log(dataPos)

                this._POST_api_Service.POST_data(INVars.postSearchInternAPI, dataPos).subscribe(data => {
                    console.log(data)

                    this.internData = data;
                    if (data.length === 0) {
                        this.descEmptyData = 'List is Empty';
                    }
                    this.setPage(1);
                    this.loading = false;
                }, error => {
                    this.loading = false;
                    console.log('[ERROR] Fail to submit filter: ' + error);
                });


            }

        }

        else if (type === 2) {

            this.filterForm.setValue({
                fullname: "",
                icno: "",
                email: "",
                area: "",
                state: "",
                cert: "",
                location: "",
                startDate: moment().format('DD-MM-YYYY'),
                endDate: moment(moment().startOf('month')).add(6, 'months').format('DD-MM-YYYY'),
            });
            this.internData = [];
            this.setPage(1);
            this.loading = false;
        }



    }

    internDetails;
    loading2 = false;
    internInfo;
    gotPhoto;
    userImg;
    openInternDetails(item) {
        this.loading2 = true;
        $('#info_tab').click();
        this.internDetails = item;

        let posData = { id: item.internID };

        this._POST_api_Service.POST_data(INVars.getInternDetails, posData).subscribe(res => {
            console.log(res);
            this.internInfo = res;

            this._GET_api_Service.GET_PictureByUrl(this.internInfo.applicants[0].photo_url).subscribe(data => {
                if (data) {
                    this.gotPhoto = true;
                    this.userImg = this.internInfo.applicants[0].photo_url;
                }
                else {
                    this.gotPhoto = false;
                    this.userImg = '../../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
                }
                this.loading2 = false;
            }, err => {
                this.gotPhoto = false;
                this.userImg = '../../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
                this.loading2 = false;
            })

        }, error => {
            this.loading2 = false;
            console.log('[ERROR] Fail to fetch intern details: ' + error);
        });
    }

    downloading = false;
    download() {
        this.downloading = true;

        var csvData = this.ConvertToCSV(this.internData);
        var a = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob([csvData], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        let todayDate = new Date();
        let dateToday = (todayDate.getFullYear() + '' + ((todayDate.getMonth() + 1)) + '' + todayDate.getDate() + '' + todayDate.getHours() + '' + todayDate.getMinutes() + '' + todayDate.getSeconds());
        a.download = 'Internship_Tracking_' + dateToday + '.csv';
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