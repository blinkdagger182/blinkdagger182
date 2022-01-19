import { ComponentFactoryResolver, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
//import { ActivatedRoute } from '@angular/router';
import { Routes, Router, RouterModule, ActivatedRoute, NavigationStart, ActivatedRouteSnapshot, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { Vars } from './assessment-vars';
import { GET_Service } from '../../../api/get.service';
import { UserPagerService } from '../pager/pager.component';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Location, DatePipe } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { POST_Service } from '../../../api/post.service';
import { GlobalVariable } from "../../../../../environments/environment";
import { msgFeedbackArr } from "./arrayfb";
import { StringBreakPipe } from '../../../../_custom_pipe/string_break.pipe';
import "rxjs/add/operator/map";
import { isNgTemplate, identifierModuleUrl } from '@angular/compiler';
import { ExOrHistoryModule } from '../extraordinaire/history/history.module';
import { NotifierService } from 'angular-notifier';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';

import { EnLang, MyLang } from '../user-job/language/language-vars';


@Component({
    selector: 'app-assessment-component',
    templateUrl: './assessment.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./assessment.component.css']
})
export class AssessmentComponent implements OnInit {
    title1 = Vars.title1;
    feedBack = Vars.feedBack;
    searcName = Vars.APIsearchCircle;
    downloadAllXLS = Vars.downloadAllXLS;
   
    downloadCSV = true;
    filterForm : FormGroup;
    replyBtn = false;
    curr_user_pic_No: boolean;
    curr_user_pic_Yes = true;
    displayText = false;
    loading = false;
    loadingErr = false;
    public termStaffId: string;
    mySearch: string;
    param: string;
    name: string = '';
               
    //Img
    imgAPIUrl = GlobalVariable.BASE_API_URL + '/get/image';
    apiKey = GlobalVariable.API_KEY;

     env = GlobalVariable.ENV_NAME;
     env_prod = false;

    getImgCir() {
        let url = GlobalVariable.BASE_API_URL + Vars.APIGetImg;
        return url;
    }

    getApikey() {
        let apikey = GlobalVariable.API_KEY;
        return apikey;
    }

    gotRouteId = false;

    private readonly notifier: NotifierService;
    constructor(
        private datePipe: DatePipe,
        private pagerService: UserPagerService,
        private _GET_api_Service: GET_Service, 
        private route: ActivatedRoute,
        private _script: ScriptLoaderService,
        private http: Http, private routers: Router,
        private _POST_api_Service: POST_Service,
        notifierService: NotifierService, private _location : Location
    ) 
       {
            this.notifier = notifierService;

            this.route.params.subscribe(params => {
                this.commentId = params.Id;
                if(params.id){
                    this.gotRouteId = true;
                }
            });
                    
        }

        
        currUserName; currUserImgSrc;
        fbListData = [];
        fbReply = [];
        imgArr = [];
        gettxtSent =[];
        imgAskusArrList : any;
        apiKeyAskusList : any;
        results: any;
        fbTxtSentiment = Array<msgFeedbackArr>();
        commentId: any;
        closeId: any;
        commentLoading = true;
        displayTotal = true;
        selectedIcon;
        selectedBodystyle: string;
        searchText;
        found: boolean;
        updateReply = false;  
        curr_user_pic_Y: boolean;
        curr_user_pic_N: boolean;
        imgOptArrList: any;
        marked = false;
        theCheckbox = false;
        temp = [];

        showStatus = true; showPend = true; showClosed=true; showInProg=true;
        showSentiment = true; showPos=true; showNeg = true; showNeu=true;
        showType = true;  showStaffId = true;

        
        addComntForm = new FormGroup({
            newComnt: new FormControl()
        });

      
        editComntForm = new FormGroup({
            editComnt: new FormControl()
        });
   
