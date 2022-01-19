import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { GET_Service } from '../../../../api/get.service';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { GlobalVariable } from "../../../../../../environments/environment";
import { Http } from '@angular/http';
import * as moment from 'moment';
import { POST_Service } from '../../../../api/post.service';

@Component({
    selector: 'performance-management',
    templateUrl: './performance-management.component.html',
    styleUrls: ['./performance-management.component.css']
})
export class PerformanceManagementComponent implements OnInit, AfterViewInit {
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

    tSummary;

    constructor(private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service, private http: Http, private activeRoute: ActivatedRoute, private routers: Router) {
        //this.getUserLoginInfo();
    }
    ngAfterViewInit(){
    }

    ngOnInit() {
        
        this.getMapsDash();
        if (this.env === 'prod')
            this.env_prod = true;
        else
            this.env_prod = false;
    }

    data: any = {};
    
    chartData: any;

    byRoleKey = new Array();
    byRoleVal = new Array();
    byRoleUrl = new Array();
    byRoleColor = ['warning', 'success', 'primary', 'danger', 'info'];


    data1: any = {};
    data2: any = {};

    countList: any[] = [];

    getMapsDash() {
        type mapsneDash = {
            LOB: string, GoalSetting: number, GoalApproval: number,
            MidAppraisee: number, MidAppraiser: number,
            EndAppraisee: number, EndAppraiser: number
        };
        let myarray: mapsneDash[] = [];
        this._POST_api_Service.POST_MAPS_data('/maps/admin/get_dash_nonexec', { "Year": 2020}).subscribe(data1 => {
            for(let i=0; i<data1.length; i++){

                this.num=data1.length;
                myarray.push({
                    LOB: data1[i].LOB,
                    GoalSetting: data1[i].S1,
                    GoalApproval: data1[i].S2,
                    MidAppraisee: data1[i].S3,
                    MidAppraiser: data1[i].S4,
                    EndAppraisee: data1[i].S5,
                    EndAppraiser: data1[i].S6
                });
                
            }
            this.data2 = myarray;
            this.countList = this.data2.slice();
            this.loading = false;
        }, error => {
            console.log('[ERROR - Fail to get report filters] ' + error);
        });
    }
}
