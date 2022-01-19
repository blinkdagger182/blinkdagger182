import { Component, OnInit, AfterViewInit, ViewEncapsulation, HostListener, ElementRef, ViewChild, Inject } from '@angular/core';
import { BlankVars } from './blank-vars';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { GlobalVariable } from "../../../../../../environments/environment";
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ComVars } from '../../../user/user-job/comments/comments-vars';
import { defineDirective, e } from '@angular/core/src/render3';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from "@angular/common/http";
import { DatePipe } from '@angular/common';
import {EmojiPickerModule} from 'ng-emoji-picker';
// import Swiper core and required modules
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { EnLang, MyLang } from '../../../user/user-job/language/language-vars';
import { convertCompilerOptionsFromJson } from 'typescript';
// import { HeaderNavComponent } from '../../../../layouts/header-nav/header-nav.component';

declare let $: any;

@Component({
    selector: 'app-u-blank', 
    templateUrl: './blank2.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['../../../../../../assets/blank/fonts/font.css', './default.css', './blank.component.css'],
})
export class UserBlankComponent implements OnInit, AfterViewInit {
   
    isAdmin = false;
    newday = new Date();
    today: number = Date.now();
    usrLoginLvl = localStorage.getItem('userlevel');
    usrRole: string;
    dashboardAPI = BlankVars.dashboardAPI;
    newsFeedAPI = BlankVars.newsFeedAPI;
    feedbackAPI = BlankVars.feedBack;
    feedbackTmMoveAPI = BlankVars.feedBackTmMove;
    loadingNewsFeed = true;
    feedbackForm: FormGroup;
    commentForm: FormGroup;
    secLayerForm: FormGroup;
    commentsData: any;
    userProfilePic: any;
    // likeNewsAnnouncement: any;
    likeComment: any;
    // unlikeNewsAnnouncement: any;
    unlikeComment: any;
    currentUserId: any;
    deleteFirstLayer: any;
    deleteSecondLayer: any;
    word: any;
    likeSecondLayerComm: any;
    // text: any;
    enChecked: boolean = true;
    commentLoading2 = true;
    fbShowMsg = false;
    env = GlobalVariable.ENV_NAME;
    env_prod = false;
    @ViewChild('AnncModalButton') divClick: ElementRef;
    @ViewChild('annc_close_modal') closebutton: ElementRef;
    public openPopup: Function;
    announcementComment: any=''
    setPopupAction(fn: any) {
        this.openPopup = fn;
    }
    
    UserComments:any;
    commentEditIndex:any=null;
    commentEditSecIndex:any=null;
    tempComment:any='';
    totalCommArrLength:any;
    secLayComm:any;
    replyCommentIndex:any;
    isReplying: boolean=false;

    showMyContainer: boolean = true;

    private readonly notifier: NotifierService;
    constructor(
        @Inject(DOCUMENT) 
        private document: any,
        private _GET_api_Service: GET_Service, 
        private _POST_api_Service: POST_Service,
        notifierService: NotifierService,
        public el: ElementRef,
        private http: Http, 
        public datePipe: DatePipe,
        private domSanitizer: DomSanitizer,
        // private headerClass: HeaderNavComponent,
        private activeRoute: ActivatedRoute, private routers: Router) {
        // this.getUserLoginInfo();
        this.notifier = notifierService;        
        }

    actionSum = [];
    loading = true;
    oldDesign = false;
    newDesign = true; // After SEA design complete, make this 'newDesign' to false
    feedbackCat = ['Technical', 'TM Mobility Center']
    isSupervisor = false;

    showTalent = false;
    showNomination = false;
    isCritical = false;
    tab;
    lorenIpsum = [
        "ERA-255: As employee, I want to receive notification on name of jobs being advertised ",
        "ERA-276: As employee, I want to be able to edit my profile like ERA",
        "ERA-285: As admin, I want to be able to track and view which features users clicks "
    ];
    payInDay;
    payInProgress;
    payInDate;
    payInMonth;
    payInList;

    payDateList = [];
    showEvl:boolean =true;


