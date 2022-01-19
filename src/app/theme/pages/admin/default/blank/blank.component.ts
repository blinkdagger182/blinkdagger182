import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { BlankVars } from './blank-vars';
import { GET_Service } from '../../../../api/get.service';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { GlobalVariable } from "../../../../../../environments/environment";
import { Http } from '@angular/http';
import * as moment from 'moment';
import { POST_Service } from '../../../../api/post.service';

@Component({
    selector: 'app-blank',
    templateUrl: './blank.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./default.css']
})
export class BlankComponent implements OnInit, AfterViewInit {
    isAdmin = false;
    today: number = Date.now();
    usrLoginLvl = localStorage.getItem('userlevel');
    usrRole: string;
    dashboardAPI = BlankVars.dashboardAPI;
    newsFeedAPI = BlankVars.newsFeedAPI;
    loadingNewsFeed = true;
    env = GlobalVariable.ENV_NAME;
    env_prod = false;
    cancel = false;

    tSummary;

    constructor(private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service, private http: Http, private activeRoute: ActivatedRoute, private routers: Router) {
        this.getUserLoginInfo();
    }

    ngOnInit() {
        this.DashboardData();
        this.NewsFeedData();
        //this.getMapsDash();
        if (this.env === 'prod')
            this.env_prod = true;
        else
            this.env_prod = false;
    }

    data: any = {};
    myKey = new Array();
    myVal = new Array();
    chartData: any;

    byRoleKey = new Array();
    byRoleVal = new Array();
    byRoleUrl = new Array();
    byRoleColor = ['warning', 'success', 'primary', 'danger', 'info'];
    waitingEvaluate = BlankVars.waitingEvaluate;
    waitingInterview = BlankVars.waitingInterview;
    approvalRevert = BlankVars.approvalRevert;
    approvalHcbd = BlankVars.approvalHcbd;
    approvalHcbo = BlankVars.approvalHcbo;
    dashByMonthVal: any;
    adoptionRateVal: any;
    dashPlatformVal: any;
    dashjobAdvVal: any;
    dashjobApplVal: any;
    projAdvVal: any;
    projApplVal: any;
    careerUserCount: any;
    careerJobAdsCount: any;
    careerUserProvider: any;
    careerJobApplicants: any;
    currDate = moment().format('YYYY-MM-DD');

    data1: any = {};
    data2: any = {};

    countList: any[] = [];
    /*
    getMapsDash() {
        type mapsneDash = {
            LOB: string, GoalSetting: number, GoalApproval: number,
            MidAppraisee: number, MidAppraiser: number,
            EndAppraisee: number, EndAppraiser: number
        };
        let myarray: mapsneDash[] = [];
        this._POST_api_Service.POST_MAPS_data('/maps/admin/get_dash_nonexec', { "Year": 2020}).subscribe(data1 => {
            for(let i=0; i<data1.length; i++){
                if(i == (data1.length-1))
                {
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
            }
            this.data2 = myarray;
            this.countList = this.data2;
        }, error => {
            console.log('[ERROR - Fail to get report filters] ' + error);
        });
    }
    */