    enChecked : boolean = true;
    word: any;
    ngOnInit() {
       if(this.env === 'prod')
       this.env_prod = true;
       else
       this.env_prod =false;


        let lang = localStorage.getItem('lang');
        if(lang)
        {
            if(lang === 'en') {
                this.enChecked = true;
                this.word = EnLang;
            }
            if(lang === 'my') 
            {
                this.enChecked = false;
                this.word = MyLang;
            }
        }
        else{
            this.enChecked = true; 
            this.word = EnLang;
            localStorage.setItem('lang','en');
        }

        let currUser = JSON.parse(localStorage.getItem('currentUser'));
        this.currUserName = currUser.body.name;
        this.currUserImgSrc = this.imgAPIUrl + '/' + currUser.body.image_url + '?api_key=' + GlobalVariable.API_KEY;

        let srcParam = this.route.snapshot.paramMap.get('staffId');
       
        this.imgAskusArrList = this.getImgCir();
        this.apiKeyAskusList = this.getApikey();
        this.commentsData = [];

        this.getFilter();
        this.filterForm = new FormGroup({
            filterStatus: new FormControl('', Validators.required),
            filterType: new FormControl('', Validators.required),
            filterSent: new FormControl('', Validators.required),
            filterStaffId: new FormControl('', Validators.required),
        });

        this.filterForm.setValue({
            filterStatus: "",
            filterType: "",
            filterSent: "",
            filterStaffId: "",
                      
        })
             
        this.submitFilter(0);

        this.getUserList();
    }

    ngAfterViewInit() {
        setTimeout(function() {
            this._script.loadScripts('app-assessment-component',
                [
                    'assets/js/user/assessment/assessment.js',
                ]);
        }.bind(this), 3000);
    }
         
    //Sentiment Analysis
    isPolarity(val,textSentiment){
        
        let sentiment = JSON.parse(textSentiment);
        let polarity = sentiment.Polarity;
          if(polarity === val){
             return true;
         }
        else
            return false;
    }

    isNeutral(val,textSentiment){
        let sentiment = JSON.parse(textSentiment);
        let polarity = sentiment.Polarity;
        if(polarity === val){
            return true;
        }
        else
            return false;
    }

    isNegative(val,textSentiment){
        let sentiment = JSON.parse(textSentiment);
        let polarity = sentiment.Polarity;
        if(polarity === val){
            return true;
        }
        else
            return false;
    }
  
    onNameKeyUp(event: any) {
        this.name = event.target.value;
        this.found = false;
     }

    // filterArr = [];
    
    loadingItem = true;
    filterArr = {};

    getFilter(){
        this.filterArr= {};
        let getFilterAPI = Vars.APIfeedbackFilter;
        this._GET_api_Service.GET_data(getFilterAPI).subscribe(data => {
            
            this.filterArr = data.filter;
            this.loadingItem = false;
        }, error => {
            console.log('[ERROR - Fail to get report filters] ' + error);
        });
    }
       
    postSearchAPI = Vars.APIfeedbackSearch;
    data2: any = [];
    displayImg = [];
    imageData= [];
    