    ngOnInit() {
        //to enable to production var env_prod
        if(this.env === 'prod'){
            this.env_prod = true;
        }
        else {
            this.env_prod = false;
        }

        let lang = localStorage.getItem('lang');
        if (lang) {
            if (lang === 'en') {
                this.enChecked = true;
                this.word = EnLang;
            }
            if (lang === 'my') {
                this.enChecked = false;
                this.word = MyLang;
            }
        }
        else {
            this.enChecked = true;
            this.word = EnLang;
            localStorage.setItem('lang', 'en');
        }

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.currentUserId = currentUser.userid;
        // console.log(this.currentUserId, "currUser");
        // console.log(typeof this.currentUserId, "currUser type");

        this.getTime();
        this.renderAnnc();
        this.checkProject();
        this.syncTokenMaps(); // token for MAPS
        this.DashboardData();
        this.NewsFeedData();
        //this.checkEligibleVrpUsr();
        this.checkEligibleVspUsr();

        // if(!this.env_prod){
            this.getAnnList();
        // }
        // console.log('env_prod: ',this.env_prod);

        //check Supervisor and store in localSorage
        this._GET_api_Service.GET_data(BlankVars.getBadgeAPI).subscribe(res => {
            let i = res.findIndex(x => x.type === 'subordinate');
            if (i >= 0) {
                let isSuperior;
                if (res[i].badge > 0) {
                    isSuperior = '1';
                    this.showTalent = true;
                    this.isSupervisor = true;
                } else {
                    isSuperior = '0';
                    this.showTalent = false;
                    this.isSupervisor = false;
                }
                localStorage.setItem('isSuper', isSuperior);
            }
        });

        this.commentForm= new FormGroup({
            userComment: new FormControl("")
        })

        this.secLayerForm = new FormGroup({
            replyComment: new FormControl("")
        })

        this.commentsData = [];

        // this.likeNewsAnnouncement;

        this.likeComment = [];

        // this.unlikeNewsAnnouncement;

        this.unlikeComment = [];

        this.deleteFirstLayer = [];

        this.deleteSecondLayer = [];

        this.likeSecondLayerComm = [];

      
        //this.userProfilePic = this.domSanitizer.bypassSecurityTrustUrl(localStorage.getItem('userProfilePic'));
        this.userProfilePic = JSON.parse(localStorage.getItem('currentUser')).body.image_url
        //this.userProfilePic = localStorage.getItem('userProfilePic'); 
        //change (this.userProfilePic != 0) to new validate 20211209 zam 
        if(this.userProfilePic != 0 && this.userProfilePic != null) {
            //this.userProfilePic  = this.userProfilePic.replace(/"/g , '');
            this.userProfilePic  = GlobalVariable.BASE_API_URL + BlankVars.APIGetImg + "/" + this.userProfilePic  + "?api_key=" + GlobalVariable.API_KEY;
        }

        // for progress circle salary payroll countdown
        this._GET_api_Service.GET_SEA_data(BlankVars.getPayDateInfo).subscribe(res => {
            this.payInDay = res.RemainingDays[0].Days;
            this.payInProgress = res.Progress[0].Percentage;
            // need disable 118-119 this due to error substring API return timestamp value - 20210721 zam
            // let payDate = res.NextPaydate[0].Date.split(" ");
            // this.payInDate = payDate[0] + ' ' + payDate[1].substring(0, 3) + ' ' + payDate[2];    
            this.payInList = res.ListPaydate.slice(this.month);

            //[standby] substring undefined problem due to api send timestamp format date - 20210721 zam
            //console.log('getPayDateInfo: ', res);
            let payDateFormat = "d/MM/y";
            //check if isdate       
            if(this.isValidDate(res.NextPaydate[0].Date)){
                this.payInDate = this.datePipe.transform(res.NextPaydate[0].Date,payDateFormat);
                //console.log('payInDate: m1');
            } else {
                this.payInDate = res.NextPaydate[0].Date;
                //console.log('[ERROR] payInDate: ',res.NextPaydate[0].Date);
            }

            let today = new Date();
            let isNextTrue = false;
            res.ListPaydate.filter(item => {

                // need disable change due to API send date timestamp - 20210721 zam
                // if (this.validatePaydays(item)) {
                //     let payDate = item.Salary_Date.split(" ");
                //     let monthIndex = this.monthStringFull.indexOf(payDate[1]);

                //     if (+payDate[2] >= this.year && monthIndex === this.month && +payDate[0] >= today.getDate() && !isNextTrue) {
                //         isNextTrue = true;
                //         this.payDateList.push({ date: payDate[0], month: payDate[1], year: payDate[2], nextPay: true })
                //     }
                //     else if (+payDate[2] >= this.year && monthIndex === this.month + 1 && !isNextTrue) {
                //         isNextTrue = true;
                //         this.payDateList.push({ date: payDate[0], month: payDate[1], year: payDate[2], nextPay: true })
                //     }
                //     else {
                //         this.payDateList.push({ date: payDate[0], month: payDate[1], year: payDate[2], nextPay: false })
                //     }                    
                // };

                //[standby] new checking isvalid date from API & push next listing for paydate - 20210721 zam
                if (this.isValidDate(item.Salary_Date)) {
                    //let payDate = item.Salary_Date.split(" ");
                    //let monthIndex = this.monthStringFull.indexOf(payDate[1]);
                    let currDateFormatTs = new Date();
                    let payDateFormatTs = new Date(item.Salary_Date);
                    // console.log('currDateFormatTs: ',currDateFormatTs);
                    // console.log('payDateFormatTs: ',payDateFormatTs);
                    let payDate = this.datePipe.transform(item.Salary_Date,payDateFormat);
                    let dayIndex = Number(this.datePipe.transform(item.Salary_Date,"d"));
                    let monthIndex = this.datePipe.transform(item.Salary_Date,"MMMM");
                    let yearIndex = this.datePipe.transform(item.Salary_Date,"yyyy");

                    if (payDateFormatTs >= currDateFormatTs){
                        this.payDateList.push({ date: dayIndex, month: monthIndex, year: yearIndex, nextPay: false })
                    }                
                };
            });

        },
            error => {
                // console.log('[ERROR] cannot get pay date info ' + error);
            });
        this.payInMonth = this.monthStringFull.slice(this.month);

        this._GET_api_Service.GET_data(BlankVars.actionSummaryAPI).subscribe(sum => {
            this.actionSum = sum;
            let num = (this.actionSum[14].badge != 0) ? this.actionSum[14].badge : this.actionSum[14].total;
            let total = (num == null) ? 0 : num;
            if (total === 0) {
                this.showTalent = false;
            } else {
                this.showTalent = true;
            }

            let isCritical;
            let j = sum.findIndex(x => x.TYPE === 'critical');
            if (j >= 0) {
                if (sum[j].badge > 0) {
                    isCritical = '1';
                    this.showNomination = true;
                    this.isCritical = true;
                } else {
                    isCritical = '0';
                    this.showNomination = false;
                    this.isCritical = false;
                }
            }

            localStorage.setItem('isCritical', isCritical);
            this.loading = false;
        });

        this.feedbackForm = new FormGroup({
            fbCat: new FormControl(['Technical'], Validators.required),
            fbTitle: new FormControl(null, Validators.required),
            fbMsg: new FormControl(null, Validators.required),
        });

        setTimeout(() => {
            this.closebutton.nativeElement.click();
        }, 1000 * 60)

        this.tab = JSON.parse(localStorage.getItem('tabMode'));

        //START: jquery for multi carausel
        /*
            Carousel
        */
        $('#carousel-annoucement').on('slide.bs.carousel', function (e) {
            /*
                CC 2.0 License Iatek LLC 2018 - Attribution required
            */
            var $e = $(e.relatedTarget);
            var idx = $e.index();
            var itemsPerSlide = 5;
            var totalItems = $('.carousel-item').length;
        
            if (idx >= totalItems-(itemsPerSlide-1)) {
                var it = itemsPerSlide - (totalItems - idx);
                for (var i=0; i<it; i++) {
                    // append slides to end
                    if (e.direction=="left") {
                        $('.carousel-item').eq(i).appendTo('.carousel-inner');
                    }
                    else {
                        $('.carousel-item').eq(0).appendTo('.carousel-inner');
                    }
                }
            }
        });
        //END: jquery for multi carausel

        $('.selectpicker').selectpicker();
        
    }

    langChange(id) {
        let selectedLang = id.value;

        if (selectedLang === 'en') {
            this.word = EnLang;
            localStorage.setItem('lang', 'en');
            this.enChecked = true;
        }
        if (selectedLang === 'my') {
            this.word = MyLang;
            localStorage.setItem('lang', 'my');
            this.enChecked = false;
        }

        document.getElementById('lang_close').click();

    }


    modalTitle: any;
    modalBody: any;
    delBtn = false;
    index: any; commentId: any;
    deleteCommentModal(index, comId) {
        this.index = index;
        this.commentId = comId;
        this.modalTitle = this.word.delete;
        this.modalBody = this.word.delQues;
        this.delBtn = true;
    }

    deleteCommentModal2(index, comId) {
        this.index = index;
        this.commentId = comId;
        this.modalTitle = this.word.delete;
        this.modalBody = this.word.delQues;
        this.delBtn = true;
    }

    //To edit comment at first layer
    editComm(index, comId, comLayer){
        this.cancelReply();
        // console.log(index, comId, comLayer, "idx, id, layer")
        this.cancelEditComment();
        if(comLayer==1){
            this.commentEditIndex= index;
            this.tempComment= this.firstCommArr[index].comment;
        }
        else {
            this.commentEditSecIndex=index;
            this.tempComment= this.secondCommArr[index].comment;
        }
        // console.log(comId, "comId");
        // console.log(this.firstCommArr[index].id, "first commArrId");
        
        // $('#edit_' + this.commentId).removeClass('m--hide');
        // $('#edit2_' + this.commentId).addClass('m--hide');

        // this.index = index;
        // this.commentId = comId;

        // $('#edit_' + comId).addClass('m--hide');
        // $('#edit2_' + comId).removeClass('m--hide');
    }

    cancelEditComment(){
        this.commentEditIndex= null;
        this.commentEditSecIndex= null;
        this.tempComment= "";
        // console.log(this.commentEditIndex, "cancel Edit")
    }


    updateEditComment(index, comId) {

        let postEditComm = BlankVars.postEditComm;

        let data = {
            comm_id: comId,
            comment: this.tempComment,
        }

        this._POST_api_Service.POST_HRC_data(postEditComm, data).subscribe(res => {
            if(res.status=='OK'){
                this.firstCommArr[index].comment= this.tempComment;
                this.cancelEditComment();
                this.notifier.notify('success', 'Successfully Update ');
            }
            else {
                      this.notifier.notify('error', 'Error -Unsuccessful!');
                  }
        })

    }

