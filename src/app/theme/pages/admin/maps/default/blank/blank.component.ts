import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
// import { BlankVars } from './blank-vars';
import { GET_Service } from '../../../../../api/get.service';
import { POST_Service } from '../../../../../api/post.service';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { GlobalVariable } from "../../../../../../../environments/environment";
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { timestamp } from 'rxjs/operator/timestamp';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Chart } from 'chart.js';
import { ScriptLoaderService } from '../../../../../../_services/script-loader.service';
import * as moment from 'moment';


@Component({
    selector: 'app-e-blank',
    templateUrl: './blank.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./blank.component.css']
})

export class mapsBlankComponent implements OnInit, AfterViewInit {
    Arr = Array; //Array type captured in a variable
    num:number;
    isAdmin = false;
    today: number = Date.now();
    usrLoginLvl = localStorage.getItem('userlevel');
    usrRole: string;
    //dashboardAPI = BlankVars.dashboardAPI;
    //newsFeedAPI = BlankVars.newsFeedAPI;
    loading = true;
    env = GlobalVariable.ENV_NAME;
    env_prod = false;
    cancel = false;
    filterForm : FormGroup;
    tSummary;

    constructor(private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service, private http: Http, private activeRoute: ActivatedRoute, private routers: Router) {
        //this.getUserLoginInfo();
    }
    ngAfterViewInit(){
    }

    ngOnInit() {
        this.syncTokenMaps();
        this.getReportFilter();
        this.filterForm = new FormGroup({
            fltrFormName: new FormControl('', Validators.required),
        });
               
        this.filterForm.setValue({
            fltrFormName: "2021",
        });
    }

    submitFilter() {

        this.getMapsDash(this.filterForm.get('fltrFormName').value);
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

    data: any = {};
    
    chartData: any;

    byRoleKey = new Array();
    byRoleVal = new Array();
    byRoleUrl = new Array();
    byRoleColor = ['warning', 'success', 'primary', 'danger', 'info'];

    ds: any = {};
    ds2: any = {};

    getReportFilter() {
        type mapsnesession = {
          m_id: number, m_year: number, m_name: string, s_date_goalstg: Date, e_date_endyear: Date
        };
        let myarray: mapsnesession[] = [];
        this._GET_api_Service.GET_MAPS_data('/maps/admin/get_sessions').subscribe(ds => {
            for(let i=0; i<ds.length; i++){
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

    data1: any = {};
    data2: any = {};

    countList: any[] = [];

    getMapsDash(nYear) {
        type mapsneDash = {
            LOB: string, GoalSetting: number, GoalApproval: number,
            MidAppraisee: number, MidAppraiser: number,
            EndAppraisee: number, EndAppraiser: number, 
            EndReviewer: number, EmplAck: number,
            Completed: number, divColor: string

        };
        let myarray: mapsneDash[] = [];
        this._POST_api_Service.POST_MAPS_data('/maps/admin/get_dash_nonexec', { "Year": nYear}).subscribe(data1 => {
            for(let i=0; i<data1.length; i++){

                this.num=data1.length;
                myarray.push({
                    LOB: data1[i].LOB,
                    GoalSetting: data1[i].S1,
                    GoalApproval: data1[i].S2,
                    MidAppraisee: data1[i].S3,
                    MidAppraiser: data1[i].S4,
                    EndAppraisee: data1[i].S5,
                    EndAppraiser: data1[i].S6,
                    EndReviewer: data1[i].S7,
                    EmplAck: data1[i].S8,
                    Completed: data1[i].S9,
                    divColor: this.getRndColor(),
                });
                
            }
            this.data2 = myarray;
            this.countList = this.data2.slice();
            this.loading = false;
        }, error => {
            console.log('[ERROR - Fail to get report filters] ' + error);
        });
    }

    getRndColor(){
        return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
    }
}