    submitFilter(type) {
               
        let dataPos = {};
       
        if(type === 0){
            dataPos = {
                status: '',
                sentiment: '',
                type: '',
                staffId: '',
             
            }
        }
        else if(type === 1){
           
            dataPos = {
                status: this.filterForm.get('filterStatus').value === 'All'|| this.filterForm.get('filterStatus').value === null ? '' : this.filterForm.get('filterStatus').value,
                sentiment: this.filterForm.get('filterSent').value === 'All'|| this.filterForm.get('filterSent').value === null ? '' : this.filterForm.get('filterSent').value, 
                type: this.filterForm.get('filterType').value === 'All'|| this.filterForm.get('filterType').value === null ? '' : this.filterForm.get('filterType').value,
                staffId: this.name,
            }
           
        }  
        else if(type === 2){
            dataPos = {
                status: 'Closed',
                sentiment: '',
                type: '',
                staffId: '',
            };
            this.filterForm.patchValue({
                filterStatus: 'Closed',
                filterSent: '',
                filterType: '',
                filterStaffId: '',
            });
        } 

        else if(type === 3){
            dataPos = {
                status: '',
                sentiment: '',
                type: '',
                staffId: this.name,
            };
            this.filterForm.patchValue({
                filterStatus: '',
                filterSent: '',
                filterType: '',
                filterStaffId: this.name,
            });
        } 
        
        this.loading = true;
        let imgGetSrc;
        let imgGetAttach;
        type TrackingData = {
            id: number, user_id: string, title:string, 
            description: string, profile_img: string, attach_img: string, datetime: Date, label:string, 
            rating:number, rating_desc:string, type: string,  sentiment: string, reply:number,
            status:string, Pers_No: number, Name:string, Email:string,
            Cell_No:number, Org_Unit_Desc: string, verified:string,
            displayImage: string, HiEduLvl:string, Rept_To_Name:string, PersAdmin_Descr:string,
            EmpGroup: string, EmpSGroup: string, Job_Grad:string, verfyLoading:boolean,
                                           
        }; 
        let myarray: TrackingData[] = [];
        let sDt: string;
        this._POST_api_Service.POST_data(this.postSearchAPI, dataPos).subscribe(data => {
            
            for(let i=0; i<data.length; i++){
                this.imageData.push({img:data[i].attach_img});
                if(this.imageData[i].img === null){
                    this.displayImg[i] = [];
                }
                else if(this.imageData[i].img !== null){
                    this.displayImg[i] = this.imageData[i].img.split(";");
                }
            }

            for (let i = 0; i < data.length; i++) {
                sDt = this.datePipe.transform(data[i].datetime, "dd-MMM-yyyy");
                let imgView;
              
                imgView = data[i].profile_img;
                if(imgView){
                    imgGetSrc = this.imgAPIUrl + '/' + imgView + '?api_key=' + GlobalVariable.API_KEY;
                    // this.curr_user_pic_Yes = true;
                }
                else
                    imgGetSrc = './assets/app/media/img/users/ghcm-user-default.jpg';
                let imgAttach;
                imgAttach = data[i].attach_img;
                if(imgAttach){
                    imgGetAttach = this.imgAPIUrl + '/' + imgView + '?api_key=' + GlobalVariable.API_KEY;
                   }
               
               
            myarray.push({
                id: data[i].id, user_id: data[i].user_id, title: data[i].title, 
                description: data[i].description, profile_img:imgGetSrc,  attach_img:imgGetAttach, datetime: data[i].datetime, label: data[i].type,   
                rating: data[i].rating, rating_desc: data[i].rating_desc,  type:data[i].type, sentiment: data[i].sentiment, reply: data[i].reply,
                status: data[i].status, Pers_No:data[i].Pers_No, Name: data[i].Name, Email: data[i].Email, 
                Cell_No: data[i].Cell_No, Org_Unit_Desc:data[i].Org_Unit_Desc, verified: data[i].verified,
                displayImage:this.displayImg[i], HiEduLvl:data[i].HiEduLvl, Rept_To_Name:data[i].Rept_To_Name, PersAdmin_Descr:data[i].PersAdmin_Descr,
                EmpGroup: data[i].EmpGroup, EmpSGroup: data[i].EmpSGroup, Job_Grad:data[i].Job_Grad,verfyLoading:false
            });

        }             
      
        // this.data2 = data;
        this.displayAdminMsg= true;
        this.data2 = myarray;
        this.setPage(1);
        this.loading = false;
    },
    error => {
        console.log('[ERROR] Fail to submit filter: ' + error);
    }); 
    };

    commentsData: any;
    displayAdminMsg= true;
    selReplyId: any={};

    now : any = new Date();
    before;
    older_24Hrs(date){
        this.before = new Date(date);
        return ( ( this.now - this.before ) > ( 1000 * 60 * 60 * 24 )  ) ? true : false;
    }
     
    private allItems: any[];// array of all items to be paged
    pager: any = {};// pager object
    pagedItems: any[];// paged items
    pageSize = Vars.maxFbPerPage;
    setPage(page: number) {
        this.pager = this.pagerService.getPager(this.data2.length, page, this.pageSize);
        this.pagedItems = this.data2.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

   
    transformDate(date) {
        return this.datePipe.transform(date, 'dd-MM-yyyy h:mma'); //whatever format you need. 
    }

    /** :start DOWNLOAD CSV  */
    //  downloadCSV = true;
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
        let dwApi: string;
        let dwData = [];
    
        this._GET_api_Service.GET_data(dwApi).subscribe(data => {
            dwData = data;
            this.download2(dwData);
            this.downloading = false;
        },
            error => {
                console.log('[ERROR - Populate data from Ask Us Download API] ' + error);
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
        a.download = 'AskUs_' + dateToday + '.csv';
        a.click();
        return 'success';
    }
    /** :end DOWNLOAD CSV  */

    //TRACKING CODE IMITATION
    langChange(id){
        let selectedLang = id.value;

        if(selectedLang === 'en')
        {
            this.word = EnLang;
            localStorage.setItem('lang', 'en');
            this.enChecked = true;
        }
        if(selectedLang === 'my')
        {
            this.word = MyLang;
            localStorage.setItem('lang', 'my');
            this.enChecked = false;
        }

        document.getElementById('lang_close').click();
    }

    btnBackClick(){
        this._location.back();
    }
    
    //TRACKING TAB 
    loadingHist = true;
    HistList = [];
    getUserList() {
        this._GET_api_Service.GET_data('/engagement/user/list').subscribe(data => {
            this.HistList = data;
            this.loadingHist = false;
        });
    }
}