     //To delete first layer comment
     delFirstLayer(){
        // console.log(id, "deleteFirstLayer");
        let post: any = {};
        post = {
            comm_id: this.commentId
        }

        let delFirstLayer = BlankVars.deleteFlayer;
        this._POST_api_Service.POST_HRC_data(delFirstLayer, post).subscribe(data => {
            delFirstLayer = data;
            // console.log(delFirstLayer, "delFirstLayer");
            if (data.status=='OK') {
                // this.firstCommArr[index].deletecomment = 0;
                this.getCommentsData();

                this.notifier.notify('success', 'Successfully Delete');
                // console.log(this.firstCommArr[index], "comment Arr delete", index)
                // console.log(this.firstCommArr)
            }
            else {
                      this.notifier.notify('error', 'Error -delete comment!');
            }
            this.loading = false; 
            },
            error => {
                // console.log('[ERROR + User Not Found: ' + error);
           }) 
         }



    validatePaydays(item) {
        let payDate = item.Salary_Date.split(" ");
        let monthIndex = this.monthStringFull.indexOf(payDate[1]);

        if (parseInt(payDate[2]) > this.year) {
            return true;
        }
        else if ((monthIndex >= this.month) && parseInt(payDate[2]) >= this.year) {
            return true;
        }
        else {
            return false;
        }
    }

    //To add comment at announcement
    addComment(id){
        // console.log(id,"Comment success");
        let cmt= this.commentForm.get("userComment").value;
        // console.log(cmt,"iniComment")
        // console.log(this.announcementComment)
        let post = {
            id: id,
            comment: this.announcementComment.toString()
        }
          let postAddComment= BlankVars.postComment
          this._POST_api_Service.POST_HRC_data(BlankVars.postComment, post).subscribe(data => {
            // console.log(data)
        
            this.announcementComment = ""
        
            this.getCommentsData()
        })
    }

    //To reply first layer comment
    replyFlayer(index, comId, id){
        this.cancelEditComment();
        // console.log(comId, "comId");
        // console.log(id, "newsId");
        // let post = {
        //     comm_id: comId,
        //     comment: this.secLayComm,
        //     news_id: id 
        // }
        this.secLayComm="";
        this.replyCommentIndex= index;
        this.isReplying=true;
    }

    cancelReply(){
        this.replyCommentIndex= null;
        this.isReplying=false;
        this.secLayComm = "";
        // console.log(this.isReplying, "cancel Reply")
    }

    // insertSecondLayerComment(){
    //     this.userComments.second_layer.forEach(element => {
    //       for(let i=0; i<this.userComments.first_layer.length; i++){
    //         if (element.id_first_layer==this.userComments.first_layer[i].id){
    //           if ('second_layer' in this.userComments.first_layer[i]){
    //             this.userComments.first_layer[i].second_layer.push(element)
    //             break
    //           }
    //           else{
    //             this.userComments.first_layer[i].second_layer=[element]
    //             break
    //           }
    //         }
    //       }
    //     });
    //   }

    // assignSLayer(){

    // }


    //To add second layer comment
    addSLayerComm(comId, cmt, id){
        // console.log(comId, "Second layer comment");
        // console.log(id, "newsId");
        // let slf= this.secLayerForm.get("replyComment").value;
        // console.log(slf, "ini Second layer comment")
        let post = {
            comm_id: comId,
            // comment: this.secLayComm.toString(),
            comment: cmt,
            news_id: id
        }
            let postCommentLayer = BlankVars.commentLayer;
            this._POST_api_Service.POST_HRC_data(postCommentLayer, post).subscribe(data => {
                // console.log(data);
                if(data.status=='OK'){
                    this.cancelReply();
                    this.getCommentsData();
                }
            })
    }

    //To like second layer comment
    likeSecLayer(index, id){
        // console.log("likeSecondLayer with id", id)
        let post: any = {};
        post = {
            comm_id: id
        }
        let likedSecLayer: any = {};

        let likeSLayer = BlankVars.likeSLayer;
        this._POST_api_Service.POST_HRC_data(likeSLayer, post).subscribe(data => {
            likedSecLayer = data;
            // console.log('likedSecLayer', likedSecLayer)
            this.getCommentsData();
        }, err=> {
            this.notifyMsg = "Failed to get data";    
        })
    }

    //To unlike second layer comment
    unlikeSecLayer( index, id){
        // console.log("unlikeSecondLayer with id", id)
        let post: any = {};
        post = {
            comm_id: id
        }
        let unlikedSecLayer: any = {};

        let unlikeSLayer = BlankVars.unlikeSLayer;
        this._POST_api_Service.POST_HRC_data(unlikeSLayer, post).subscribe(data => {
            unlikedSecLayer = data;
            // console.log('unlikedSecLayer', unlikedSecLayer)
            this.getCommentsData();
        }, err=> {
            this.notifyMsg = "Failed to get data";    
        })
    }
    
       //To delete second layer comment
       delSecondLayer(){
        // console.log(id, "deleteSecondLayer");
        let post: any = {};
        post = {
            comm_id: this.commentId
        }

        let delSecondLayer = BlankVars.deleteSLayer;
        this._POST_api_Service.POST_HRC_data(delSecondLayer, post).subscribe(data => {
            delSecondLayer = data;
            // console.log(delSecondLayer, "delSecondLayer");
            if (data.status=='OK') {
                // this.firstCommArr[index].deletecomment = 0;
                this.getCommentsData();

                this.notifier.notify('success', 'Successfully Delete');
                // console.log(this.secondCommArr[index], "comment Arr delete", index)
                // console.log(this.secondCommArr)
            }
            else {
                      this.notifier.notify('error', 'Error -delete comment!');
            }
            this.loading = false; 
            },
            error => {
                // console.log('[ERROR + User Not Found: ' + error);
           }) 
         }

         //To edit comment at first layer
    // editSecComm(index, comId){
    //     this.commentEditSecIndex= index;
    //     console.log(comId, "comId");
    //     console.log(this.secondCommArr[index].id, "second commArrId");
    //     this.tempComment= this.secondCommArr[index].comment;
    // }

    updateEditSecComment(index, comId) {

        let postEditSLayer = BlankVars.postEditSLayer;

        let data = {
            comm_id: comId,
            comment: this.tempComment,
        }

        this._POST_api_Service.POST_HRC_data(postEditSLayer, data).subscribe(res => {
            if(res.status=='OK'){
                this.secondCommArr[index].comment= this.tempComment;
                this.cancelEditComment();
                this.notifier.notify('success', 'Successfully Update ');
            }
            else {
                      this.notifier.notify('error', 'Error -Unsuccessful!');
                  }
        })

    }

    identifyReply(): Promise<any>{
        return new Promise((resolve,reject)=>{
            let j = 0;
            if (this.sLayer.length>0){
                this.sLayer.forEach(element => { //goes through slayer
                    for(let i=0; i<this.fLayer.length; i++){ //goes through flayer  , i keeps track of index at flayer
                      if (element.id_first_layer==this.fLayer[i].id){ // check id slayer punya flayer id sama dgn current flayer id
                        this.fLayer[i].hasReply=true;
                        if (j == this.sLayer.length-1) {
                            resolve(true)
                        }
                        break;
                      }
                    }
                    j++;
                  });
            }
            else {
                resolve(true)
            }
           
        })
    }