    DashboardData() {
        let excludeArr = ["approvalHcbd", "approvalHcbo", "approvalEvaluate", "approvalInterview", "approvalRevert"];
        this._GET_api_Service.GET_data(this.dashboardAPI).subscribe(data => {
            if (data.length == 1) {
                this.data = data[0];
                this.tSummary = data[0];
                console.log(this.tSummary);
            }
            for (var key in this.data) {
                let currKey = key;
                if (!excludeArr.some((e => e === currKey))) {
                    if(currKey !== 'careerApprovalHcbo' && currKey !== 'careerApprovalEvaluate' && currKey !== 'careerApprovalInterview' && currKey !== 'careerApprovalRevert'){
                    this.myKey.push(currKey);
                    this.myVal.push(this.data[key]);
                    }
                } else {
                    switch (currKey.toLocaleUpperCase()) {
                        case 'APPROVALEVALUATE': this.byRoleKey.push(this.waitingEvaluate); this.byRoleUrl.push(BlankVars.rEvaluate); this.byRoleVal.push(this.data[key]); break;
                        case 'APPROVALINTERVIEW': this.byRoleKey.push(this.waitingInterview); this.byRoleUrl.push(BlankVars.rInterview); this.byRoleVal.push(this.data[key]); break;
                        case 'APPROVALREVERT': this.byRoleKey.push(this.approvalRevert); this.byRoleUrl.push(BlankVars.rRevert); this.byRoleVal.push(this.data[key]); break;
                        case 'APPROVALHCBD': this.byRoleKey.push(this.approvalHcbd); this.byRoleUrl.push(BlankVars.rPendAppr); this.byRoleVal.push(this.data[key]); break;
                        // UAT2: REMOVED - PENDING APPROVAL BY HCBO - case 'APPROVALHCBO': this.byRoleKey.push(this.approvalHcbo); this.byRoleUrl.push('job/pending-approval'); break;
                    }

                    if (this.usrRole == '5') {
                        this.byRoleKey.reverse();
                        this.byRoleUrl.reverse();
                        this.byRoleVal.reverse();
                    }
                }
            }
            console.log("this is byRoleKey at up");
            console.log(this.byRoleKey);
        },
            error => console.log('[ERROR - DashboardData] ' + error),
        );



        /**
         * Purpose: ERA user count(era.era_user_level) against employees (era_job_ads.job_data_pccs) . 
           adoptionRate:{total_user,total_empl,adoptionRate}
         * Author: Afdzal
    */
        this._GET_api_Service.GET_data('/dash/adoptionRate').subscribe(data => {
            this.adoptionRateVal = data['adoptionRate'];
        },
            error => console.log('[ERROR - adoptionRateVal] ' + error),
        );

        /**
        * Purpose: Get the statistic value for the month of given date.
        userCount: {total_user, fday,lday},
        jobAdvCount: {ads_count,public_count,internal_count, ne_promo_count},
        projAdvCount: {ads_count}
        */

        this._GET_api_Service.GET_data('/dash/byMonth/' + this.currDate).subscribe(data => {
            this.dashByMonthVal = data;
        },
            error => console.log('[ERROR - dashByMonthVal] ' + error),
        );

        /**
         * Purpose: Get the user count for each platform(apple,android) up to date given. 
         * {fcm_count},{android},{ios}
         */

        this._GET_api_Service.GET_data('/dash/platform/' + this.currDate).subscribe(data => {
            this.dashPlatformVal = data;
        },
            error => console.log('[ERROR - dashPlatformVal] ' + error),
        );

        /**
         * Get count for job adverstisment. 
         * {ads_count},{public_count},{internal_count},{ne_promo_count}
        */

        this._GET_api_Service.GET_data('/dash/jobAdv/' + this.currDate).subscribe(data => {
            this.dashjobAdvVal = data;
        },
            error => console.log('[ERROR - dashjobAdvVal] ' + error),
        );

        /**
         * Get count for career-TM Users. 
         * {_count}
        */

        this._GET_api_Service.GET_data('/summary/userCount/' + this.currDate).subscribe(data => {
            this.careerUserCount = data;
        },
            error => console.log('[ERROR - careerUserCount] ' + error),
        );

        this._GET_api_Service.GET_data('/summary/carrerJobAds/' + this.currDate).subscribe(data => {
            this.careerJobAdsCount = data;
        },
            error => console.log('[ERROR - careerJobAdsCount] ' + error),
        );

        this._GET_api_Service.GET_data('/summary/userByProvider/' + this.currDate).subscribe(data => {
            this.careerUserProvider = data;
        },
            error => console.log('[ERROR - careerUserProvider] ' + error),
        );

        this._GET_api_Service.GET_data('/summary/jobApplicants/' + this.currDate).subscribe(data => {
            this.careerJobApplicants = data;
        },
            error => console.log('[ERROR - careerJobApplicants] ' + error),
        );
    /**
    * Purpose: ERA user application count.
    total_job_applicant
    successful_applicants
    ne_job_applicant
    ne_job_succesful_applicant
    
    */

        this._GET_api_Service.GET_data('/dash/jobApplication/' + this.currDate).subscribe(data => {
            this.dashjobApplVal = data;
        },
            error => console.log('[ERROR - dashjobApplVal] ' + error),
        );

        /**
        * Purpose: ERA extraordinaire advertisment (Project base)
        ads_count
        * */
        this._GET_api_Service.GET_data('/dash/projAdvCount/' + this.currDate).subscribe(data => {
            this.projAdvVal = data;
        },
            error => console.log('[ERROR - projAdvVal] ' + error),
        );


        /**
        * Purpose: ERA extraordinaire appplication. (Project base)
        total_project_applicant
        success_count
        */
        this._GET_api_Service.GET_data('/dash/dashProjApplicant').subscribe(data => {
            this.projApplVal = data;
        },
            error => console.log('[ERROR - projApplVal] ' + error),
        );


    }

