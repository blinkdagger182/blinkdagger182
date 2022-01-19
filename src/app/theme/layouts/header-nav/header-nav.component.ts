import { Component, OnInit, ViewEncapsulation, AfterViewInit, ComponentFactoryResolver } from '@angular/core';
// import { Helpers } from '../../../helpers';
import { Vars } from './header-nav-vars';
import { GET_Service } from '../../api/get.service';
import { AlertService } from '../../../auth/_services/alert.service';
import { AlertComponent } from '../../../auth/_directives/alert.component';
import { DatePipe } from '@angular/common';
import { GlobalVariable } from "../../../../environments/environment";
import { HostListener } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationStart } from "@angular/router";
import { POST_Service } from '../../api/post.service';

import { Helpers } from "../../../helpers";
import { AuthenticationService } from '../../../auth/_services/authentication.service';

declare let mLayout: any;
@Component({
    selector: "app-header-nav",
    templateUrl: "./header-nav2.component.html",
    styleUrls: ['header-nav.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class HeaderNavComponent implements OnInit, AfterViewInit {
    screenHeight: any;
    screenWidth: any;
    showUserName = true;

    isAdmin = false;
    isEngage = false;
    isRPM = false;
    isUser = false;
    currUsr = JSON.parse(localStorage.getItem('currentUser'));

    lgnName = this.currUsr.body.name;
    lgnEmail = this.currUsr.body.email;
    lgnComp = this.currUsr.body.company;
    lgnRole = this.currUsr.job_name;
    showExtraordinaire = true;

    rIndex = Vars.rIndex;
    rProfile = Vars.rProfile;
    profTitle = Vars.profTitle;
    rSettings = Vars.rSettings;
    settingsTitle = Vars.settingsTitle;
    rFaq = Vars.rFaq;
    faqTitle = Vars.faqTitle;
    rJobs = Vars.rJobs;
    jobsTitle = Vars.jobsTitle;
    rLogout = Vars.rLogout;
    logoutTitle = Vars.logoutTitle;
    rDownload = Vars.rDownload;
    downloadTitle = Vars.downloadTitle;

    rFaqUser = Vars.rFaqUser;
    faqTitleUser = Vars.faqTitleUser;
    exorTitle = Vars.exorTitle;
    rExor = Vars.rExor;

    imgAPIUrl = GlobalVariable.BASE_API_URL + '/get/image';
    apiKey = GlobalVariable.API_KEY;

    env = GlobalVariable.ENV_NAME;
    env_prod = false;

    constructor(private datePipe: DatePipe, private _GET_api_Service: GET_Service,
        private routers: Router, private _POST_api_Service : POST_Service,
        private _authService: AuthenticationService,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver) {
        this.getScreenSize();
    }

    showSetting = false;

    notify = false;
    total;
    curr_user_pic_Y: boolean;
    curr_user_pic_N: boolean;
    today = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    today_1 = this.datePipe.transform(new Date(), 'yyyy-MM-dd h:mm:ss a zzzz');
    twentyFourHour = 24 * 60 * 60 * 1000; //ms
    currentUser;
    loading = true;
    notifications: any[];
    noti_imgSrc;
    unread_noti = 0;
    user_img: boolean;
    imgOptArrList: any;

    headerBg = '';
    headerNav = '';
    userNameColor = '';

    nickName
    ngOnInit() {
        let nick = this.currUsr.body.nick_name;
        this.nickName = (nick === null || nick == "") ?  this.currUsr.body.name : nick;
        
        this.routers.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
                this.setHeaderStyle(event.url);
            }
        });

        if (this.env === 'prod')
            this.env_prod = true;
        else
            this.env_prod = false;

        let usrLoginLvl = this.currUsr.userlevel;
        this.getImgOpt();
        if (usrLoginLvl >= 100) {
            this.showSetting = true;
        }

        if(this.currUsr.job_role == '9' || this.currUsr.job_role == '10'){
            this.isRPM = true;
        }

        // if login using admin
        if (this.currUsr.isAdmin == true) {
            this.isAdmin = true;
            this.rIndex = "/admin" + Vars.rIndex;
            this.rProfile = "/admin" + Vars.rProfile;
            this.rSettings = "/admin" + Vars.rSettings;
            this.rFaq = "/admin" + Vars.rFaq;
            this.rDownload = "/admin" + Vars.rDownload;
        }
        else if(this.currUsr.isEngagement == true){
            this.isEngage = true;
            this.rIndex = "/engage";
            this.rProfile = "/engage" + Vars.rProfile;
        }
        
        if(this.isRPM == true){
            this.rIndex = "/admin/maps";
        }

        if (this.currUsr.isUser == true) {
            this.isUser = true;
            this.rFaqUser = "/" + Vars.rFaqUser;
            this.setHeaderStyle(this.routers.url);
        }

        
        //notification
        var nowDate_ms = new Date(this.today_1);

        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

        type TrackingData = {
            idx: number, app: string, category: string, class: string, click: number, 
            created_by: string, creator_name: string, datetime: string, description: string,
            id: number, image_src: string, img_exist: boolean, read: number, success: number, 
            target_userid: string, title: string, type: string
        };
        let myarray: TrackingData[] = [];
        this._GET_api_Service.GET_data('/notification/get')
            .subscribe(data => {
                this.loading = false;

                for (let i = 0; i < data.body.length; i++) {

                    var postDate_ms = new Date(this.datePipe.transform(data.body[i].datetime, 'yyyy-MM-dd h:mm:ss a zzzz'));

                    if(data.body[i].click == 0){
                        this.unread_noti++;
                    }
                    // if ((Number(nowDate_ms) - Number(postDate_ms)) < this.twentyFourHour) {
                    //     this.new_nofi++;
                    // }

                    if (data.body[i].image_url)
                        this.user_img = true;
                    else
                        this.user_img = false;

                    this.noti_imgSrc = this.imgAPIUrl + '/' + data.body[i].image_url + '?api_key=' + this.apiKey;

                    myarray.push({
                        idx: i, app: data.body[i].app, category: data.body[i].category, class: data.body[i].class, click: data.body[i].click, 
                        created_by: data.body[i].created_by, creator_name: data.body[i].creator_name, datetime: data.body[i].datetime, description: data.body[i].description,
                        id: data.body[i].id, image_src: this.noti_imgSrc, img_exist: this.user_img, read: data.body[i].read, success: data.body[i].success, 
                        target_userid: data.body[i].target_userid, title: data.body[i].title, type: data.body[i].type
                    });
                }

                if (this.unread_noti >= 1) {
                    this.notify = true;
                }
                this.notifications = myarray;
                // console.log(this.data)
                this.total = this.notifications.length;
                // console.log(this.unread_noti)

            },
            error => {
                this.showAlert('alertError');
                this._alertService.error("Loading Notifications Failed");
                console.log('[ERROR - Notifications] ' + error);
                this.loading = false;
            })
        localStorage.setItem('tabMode', JSON.stringify('urgent')); // to save mode
    }

    setHeaderStyle(url) {
        if(this.isUser === true) {
            // if(url !== '/index' && url !== '/features' && url !== '/user-job' && url !== '/user-job/search-job' ) {
            //     this.headerBg = "hd-bg-default";
            //     this.headerNav = "";
            //     this.userNameColor = "nameColorDf";
            // }
            // else {
                this.headerBg = "hd-bg-trans";
                this.headerNav = "nav-link-styles";
                this.userNameColor = "nameColorCh";
            // }
        }
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        if(this.isUser){
            const scrollOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;        
            if(scrollOffset > 40) {
                this.headerBg = "hd-bg-default";
                this.headerNav = "";
                this.userNameColor = "nameColorDf";
            }
            else {
                // if(this.routers.url === '/index' || this.routers.url === '/features' || this.routers.url === '/user-job' 
                //     || this.routers.url === '/user-job/search-job') {
                    this.headerBg = "hd-bg-trans";
                    this.headerNav = "nav-link-styles";
                    this.userNameColor = "nameColorCh";
                // }
            }
        }
    }

    tab = 'urgent';
    getTabMode() {
        if (this.tab) {
            this.tab = JSON.parse(localStorage.getItem('tabMode'));
        } else {
            this.tab = 'urgent';
        }
    }

    activeClick(num) {
        switch (num) {
            case 1 : 
                this.tab = 'urgent';
                localStorage.setItem('tabMode', JSON.stringify('urgent'));
                break;
            case 2 : this.tab = 'team';
                break;
            case 3 : this.tab = 'jobs';
                break;
            case 4 : this.tab = 'track';
                break;
            case 5 : 
                this.tab = 'feat';
                localStorage.setItem('tabMode', JSON.stringify('feat'));
                break;
            case 6 : this.tab = 'noti';
                break;
        }
    }

    featClick() {
        localStorage.setItem('tabMode', JSON.stringify('feat'));
    }

    isLogout() {
        let loginType = 'user';
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.isAdmin == true) loginType = 'admin';
        else if (currentUser && currentUser.isEngagement == true) loginType = 'engage';
        else loginType = 'user';

        Helpers.setLoading(true);
        // reset login status
        this._authService.logout();

        if (loginType === 'admin')
            this.routers.navigate(['/admin']);
        else if(loginType === 'engage')
            this.routers.navigate(['/engagement']);
        else {
            localStorage.clear();
            this.routers.navigate(['/welcome']);
        }
    }

    checkType(notiType){
        return (notiType == 'like' || notiType == 'job' || notiType == 'extraordinaire' || notiType == 'comment' || notiType == 'happymeter' || notiType == 'birthday' || notiType == 'video' ) ? false : true;
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
        //console.log(this.screenWidth, this.screenHeight );
        if (this.screenWidth <= 320) {
            this.showUserName = false;
        }
        else
            this.showUserName = true;
    }

    showAlert(target) {
        this[target].clear();
        let factory = this.cfr.resolveComponentFactory(AlertComponent);
        let ref = this[target].createComponent(factory);
        ref.changeDetectorRef.detectChanges();
    }

    ngAfterViewInit() {
        mLayout.initHeader();
    }

    offIcon() {
        this.notify = false;
    }

    seeAllNotification(){
        if(this.isAdmin){
            this.routers.navigate(['/admin/notification']);    
        }
        else{
            this.routers.navigate(['/notifications']);
        }
    }

    now : any = new Date();
    before;
    older_24Hrs(date){
        this.before = new Date(date);
        return ( ( this.now - this.before ) > ( 1000 * 60 * 60 * 24 )  ) ? true : false;
    }

    updClickNotiAPI = '/notification/mark/click';

    notificationClick(index){
        let msg = this.notifications[index]
        console.log(msg)
        let posId = {
            "notificationID" : msg.id
        }
        this.notifications[index].click = 1;

        this._POST_api_Service.POST_data(this.updClickNotiAPI, posId).subscribe(res => {
            switch(msg.app){
                case 'TeamUp':{
                  switch(msg.class){
                    case 'Circle':{
                      // open friend profile with msg.Category
                      this.routers.navigate(['/other-profile', msg.category]);
                      break;
                    }
                    case 'Job':{
                      // open lob list with msg.Category 
                      this.routers.navigate(['/user-job']);
                      break;
                    }
                    case 'Extraordinaire':{
                      // open extradrdinaire with msg.Category 
                    //   this.routers.navigate(['/extraordinaire']);
                      document.getElementById('extra2-btn').click();
                      break;
                    }
                    case 'AdvTracker':{
                      // open tracking page
                      this.routers.navigate(['/user-job/tracking']);
                      break;
                    }
                    case 'Profile':{
                      // open own profile
                      this.routers.navigate(['/profile']);
                      break;
                    }
                    case 'Comment':{
                      // open related comment
                      this.routers.navigate(['/user-job/comments', msg.category]);
                      break;
                    }
                    case 'HappyMeter':{
                      // open own profile
                      this.routers.navigate(['/happy-meter']);
                      break;
                    }
                    case 'Birthday':{
                      // open list of birthday who wish you
                      break;
                    }
                    case 'Wish':{
                      break;
                    }
                    case 'Url':{
                        window.open(msg.category);
                        break;
                      }
                    case 'harrison':{
                      // open own profile
                      window.open(msg.category);
                      break;
                    }
                    case 'functional':{
                      // open own profile
                      this.routers.navigate(['/user-job/tracking'], { queryParams: { node: 2, id: msg.category } });
                      break;
                    }
                    case 'talent':{
                      // open own profile
                      this.routers.navigate(['/user-job/tracking'], { queryParams: { node: 1, id: msg.category } });
                      break;
                    }
                    default:{
                      // open notification page
                      this.routers.navigate(['/notifications']);
                      break;
                    }
                  }
                  break;
                }
                default:{
                  // open notification page
                  this.routers.navigate(['/notifications']);
                  break;
                }
            }

        },
        error => {
            console.log('[ERROR - Notifications] ' + error);
        })
    }

    getImgOpt() {
        if (this.currUsr.body.image_url) {
            let img = this.currUsr.body.image_url;
            this._GET_api_Service.GET_Picture('/get/image/' + img).subscribe(data => {
                if (data && this.currUsr.body.image_url) {
                    this.imgOptArrList = GlobalVariable.BASE_API_URL + Vars.APIGetImg + "/" + img + "?api_key=" + GlobalVariable.API_KEY;
                    this.curr_user_pic_Y = true;
                    this.curr_user_pic_N = false;
                    localStorage.setItem('userProfilePic', JSON.stringify(img));
                }
            },
                error => {
                    this.imgOptArrList = '0';
                    this.curr_user_pic_Y = false;
                    this.curr_user_pic_N = true;
                    localStorage.setItem('userProfilePic', JSON.stringify(parseInt(this.imgOptArrList)));
                });
        }
        else {
            this.curr_user_pic_Y = false;
            this.curr_user_pic_N = true;
        }
    }

    checkHidden(){
        if(this.isAdmin || this.isEngage || this.isRPM)
            return false;
        else
            return true;
    }

    menuClicked(path) {
        this.routers.navigate([path]);
    }

}