    firstCommArr = [];
    secondCommArr = [];
      fLayer;
      sLayer;
      getCommentsData(){
   
      let dataPost: any = {};
      dataPost = {
        id: this.view_newsId
      }
     
      let dataComment: any = {};
       this._POST_api_Service.POST_HRC_data('/hrc/user/comm/getcomment', dataPost).subscribe(data => {
        dataComment = data;
        this.fLayer = data.first_layer;
        this.sLayer = data.second_layer;
        this.view_commentNewsCount = this.fLayer.length;
        // console.log(this.fLayer, "First layer comm ArrData")
        this.totalCommArrLength=0;
        // console.log('dataComment',dataComment)
         this.firstCommArr= [];
        this.identifyReply().then(()=> {
            // console.log("Running after identify reply")
            // console.log("Executing finding image fLayer", this.fLayer, " and Second layer ", this.sLayer)
            for (let i= 0; i < this.fLayer.length; i++) {
                   
                let ImgfisrtLyr = GlobalVariable.BASE_API_URL + ComVars.getImgAPI + "/" + this.fLayer[i].image_url + "?api_key=" + GlobalVariable.API_KEY;
                  this._GET_api_Service.GET_PictureByUrl(ImgfisrtLyr).subscribe(data => {   
                let tempData;
                    if (data) {
                        tempData= this.fLayer[i];
                        tempData.image_url= ImgfisrtLyr;
                        this.firstCommArr.push(tempData);
                        // console.log("First Comm Arr", this.firstCommArr)
                    //     this.firstCommArr.push({
                    //       image_url:ImgfisrtLyr,
                    //       Name: this.fLayer[i].Name, 
                    //       comment: this.fLayer[i].comment,
                    //       update_on: this.fLayer[i].update_on,
                    //       isLiked: this.fLayer[i].isLiked,
                    //       likeCount: this.fLayer[i].likeCount,
                    //     //   likeCountAnnoucement: this.fLayer[i].likeCountAnnoucement,
                    //       id: this.fLayer[i].id,
                    //       Staff_No: this.fLayer[i].Staff_No,
                    //       deletecomment: this.fLayer[i].deletecomment,
                    //     //   secLayerComm: []
    
                    // });
                    if (this.fLayer[i].deletecomment==null && this.fLayer[i].deletecomment!=0) {
                        this.totalCommArrLength++;
                        // console.log("fLayer at index", i, this.totalCommArrLength)
                    }
    
                    } else {
                        tempData= this.fLayer[i];
                        tempData.image_url= '../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
                        this.firstCommArr.push(tempData);
                        // console.log("First Comm Arr", this.firstCommArr)
                    //   this.firstCommArr.push({
                    //       image_url: '../../../../../assets/app/media/img/users/ghcm-user-default.jpg',
                    //       Name: this.fLayer[i].Name, 
                    //       comment: this.fLayer[i].comment,
                    //       update_on: this.fLayer[i].update_on,
                    //       isLiked: this.fLayer[i].isLiked,
                    //       likeCount: this.fLayer[i].likeCount,
                    //     //   likeCountAnnoucement: this.fLayer[i].likeCountAnnoucement,
                    //       id: this.fLayer[i].id,
                    //       Staff_No: this.fLayer[i].Staff_No,
                    //       deletecomment: this.fLayer[i].deletecomment,
                    //     //   secLayerComm: []
                    // });
                    if (this.fLayer[i].deletecomment==null && this.fLayer[i].deletecomment!=0) {
                        this.totalCommArrLength++;
                        // console.log("fLayer at index", i, this.totalCommArrLength)
                    }
                   }
            
                  },err => {
                    let tempData;
                    tempData= this.fLayer[i];
                    tempData.image_url= '../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
                    this.firstCommArr.push(tempData);
                    // console.log("First Comm Arr", this.firstCommArr)
                    //   this.firstCommArr.push({
                    //     image_url: '../../../../../assets/app/media/img/users/ghcm-user-default.jpg',
                    //     Name: this.fLayer[i].Name, 
                    //     comment: this.fLayer[i].comment,
                    //     update_on: this.fLayer[i].update_on,
                    //     isLiked: this.fLayer[i].isLiked,
                    //     likeCount: this.fLayer[i].likeCount,
                    //     // likeCountAnnoucement: this.fLayer[i].likeCountAnnoucement,
                    //     id: this.fLayer[i].id,
                    //     Staff_No: this.fLayer[i].Staff_No,
                    //     deletecomment: this.fLayer[i].deletecomment,
                    //     // secLayerComm: []
                      
                    //   });
                      if (this.fLayer[i].deletecomment==null && this.fLayer[i].deletecomment!=0) {
                        this.totalCommArrLength++;
                        // console.log("fLayer at index", i, this.totalCommArrLength)
                    }
                    });
    
                  } 
                //   console.log(this.commArr, "comment arr in for loop")
                //   this.calcDispComment();
                },
                error => {
                    // console.log('[ERROR + User Not Found: ' + error);
              }) 
              
    
              
              this._POST_api_Service.POST_HRC_data('/hrc/user/comm/getcomment', dataPost).subscribe(data => {
               dataComment = data;
            
               this.view_commentNewsCount = this.sLayer.length;
            //    console.log(this.sLayer, " Second layer comm ArrData")
            //    console.log('dataComment',dataComment)
                this.secondCommArr= [];
           
                for (let i= 0; i < this.sLayer.length; i++) {
                          
                   let ImgsecondLyr = GlobalVariable.BASE_API_URL + ComVars.getImgAPI + "/" + this.sLayer[i].image_url_secondlayer + "?api_key=" + GlobalVariable.API_KEY;
                     this._GET_api_Service.GET_PictureByUrl(ImgsecondLyr).subscribe(data => {   
                                       
                       if (data) {
                           this.secondCommArr.push({
                            image_url_secondlayer:ImgsecondLyr,
                             Name: this.sLayer[i].Name, 
                             comment: this.sLayer[i].comment,
                             update_on: this.sLayer[i].update_on,
                             isLiked: this.sLayer[i].isLiked,
                             likeCount: this.sLayer[i].likeCount,
                           //   likeCountAnnoucement: this.fLayer[i].likeCountAnnoucement,
                             id: this.sLayer[i].id,
                             Staff_No: this.sLayer[i].Staff_No,
                             deletecomment: this.sLayer[i].deletecomment,
                             id_first_layer: this.sLayer[i].id_first_layer
       
                       });
                    //    console.log(this.secondCommArr, "Second layer comment")
                       if (this.sLayer[i].deletecomment==null || this.sLayer[i].deletecomment==0) {
                        this.totalCommArrLength++;
                        // console.log("sLayer at index", i, this.totalCommArrLength)
                    }
       
                       } else {
                         this.secondCommArr.push({
                            image_url_secondlayer: '../../../../../assets/app/media/img/users/ghcm-user-default.jpg',
                             Name: this.sLayer[i].Name, 
                             comment: this.sLayer[i].comment,
                             update_on: this.sLayer[i].update_on,
                             isLiked: this.sLayer[i].isLiked,
                             likeCount: this.sLayer[i].likeCount,
                           //   likeCountAnnoucement: this.sLayer[i].likeCountAnnoucement,
                             id: this.sLayer[i].id,
                             Staff_No: this.sLayer[i].Staff_No,
                             deletecomment: this.sLayer[i].deletecomment,
                             id_first_layer: this.sLayer[i].id_first_layer
                       });
                    //    console.log(this.secondCommArr, "Second layer comment")
                       if (this.sLayer[i].deletecomment==null || this.sLayer[i].deletecomment==0) {
                        this.totalCommArrLength++;
                        // console.log("sLayer at index", i, this.totalCommArrLength)
                    }
       
                      }
               
                     },err => {
                         this.secondCommArr.push({
                           image_url_secondlayer: '../../../../../assets/app/media/img/users/ghcm-user-default.jpg',
                           Name: this.sLayer[i].Name, 
                           comment: this.sLayer[i].comment,
                           update_on: this.sLayer[i].update_on,
                           isLiked: this.sLayer[i].isLiked,
                           likeCount: this.sLayer[i].likeCount,
                           // likeCountAnnoucement: this.sLayer[i].likeCountAnnoucement,
                           id: this.sLayer[i].id,
                           Staff_No: this.sLayer[i].Staff_No,
                           deletecomment: this.sLayer[i].deletecomment,
                           id_first_layer: this.sLayer[i].id_first_layer
                         
                         });
                        //  console.log(this.secondCommArr, "Second layer comment")
                         if (this.sLayer[i].deletecomment==null || this.sLayer[i].deletecomment==0) {
                            this.totalCommArrLength++;
                            // console.log("sLayer at index", i, this.totalCommArrLength)
                        }
           
                       });
       
                     } 
                   //   console.log(this.commArr, "comment arr in for loop")
                   //   this.calcDispComment();
                   },
                   error => {
                    //    console.log('[ERROR + User Not Found: ' + error);
                 }) 
        })

      }