    dataNews: any[];
    ERRloadingNewsFeed = false;
    NewsFeedData() {
        this.loadingNewsFeed = true;
        this._GET_api_Service.GET_data(this.newsFeedAPI).subscribe(data => {
            this.loadingNewsFeed = false;
            this.dataNews = data;
        },
            error => {
                console.log('[ERROR - NewsFeedData] ' + error);
                this.loadingNewsFeed = false;
                this.ERRloadingNewsFeed = true;
            }
        );
    }

    ngAfterViewInit() {
    }

    showAction = true;
    getUserLoginInfo() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            this.usrRole = currentUser.job_role;
            if ((!this.usrRole) || (this.usrRole == null)) {
                // console.log("Normal 1");
                this.byRoleKey = new Array(); this.byRoleVal = new Array(); this.byRoleUrl = new Array();
                console.log("this is byRoleKey at down");
                console.log(this.byRoleKey);
                this.redirect('/coming-soon'); // this.redirect('/user/coming-soon');
            } else {
                this.usrLoginLvl = currentUser.userlevel;
                let uR = this.usrRole;
                if (
                    (!/1/i.test(this.usrRole)) && (!/2/i.test(this.usrRole) && (!/3/i.test(this.usrRole)) && 
                    (!/4/i.test(this.usrRole)) && (!/5/i.test(this.usrRole)) && (!/6/i.test(this.usrRole))
                    && (!/7/i.test(this.usrRole)) && (!/8/i.test(this.usrRole)) && (!/9/i.test(this.usrRole)) )) {
                    // console.log("Normal 2");
                    // this.redirect('/user/coming-soon');
                    this.redirect('/coming-soon');
                } else {
                    this.isAdmin = true;
                    let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token }); // 20180725
                    if ((uR == '1') || (uR == '4')) {
                        this.showAction = false;
                    }
                }
            }
        }
    }
    redirect(myUrl) {
        this.routers.navigate([myUrl]);
    }

    goAndroid() {
        window.location.href = 'http://bit.ly/2LQSG5J​';
    }

    goIOS() {
        window.location.href = 'itms-services://?action=download-manifest&url=https://bit.ly/2NK2a4n';
    }

    scrollToElement($element): void {
        //console.log($element);
        $element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    }

    scrollback = false
    scrollToElementAnimate(): void {
        if (this.scrollback === false) {
            let element = document.getElementById('askus');
            element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });

            let small = document.getElementById('smallround');
            small.classList.remove('animatesmallroundback');
            small.classList.add('animatesmallround');

            let scroll = document.getElementById('scroll');
            scroll.classList.remove('rotatescrollback');
            scroll.classList.add('rotatescroll');

            let big = document.getElementById('biground');
            big.classList.remove('animatebigroundback');
            big.classList.add('animatebiground');

            let scrollText = document.getElementById('scrollText');
            scrollText.classList.remove('.animatescrolltextback');
            scrollText.classList.add('.animatescrolltext');

            this.scrollback = !this.scrollback;
        }
        else if (this.scrollback === true) {
            let element = document.getElementById('home1');
            element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });

            let small = document.getElementById('smallround');
            small.classList.remove('animatesmallround');
            small.classList.add('animatesmallroundback');

            let scroll = document.getElementById('scroll');
            scroll.classList.remove('rotatescroll');
            scroll.classList.add('rotatescrollback');

            let big = document.getElementById('biground');
            big.classList.remove('animatebiground');
            big.classList.add('animatebigroundback');

            this.scrollback = !this.scrollback;
        }

    }

    menuClicked(path) {
        console.log(path);
        this.routers.navigate([path]);
    }
}