          //To like comment
        //   addLikeComment(index, id) {
        //     console.log(id, "likeComment");
        //     let liked = this.commentsData[index].isLiked;
        //     let post = {
        //         id: id
        //     }

        //     if (liked) {
        //         let unlikeComm = BlankVars.unlikeComm;
        //         this._POST_api_Service.POST_HRC_data(unlikeComm, post).subscribe(data => {
        //             this.commentsData[index].isLiked = data[0].isLiked;
        //             this.commentsData[index].likeCount = data[0].likeCount;
        //         });

        //     }
        //     else {
        //         let likeComm = BlankVars.likeComm;
        //         this._POST_api_Service.POST_HRC_data(likeComm, post).subscribe(data => {
        //             this.commentsData[index].isLiked = data[0].isLiked;
        //             this.commentsData[index].likeCount = data[0].likeCount;
        //         });
        //     }
        //  }

        //To like comment
        addLikeComm(id, index?) {
            // console.log("Running addLikeComm with id", id)
            let post: any = {};
            post = {
                id: id
            }
            let liked: any = {};

            let likeComm = BlankVars.likeComm;
            this._POST_api_Service.POST_HRC_data(likeComm, post).subscribe(data => {
                liked = data;
                // console.log('liked', liked)
                this.getCommentsData();
            }, err=> {
                this.notifyMsg = "Failed to get data";
            })
        }

        //To unlike comment 
        unlikeComm(id, index?) {
            // console.log("Running unlikeComm with id", id)
            let post: any = {};
            post = {
                comm_id: id
            }
            let unlike: any = {};

            let unlikeComm = BlankVars.unlikeComm;
            this._POST_api_Service.POST_HRC_data(unlikeComm, post).subscribe(data => {
                unlike = data;
                // console.log('unlike', post)
                this.getCommentsData();
            }, err=> {
                this.notifyMsg = "Failed to get data";
            })   
        }

         //To like news announcement
         addLikeNews(id) {
            //  console.log("Running addLikeNews")
             let post: any = {};
             post = {
                 id: id
             }
             let liked: any = {};

             let likeNews = BlankVars.likeNews;
             this._POST_api_Service.POST_HRC_data(likeNews, post).subscribe(data => {
                 liked = data;
                //  console.log('liked',liked)
                 this.view_likeNewsCount++;
                 this.view_isLiked = 1
             }, err=> {
                 this.notifyMsg = "Failed to get data";
             })
         }

         //To unlike news announcement
         unlikeNews(id) {
             let post: any = {};
             post = {
                 news_id: id
             }
             let unlike: any = {};

             let unlikeNews = BlankVars.unlikeNews;
             this._POST_api_Service.POST_HRC_data(unlikeNews, post).subscribe(data => {
                 unlike = data;
                //  console.log('unlike', post)
                 if (this.view_likeNewsCount>0) this.view_likeNewsCount--;
                 else this.view_likeNewsCount=0
                 this.view_isLiked = 0
             }, err=> {
                 this.notifyMsg = "Failed to get data";
             })
         }


    // To checking time for changing the background
    timeZone;
    imgTimeZone;
    viewDateToday;
    wishingTime;
    dayString = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    monthString = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    monthStringFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    month;
    year;
    nickName;
    bgClass;
    bgChange;
    specialEffects;
    getTime() {

        var day = new Date().getDay();
        var date = new Date().getDate();
        this.month = new Date().getMonth();
        this.year = new Date().getFullYear();

        this.viewDateToday = this.dayString[day] + " " + date + " " + this.monthString[this.month] + " " + this.year;

        let userName = JSON.parse(localStorage.getItem('currentUser')).body.name;
        let nick_Name = JSON.parse(localStorage.getItem('currentUser')).body.nick_name;
        this.nickName = (nick_Name === null || nick_Name == "") ? userName : nick_Name;

        this._GET_api_Service.GET_SEA_data(BlankVars.backgroundImg).subscribe(res => {

            let special = res.findIndex(item => item.type === "special");
            if (special >= 0) {
                this.wishingTime = res[special].msg
                if (res[special].effect) this.specialEffects = res[special].effect;
                let img = GlobalVariable.BASE_API_URL + '/get/image/' + res[special].img_web + "?api_key=" + GlobalVariable.API_KEY;

                this._GET_api_Service.GET_PictureByUrl(img).subscribe(data => {
                    if (data) this.bgChange = `url(${img})`;
                    else this.bgClass = 'mor-bg';
                }, error => {
                    this.bgClass = 'mor-bg';
                });

            } else {

                this.timeZone = new Date().getHours();
                if (this.timeZone < 12) {
                    this.wishingTime = "Good Morning,"
                    this.bgClass = 'mor-bg';
                } else if (this.timeZone >= 17) {
                    this.wishingTime = "Good Evening,"
                    this.bgClass = 'eve-bg';
                } else {
                    this.wishingTime = "Good Afternoon,"
                    this.bgClass = 'noon-bg';
                }

            }

        }, error => {
            this.bgClass = 'mor-bg';
        })
    }

    public resetfeedbackForm() {
        this.feedbackForm = null;
        this.feedbackForm = new FormGroup({
            fbCat: new FormControl(['Technical'], Validators.required),
            fbTitle: new FormControl(null, Validators.required),
            fbMsg: new FormControl(null, Validators.required),
        });
    }

    showExtra;
    displayName;
    checkProject() {
        this._GET_api_Service.GET_data(BlankVars.checkProjectAPI).subscribe(res => {
            if (res[0].allow === 1) {
                this.showExtra = true;
                this.displayName = res[0].display_name;
            }
            else
                this.showExtra = false;
        })
    }

    // token for MAPS
    syncTokenMaps() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        let req = {
            staff_id: currentUser.userid,
            u_token: currentUser.token
        }

        this._POST_api_Service.POST_MAPS_data(BlankVars.GETSyncToken, req).subscribe(res => {
            if (res.status === 'OK') this.checkingMapsRole(); // to check weather MAPS tab will only show on dashboard for NE/Exec or supervisor
        }, error => {
            // console.log('[ERROR] cannot get token ' + error);
        })
    }

    // to check weather MAPS tab will only show on dashboard for NE/Exec or supervisor
    showMaps: boolean = false;

    checkingMapsRole() {

        let userData = JSON.parse(localStorage.getItem('currentUser')).body;

        let data = userData.gemsId
        
        this._GET_api_Service.GET_MAPS_data_loginRole(BlankVars.GETCheckRole + data).subscribe(res => {

            if ((res.role_lvl > 0) && (res.role_lvl < 5)) this.showMaps = true;
            else this.showMaps = false

            localStorage.setItem('roleMaps', JSON.stringify(res));

        }, error => {
            // console.log('[ERROR] cannot check role ' + error);
            this.showMaps = false;
        })
    }

    imgAPIUrl = GlobalVariable.BASE_API_URL + ComVars.getImgAPI;
    getPopupData = BlankVars.getPopup;
    annc_data: any = [];
    renderAnnc() {
        type imgSrc = {
            id: number, action: string,
            imageHash: string,
            imgHeight: string, type: string,
        };
        let myannc: imgSrc[] = [];
        this._GET_api_Service.GET_data(this.getPopupData).subscribe(data => {
            for (let i = 0; i < data.length; i++) {
                let imgURL;
                imgURL = data[i].imageHash;
                if (imgURL) {
                    myannc.push({
                        id: i, action: data[i].action,
                        imageHash: this.imgAPIUrl + '/' + imgURL + '?api_key=' + GlobalVariable.API_KEY,
                        imgHeight: data[i].imgHeight, type: data[i].type
                    });
                }
            }
            this.annc_data = myannc;
            if (myannc.length > 0) {
                // setTimeout(() => {
                // this.divClick.nativeElement.click(); // this is for modal popout announcement
                // }, 200);
            }
        },
            error => {
                // console.log('[ERROR Get Profile] ' + error);
            });
    }

    getSummaryNum(index) {
        let num = (this.actionSum[index].badge != 0) ? this.actionSum[index].badge : this.actionSum[index].total;
        return (num == null) ? 0 : num;
    }

    getTrackingNum() {
        if (this.actionSum[1].badge > 0) {
            let num = this.actionSum[1].badge;
            return num;

        } else {
            let num = this.actionSum[3].badge;
            return num;
        }
    }

    getTalentSummary(index) {
        let num = (this.actionSum[index].badge != 0) ? this.actionSum[index].badge : this.actionSum[index].total;
        let total = (num == null) ? 0 : num;

        return total;
    }

    getApprModalSum(index) {
        let num = this.actionSum[index].badge;
        return (num == null) ? 0 : num;
    }

    // getApprovalSum(index0, index1) {
    //     let num = this.actionSum[index0].badge + this.actionSum[index1].badge;
    //     return (num == null) ? 0 : num;
    // }

    //  getIDPSum(index0, index1) {
    //      let num = this.actionSum[index0].total + this.actionSum[index1].total;
    //      return (num == null) ? 0 : num;
    //  } centerion code scanning

     checkApprovalSum(index) {
         return (this.actionSum[index].total > 0) ? true : false;
     }

    fbPosMsg: string;
    fbPosStyle: string; fbPosIcon: string;
    notifyMsg: string;



    feedbackFormSubmit() {

        let postApiCat = this.feedbackForm.get('fbCat').value

        let postApi = '';

        if (postApiCat == 'TM Mobility Center') {
            postApi = this.feedbackTmMoveAPI;
        }
        else {
            postApi = this.feedbackAPI;
        }

        let dataPost: any = {
            newFeedbackTitle: this.feedbackForm.get('fbTitle').value,
            newFeedbackDescription: this.feedbackForm.get('fbMsg').value,
        };

        let feedbackSend = this._POST_api_Service.POST_data(postApi, dataPost);

        let datafbPos: any = {};
        let askUsID;

        let res = feedbackSend.subscribe(datafbRes => {
            const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
            askUsID = datafbRes.feedbackID;
            let api = BlankVars.scShotAPI;
            let emailAPI = BlankVars.emailAPI;
            datafbPos = datafbRes;
            if (datafbPos.results) {
                if (this.imgFiles && this.imgFiles.length !== 0) {
                    let length = (this.imgFiles.length < 3) ? this.imgFiles.length : 3;
                    for (let i = 0; i < length; i++) {
                        // console.log(this.imgFiles[i]);
                        this.postScreenShots(askUsID, i, api);
                    }
                }

                // this.fbPosMsg = BlankVars.fdbckSuccess
                // this.fbPosStyle = ' alert-success '; this.fbPosIcon = ' flaticon-paper-plane ';
                // this.fbShowMsg = true;
                setTimeout(function () {
                    this.fbShowMsg = false;
                }.bind(this), 4000); //wait 4 Seconds and hide

                wait(4 * 1000).then(() => this.postInsEmailAskUs(askUsID, emailAPI));


                this.notifyMsg = BlankVars.fdbckSuccess;
                this.notifier.notify('success', this.notifyMsg);
            }
            else {
                this.notifyMsg = BlankVars.fbbckFail;
                this.notifier.notify('error', this.notifyMsg);
                // this.fbPosMsg = BlankVars.fbbckFail;
                // this.fbPosStyle = ' alert-danger  '; this.fbPosIcon = ' flaticon-circle ';
                // this.fbShowMsg = true;
            }
            this.resetfeedbackForm();
        })
    }

    addImageTrigger() {
        $('#ssImg').trigger('click');
    }

    scShots = '';
    imgFiles;
    fbImages;
    // imageFileNames = [];

    fileChange(event) {

        let fileList: FileList = event.target.files;
        // console.log(fileList.length)
        var length = (fileList.length < 3) ? fileList.length : 3;

        var imgList = [];
        for (let i = 0; i < length; i++) {
            imgList[i] = fileList[i];
        }

        this.imgFiles = imgList;

        // this.postScreenShots(115)

    }

    postScreenShots(askUsID, ssIndex, api) {

        // console.log(this.imgFiles[ssIndex].name)

        let form_Data = new FormData();
        form_Data.append('askusImg', this.imgFiles[ssIndex], this.imgFiles[ssIndex].name.toLowerCase());
        form_Data.append('feedbackID', askUsID);

        this._POST_api_Service.POST_ScreenShot(api, form_Data).subscribe(res => {
            // console.log("res", res);

            this.scShots = '';
            this.imgFiles = [];

            //this.notifyMsg = "Screenshots Uploaded Successfully";
            //this.notifier.notify('success', this.notifyMsg);

        }, err => {
            this.scShots = '';
            this.imgFiles = [];
            this.notifyMsg = "Failed to Upload the Screenshots";
            this.notifier.notify('error', this.notifyMsg);
        })



    }

    postInsEmailAskUs(askUsID, api) {

        // console.log(this.imgFiles[ssIndex].name)

        let dataInsEmail: any = {
            id: askUsID
        };

        this._POST_api_Service.POST_data(api, dataInsEmail).subscribe(res => {

            //this.notifyMsg = "Screenshots Uploaded Successfully";
            //this.notifier.notify('success', this.notifyMsg);

        }, err => {

            this.notifyMsg = "Failed to Insert email";
            this.notifier.notify('error', this.notifyMsg);
        })

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

    DashboardData() {
        let excludeArr = ["approvalHcbd", "approvalHcbo", "approvalEvaluate", "approvalInterview", "approvalRevert"];
        this._GET_api_Service.GET_data(this.dashboardAPI).subscribe(data => {
            if (data.length == 1) {
                this.data = data[0];
            }
            for (var key in this.data) {
                let currKey = key;
                if (!excludeArr.some((e => e === currKey))) {
                    this.myKey.push(currKey);
                    this.myVal.push(this.data[key]);
                } else {
                    switch (currKey.toLocaleUpperCase()) {
                        case 'APPROVALEVALUATE': this.byRoleKey.push(this.waitingEvaluate); this.byRoleUrl.push(BlankVars.rEvaluate); this.byRoleVal.push(this.data[key]); break;
                        case 'APPROVALINTERVIEW': this.byRoleKey.push(this.waitingInterview); this.byRoleUrl.push(BlankVars.rInterview); this.byRoleVal.push(this.data[key]); break;
                        case 'APPROVALREVERT': this.byRoleKey.push(this.approvalRevert); this.byRoleUrl.push(BlankVars.rRevert); this.byRoleVal.push(this.data[key]); break;
                        case 'APPROVALHCBD': this.byRoleKey.push(this.approvalHcbd); this.byRoleUrl.push(BlankVars.rPendAppr); this.byRoleVal.push(this.data[key]); break;
                        // UAT2: REMOVED - PENDING APPROVAL BY HCBO - case 'APPROVALHCBO': this.byRoleKey.push(this.approvalHcbo); this.byRoleUrl.push('job/pending-approval'); break;
                    }
                }
            }
        },
            // error => console.log('[ERROR - DashboardData] ' + error),
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
                // console.log('[ERROR - NewsFeedData] ' + error);
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
                this.redirect('/coming-soon'); // this.redirect('/user/coming-soon');
            } else {
                this.usrLoginLvl = currentUser.userlevel;
                let uR = this.usrRole.toLocaleUpperCase();
                if ((!/HCBD/i.test(this.usrRole)) && (!/hcbo/i.test(this.usrRole))) {
                    // console.log("Normal 2");
                    // this.redirect('/user/coming-soon');
                    this.redirect('/coming-soon');
                } else {
                    this.isAdmin = true;
                    let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token }); // 20180725
                    if (uR == 'ADMINHCBO') {
                        this.showAction = false;
                    }
                }
            }
        }
    }

    // scrollToElement($element): void {
    //     let element = document.getElementById($element);
    //     element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    // }

    scrollToElement(): void {
        let element = document.getElementById('targetpage');
         element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
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

    // @HostListener('window:scroll', ['$event'])
    // checkScroll() {
    //     const componentPosition = this.el.nativeElement.offsetTop
    //     const scrollPosition = window.pageYOffset

    //     if (scrollPosition >= componentPosition) {
    //         this.scrollback = false
    //     } 
    //     else {
    //         this.scrollback = true;
    //     }
    //     this.scrollToElementAnimate();

    // }

    redirect(myUrl) {
        this.routers.navigate([myUrl]);
    }

    viewPages(num) {
        let url;
        switch (num) {
            case 1: this.routers.navigate(['/user-job']);
                break;
            case 2: this.routers.navigate(['/extraordinaire']);
                break;
            case 3: this.routers.navigate(['/circle']);
                break;
            case 4:
                if (this.actionSum[0].badge > 0 && this.actionSum[1].badge > 0) {
                    document.getElementById('appr-btn').click();
                }
                else if (this.actionSum[0].badge > 0) {
                    this.routers.navigate(['/extraordinaire']);
                }
                else if (this.actionSum[1].badge > 0) {
                    this.routers.navigate(['/user-job/tracking/1']);
                }
                break;
            case 5: this.routers.navigate(['/user-job/tracking']);
                break;
            case 6: this.routers.navigate(['/notifications']);
                break;
            case 7:
                document.getElementById('cancel_btn').click();
                this.routers.navigate(['/extraordinaire']);
                break;
            case 8:
                document.getElementById('cancel_btn').click();
                this.routers.navigate(['/user-job/tracking/1']);
                break;
            // case 9 : this.routers.navigate(['/profile']);
            // break;
            case 9: this.routers.navigate(['/talent']);
                break;
        }

    }

    happyClick = false;
    happyLevel;
    happyMeterClicked() {
        // this.happyLevel = 0;
        // this.happyClick = true;
        // console.log(this.happyClick)

        this.routers.navigate(['/happy-meter']);
    }

    /*
    feelClicked(happylvl){
        this.happyClick = false;
        this.happyLevel = happylvl;
    }    
    backClicked(){
        if(this.happyLevel < 9){
            this.happyLevel = 0;
            this.happyClick = true;    
        }
        else if(this.happyLevel == 52){
            this.happyLevel = 50;
        }
    }
    continueClicked(){
        if(this.happyLevel == 5){
            this.feelClicked(50);
        }
        else if(this.happyLevel == 1){
            this.feelClicked(10);
        }
    }
    imdoneClicked(){
        if(this.happyLevel == 50){
            this.feelClicked(51);
        }
        else if(this.happyLevel == 10){
            this.feelClicked(11);
        }
    }
    addNoteClicked(){
        if(this.happyLevel == 50){
            this.feelClicked(52);
        }
        else if(this.happyLevel == 10){
            this.feelClicked(12);
        }
    }
    addNoteDoneClicked(){
        if(this.happyLevel == 52){
            this.feelClicked(51);
        }
        else if(this.happyLevel == 12){
            this.feelClicked(11);
        }
    }
    okClicked(){
        this.happyLevel = 0;
        this.happyClick = true;
    }
    */

    //Draggable
    holdTime: number = 0;
    timeoutHandler;
    onStart(event) {
        if (window.innerWidth <= 800)
            $('.control-scroll').css("position", "fixed");

        this.timeoutHandler = setInterval(() => {
            this.holdTime += 1;
        }, 100);
    }

    onStop(event) {
        if (this.timeoutHandler) {
            clearInterval(this.timeoutHandler);
            if (this.holdTime < 2)
                this.happyMeterClicked();

            this.holdTime = 0;
            this.timeoutHandler = null;
            $('.control-scroll').css("position", "static");
        }
    }
    //End Draggable

    //BadgeIcon Trigger Navigation
    menuClicked(path) {
        // if(path === '/idp') {
        //     this.document.location.href = '/idp';
        // }
        // else
        this.routers.navigate([path]);
    }
    //End BadgeIcon Trigger Navigation

    //Click Annc
    goToLink(url: string) {
        if (url)
            window.open(url, "_blank");
    }
    //End Click Annc

    menuOpen(type) {
        switch (type) {
            case 'otcs':
                window.open('https://ot.tm.com.my/login');
                break;
            case 'tml':
                window.open('https://learn.tm.com.my/login/index.php');
                break;
            case 'la':
                window.open('https://gems.tm.com.my/irj/portal');
                break;
            case 'g':
                window.open('https://grow.tm.com.my/');
                break;
            case 'covid':
                window.open('https://www.sub.tm.com.my/sub/covid/index.cfm?path=pwa');
                break;
        }
    }

    // check eligible VRP user condition
    showVrp: boolean = false;
    checkEligibleVrpUsr() {
        //API check user role.  
        //console.log('Check User role..');      
        this._GET_api_Service.GET_VRP_data(BlankVars.getRoleVrp).subscribe(data => {
            if ((data.role_lvl > 0) && (data.role_lvl < 5)) {
                //console.log('getRoleVrp: ' + data.role_lvl);
                this._GET_api_Service.GET_VRP_data(BlankVars.getVrpSession).subscribe(data => {
                    // console.log('getVrpSession: ' + data.length);
                    if (data.length > 0) {
                        this.showVrp = true;
                    }
                }, error => {
                    // console.log('[ERROR] cannot check role ' + error);
                });
            } else {
                this.showVrp = false;
            }
        }, error => {
            // console.log('[ERROR] cannot check role ' + error);
        })


        //console.log('Show VRP Icon: '+this.showVrp);  
    }

    // check eligible PPS user condition
    showVsp: boolean = false;
    checkEligibleVspUsr() {
        //API check user role.  
        //console.log('Check User role..');      
        this._GET_api_Service.GET_PPS_data(BlankVars.getRolePps).subscribe(data => {
            //console.log('getRoleVsp: ',data.role_lvl);
            if ((data.role_lvl > 0) && (data.role_lvl < 5)) {
                this._GET_api_Service.GET_PPS_data(BlankVars.getPpsSession).subscribe(data => {
                    //console.log('getPpsSession: ',data);
                    if (data.length > 0) {
                        this.showVsp = true;
                    } 
                }, error => {
                    // console.log('[ERROR] fetch session : ' + error);
                });
            } else {
                this.showVsp = false;
            }
        }, error => {
            // console.log('[ERROR] fetch check role : ' + error);
        })
        //console.log('Show VSP Icon: '+this.showVsp);  
    }

    // latest annoucement
   hasAnnoucement = false;
   ann_count; //data count
   ann_list = []; //default display all data filtered
   ann_default_imgUrl = 'https://via.placeholder.com/600x400?text=ERA';
   ann_count_to_display = 5;
   getAnnList() {    
       let curr_date = this.datePipe.transform(new Date(),"yyyy-MM-dd");
       
        this._GET_api_Service.GET_HRC_data(BlankVars.getAnnList).subscribe(data => {            
            //this.ann_count = data.length;  
            if (data.length > 0) 
            {   
                this.ann_count = data.length;
                if(data.length > this.ann_count_to_display) {
                    data = data.slice(0, 5)
                    this.ann_count = this.ann_count_to_display;
                }
                this.ann_list = data;
                //add new object url_thumb & url_bodyimg
                for (var i = 0; i < this.ann_list.length; i++) {
                //add url img to array
                this.ann_list[i].url_thumb = this.getUrlImage(this.ann_list[i].thumb); 
                this.ann_list[i].url_bodyImg = this.getUrlImage(this.ann_list[i].bodyImage); 
                this.ann_list[i].url_bodyImgEng = this.getUrlImage(this.ann_list[i].bodyImage_eng);     
                    
                //get count publish_date today as new only
                // console.log('curr_date',curr_date);
                // console.log('ann_list['+i+']',this.datePipe.transform(this.ann_list[i].publish_date,"yyyy-MM-dd"));
                //     if (this.datePipe.transform(this.ann_list[i].publish_date,"yyyy-MM-dd")==curr_date){
                //         this.ann_count = this.ann_count+1;
                //     }
                }
                // console.log(this.ann_count);
                // console.log('getAnnList',this.ann_list);
                this.hasAnnoucement = true; 
                //this.loading = false;
            } 
        }, error => {
            // console.log('[ERROR] Fetch data annoucement' + error);
        })             
    }

    getUrlImage(hashImg) {        
        //let imgUrl = GlobalVariable.BASE_IDP_URL + "/hrc/get/image/" + hashImg+ "/?api_key=" + GlobalVariable.API_KEY;
        if(hashImg){
            return GlobalVariable.BASE_IDP_URL + BlankVars.getAnnImg  + hashImg + "/?api_key=" + GlobalVariable.API_KEY;
        } else {
            return this.ann_default_imgUrl;
        }
    }    

    commAttachment;
    view_list_attachment;
    getCommAttachment(id) {        
        
        // "news_id": 3,
        // "image_hash": "OFqR2ZvN2A3QoMyE",
        // "image_url": "/home/app/myApp/public/comm/attach/012649020721_register.pdf"
        //let imgUrl = GlobalVariable.BASE_IDP_URL + "/hrc/get/image/" + hashImg+ "/?api_key=" + GlobalVariable.API_KEY;        
        let getCommDetail = BlankVars.getCommAttachment+id;
        this._GET_api_Service.GET_HRC_data(getCommDetail).subscribe(data => {   
            // console.log(getCommDetail,data);
            if(data.length>0){
                this.commAttachment = data;
                for (var i = 0; i < this.commAttachment.length; i++) {
                    this.commAttachment[i].filename = this.commAttachment[i].image_url.substring(this.commAttachment[i].image_url.lastIndexOf('/')+1);
                    this.commAttachment[i].url_attachment = this.getUrlImage(this.commAttachment[i].image_hash);    
                }
                this.view_list_attachment = this.commAttachment;
                // console.log('commAttachment',this.commAttachment);
            } else {                
                // console.log('[ERROR] No data attachment');
                this.view_list_attachment = [];
            }
        }, error => {
            // console.log('[ERROR] Fetch data attachment ' + error);
        })   
    }
    
    selected_news;
    view_newsId;
    view_bodyImg;
    view_bodyImgEng;
    view_thumbImg;
    view_urlbodyImg;
    view_urlbodyImgEng;
    view_urlthumbImg;
    view_subject;
    view_category;
    view_sub_category;
    view_target_employee;
    view_location;
    view_publish_date;
    view_bodyHtml;
    view_bodyHtmlEng;
    view_hyperlink;
    view_isLiked;
    view_likeNewsCount;
    view_viewcount;
    view_commentNewsCount;
    // view_likeCount;
    announcement_id;
    viewNews(id) {                
        this.firstCommArr=[];
        this.secondCommArr=[];
        let getCommDetail = BlankVars.getCommDetail+id;
        // console.log(getCommDetail);
        this._GET_api_Service.GET_HRC_data(getCommDetail).subscribe(data => {   
            //console.log('data',data.length);
            if(data.length>0){
                // console.log(data, "getCommDetail");
                this.selected_news = data[0]; 
                this.getCommAttachment(this.selected_news.id)
                this.view_newsId = this.selected_news.id;
                this.view_thumbImg = this.selected_news.thumb;
                this.view_bodyImg = this.selected_news.bodyImage;
                this.view_bodyImgEng = this.selected_news.bodyImage_eng;
                this.view_urlthumbImg = this.getUrlImage(this.selected_news.thumb);
                this.view_urlbodyImg = this.getUrlImage(this.selected_news.bodyImage);
                this.view_urlbodyImgEng = this.getUrlImage(this.selected_news.bodyImage_eng);
                this.view_subject = this.selected_news.subject;
                this.view_category = this.selected_news.category;
                this.view_sub_category = this.selected_news.sub_category;
                this.view_target_employee = this.selected_news.target_empl;
                this.view_location = this.selected_news.location;
                this.view_publish_date = this.selected_news.publish_date;
                this.view_bodyHtml = this.selected_news.html;
                this.view_bodyHtmlEng = this.selected_news.html_eng;
                this.view_hyperlink = this.selected_news.hyper_link;
                if (this.selected_news.isViewed==0) this.view_viewcount = this.selected_news.viewcount +1;
                else this.view_viewcount = this.selected_news.viewcount;
                this.view_isLiked = this.selected_news.isLiked;
                // console.log("liked", this.view_isLiked)
                this.view_likeNewsCount = this.selected_news.likenewscount;
                // this.view_likeCount = this.selected_news.likeCount;
                // console.log(this.view_newsId, "newsIdComment")
                this.getCommentsData();
            }
        }, error => {
            // console.log('[ERROR] Fetch data annoucement' + error);
        })    
        
        //console.log(this.view_urlthumbImg);
        //this.loading = false; 
    }

    isReadMore = true
    readMore() {
        this.isReadMore = !this.isReadMore
     }

     isValidDate(str) {     
        try {            
            str = this.datePipe.transform(str,"d/MM/y");
            return true
        }
        catch(e) {
            return false
        }
      }

}