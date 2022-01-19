import { ComponentFactoryResolver, Component, OnInit, AfterViewInit, ViewEncapsulation, Injectable, HostListener, ElementRef, ViewChild, } from '@angular/core';
import { GET_Service } from '../../../api/get.service';
import { POST_Service } from '../../../api/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ComVars } from '../../../../../app/theme/pages/user/user-job/comments/comments-vars';
import { HttpClient } from "@angular/common/http";
import {EmojiPickerModule} from 'ng-emoji-picker';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { EnLang, MyLang } from '../user-job/language/language-vars';
import { convertCompilerOptionsFromJson } from 'typescript';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { En, My } from './lang-vars';
import { annoucementVars } from './annoucement-vars';
import { DatePipe } from '@angular/common'
import { GlobalVariable } from "../../../../../environments/environment";
import { PagerService } from '../../admin/job/shared/pager/pager.component';
import { BlankVars } from '../default/blank/blank-vars';

declare let $: any;

@Component({
    selector: 'annoucement',
    templateUrl: './annoucement.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./annoucement.component.css',
    '../../../../../assets/blank/fonts/font.css', 
    '../default/blank/default.css', 
    '../default/blank/blank.component.css']
})


export class annoucementComponent implements OnInit, AfterViewInit {

    descEmptyData = 'For better response, please customize your filter';  
           
    // pager object
    pager: any = {};
    pagedItems: any[];
    pageSize = annoucementVars.pageSize; 

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
    env = GlobalVariable.ENV_NAME;
    env_prod = false;
    commentLoading2 = true;
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
        private pagerService: PagerService,     
        private http: Http,
        private _GET_api_Service: GET_Service,
        private _POST_api_Service: POST_Service,
        notifierService: NotifierService,
        private domSanitizer: DomSanitizer,
        private router: Router,
        private _script: ScriptLoaderService,
        private datepipe: DatePipe,     
        private activeRoute: ActivatedRoute, private routers: Router) {
            // this.getUserLoginInfo();
            this.notifier = notifierService;        
            } 

    // enChecked: boolean = true;
    // word: any;
    loading = true;
    currUserId: any;    
    currDate = this.datepipe.transform(new Date(), 'dd-MM-yyyy h:mm a');
    bgClass;
    bgChange;
    wishingTime;
    timeZone;
    
    jobId:any;

    // showMyContainer: boolean = true;


    currentDate = new Date();
    category_news = ['Group Human Capital Management','Life at TM','AlHikmah & Budi'];
    group_users = ['GHCM','GITD','GBC','GSB'];

    url_img_thumb: string;
    news_list = [];
    searchCommForm: FormGroup;

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
        //this.checkSelectedLang();
        this.setBgPage();
        this.getCommList();   
        this.getGroupList();
        this.getCategoryList(); 
        this.getLocationList();
        this.getMonthList();
        this.getYearList();
        
        this.searchCommForm = new FormGroup({
            searchTerm: new FormControl('', Validators.required)
        });    

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.currentUserId = currentUser.userid;

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

      
        this.userProfilePic = this.domSanitizer.bypassSecurityTrustUrl(localStorage.getItem('userProfilePic'));
        this.userProfilePic = localStorage.getItem('userProfilePic'); 
        if(this.userProfilePic != 0) {
            this.userProfilePic  = this.userProfilePic.replace(/"/g , '')
            this.userProfilePic  = GlobalVariable.BASE_API_URL + BlankVars.APIGetImg + "/" + this.userProfilePic  + "?api_key=" + GlobalVariable.API_KEY;
        }

        
                       
    } //ngOnInit

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
    likeSecLayer(comId, index?){
        // console.log("likeSecondLayer with id", comId)
        let post: any = {};
        post = {
            comm_id: comId
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
    unlikeSecLayer(comId, index?){
        // console.log("unlikeSecondLayer with id", comId)
        let post: any = {};
        post = {
            comm_id: comId
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
            for (let i= 0; i < this.fLayer.length; i++) {
                   
                let ImgfisrtLyr = GlobalVariable.BASE_API_URL + ComVars.getImgAPI + "/" + this.fLayer[i].image_url + "?api_key=" + GlobalVariable.API_KEY;
                  this._GET_api_Service.GET_PictureByUrl(ImgfisrtLyr).subscribe(data => {   
                    let tempData;            
                    if (data) {
                        tempData= this.fLayer[i];
                        tempData.image_url= ImgfisrtLyr;
                        this.firstCommArr.push(tempData);
                        // console.log("First Comm Arr", this.firstCommArr)

                    if (this.fLayer[i].deletecomment==null && this.fLayer[i].deletecomment!=0) {
                        this.totalCommArrLength++;
                        // console.log("fLayer at index", i, this.totalCommArrLength)
                    }
    
                    }else {
                        tempData= this.fLayer[i];
                        tempData.image_url= '../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
                        this.firstCommArr.push(tempData);
                        // console.log("First Comm Arr", this.firstCommArr)

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
                            //  likeCountAnnoucement: this.fLayer[i].likeCountAnnoucement,
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
                            //  likeCountAnnoucement: this.sLayer[i].likeCountAnnoucement,
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
                        //    likeCountAnnoucement: this.sLayer[i].likeCountAnnoucement,
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

     notifyMsg: string;

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

     imgAPIUrl = GlobalVariable.BASE_API_URL + ComVars.getImgAPI;
        getPopupData = BlankVars.getPopup;

        ngAfterViewInit() {
        }

   // latest annoucement
   hasAnnoucement = false;
   ann_count; //data count
   ann_list = []; //default display all data filtered
   ann_list_all = []; //default display original list data
   ann_default_imgUrl = 'http://placehold.it/600x400?text=ERA';
   ann_detail;
   ann_attachment;

    getCommList() {         
        this._GET_api_Service.GET_HRC_data(annoucementVars.getAnnList).subscribe(data => {            
            this.ann_count = data.length;  
            if (data.length > 0) 
            {
                this.ann_list = data;
                //add new object url_thumb & url_bodyimg
                for (var i = 0; i < this.ann_list.length; i++) {
                //add url img to array
                this.ann_list[i].url_thumb = this.getUrlImage(this.ann_list[i].thumb); 
                this.ann_list[i].url_bodyImg = this.getUrlImage(this.ann_list[i].bodyImage); 
                this.ann_list[i].url_bodyImgEng = this.getUrlImage(this.ann_list[i].bodyImage_eng);   
                }
                this.ann_list_all = this.ann_list;
                // console.log('ann_list: ',this.ann_list);
                this.hasAnnoucement = true; 
                this.loading = false
            }   
        }, error => {
            // console.log('[ERROR] Fetch data annoucement' + error);
        })            
    }

    filterList;
    getCommListAfterFilter(data){
        // console.log(data, "after filter")
        if (data.byyear != null){
            this.filterList = data.byyear;

        } else if(data.bymonth != null){
            this.filterList = data.bymonth;

        } else if(data.byyearmonth != null){
            this.filterList = data.byyearmonth;
        }

        
        this.ann_count = this.filterList.length;  
            if (this.filterList) 
            {
                this.ann_list = this.filterList;
                //add new object url_thumb & url_bodyimg
                if (this.filterList.length > 0) {
                    for (var i = 0; i < this.ann_list.length; i++) {
                        //add url img to array
                        this.ann_list[i].url_thumb = this.getUrlImage(this.ann_list[i].thumb); 
                        this.ann_list[i].url_bodyImg = this.getUrlImage(this.ann_list[i].bodyImage); 
                        this.ann_list[i].url_bodyImgEng = this.getUrlImage(this.ann_list[i].bodyImage_eng);   
                        }
                }
                // this.ann_list_all = this.ann_list;
                // console.log('ann_list: 2',this.ann_list);
                this.hasAnnoucement = true; 
                this.loading = false
            } error => {
                // console.log('[ERROR] Fetch data annoucement' + error);
            }    
    }


    getUrlImage(hashImg) {        
        //let imgUrl = GlobalVariable.BASE_IDP_URL + "/hrc/get/image/" + hashImg+ "/?api_key=" + GlobalVariable.API_KEY;
        if(hashImg){
            return GlobalVariable.BASE_IDP_URL + annoucementVars.getAnnImg  + hashImg + "/?api_key=" + GlobalVariable.API_KEY;
        } else {
            return this.ann_default_imgUrl;
        }
    }

    getCommDetail(commId){    
        let getCommDetailApi =  annoucementVars.getCommDetail+commId
        this._GET_api_Service.GET_HRC_data(getCommDetailApi).subscribe(data => {          
            this.ann_detail = data;
        }, error => {
            // console.log('[ERROR] Fetch detail data ' + error);
        }) 
    }

    commAttachment;
    view_list_attachment
    getCommAttachment(id) {        
        
        // "news_id": 3,
        // "image_hash": "OFqR2ZvN2A3QoMyE",
        // "image_url": "/home/app/myApp/public/comm/attach/012649020721_register.pdf"
        //let imgUrl = GlobalVariable.BASE_IDP_URL + "/hrc/get/image/" + hashImg+ "/?api_key=" + GlobalVariable.API_KEY;        
        let getCommDetail = annoucementVars.getCommAttachment+id;
        //console.log(getCommDetail);
        this._GET_api_Service.GET_HRC_data(getCommDetail).subscribe(data => {   
            if(data.length>0){
                this.commAttachment = data;
                for (var i = 0; i < this.commAttachment.length; i++) {
                    this.commAttachment[i].filename = this.commAttachment[i].image_url.substring(this.commAttachment[i].image_url.lastIndexOf('/')+1);
                    this.commAttachment[i].url_attachment = this.getUrlImage(this.commAttachment[i].image_hash);    
                }
                this.view_list_attachment = this.commAttachment;
                //console.log('commAttachment',this.commAttachment);
            } else {                
                // console.log('No data attachment');
                this.view_list_attachment = [];
            }
        }, error => {
            // console.log('[ERROR] Fetch data attachment ' + error);
        })   
    }   

    errSearchTerm;
    seachComm(searchTerm) {    
        // console.log(searchTerm.length, "Search Keyword Length")
        // let curr_year =  this.datepipe.transform(new Date(), 'yyyy')        
        // this.loading = true;
    if (searchTerm.length == 0) {
            this.errSearchTerm = false ;
            this.ann_list = this.ann_list_all;
       }
        let curr_year =  this.datepipe.transform(new Date(), 'yyyy')        //Current year
        this.loading = true;     

    if(searchTerm.length > 3){
        this.show_list_year = '';
        this.show_list_month = '';
         this.errSearchTerm = false ;                

         let searchTerm = this.searchCommForm.get('searchTerm').value;

         //set data to post
         let postData = {
            txtkeyword: searchTerm,
            // year: curr_year  
         }
           
         this._POST_api_Service.POST_HRC_data(annoucementVars.postCommSearch,postData).subscribe(data => { 
            if (data.length > 0) 
            {
                this.ann_list = data;
                //add new object url_thumb & url_bodyimg
                for (var i = 0; i < this.ann_list.length; i++) {
                //add url img to array
                this.ann_list[i].url_thumb = this.getUrlImage(this.ann_list[i].thumb); 
                this.ann_list[i].url_bodyImg = this.getUrlImage(this.ann_list[i].bodyImage); 
                this.ann_list[i].url_bodyImgEng = this.getUrlImage(this.ann_list[i].bodyImage_eng);   
                }
                
                // console.log('rs_ann_list: ',this.ann_list);
                this.hasAnnoucement = true; 
                this.loading = false
            } 
            else {
                this.ann_list = data;
                this.hasAnnoucement = true; 
                this.loading = false
            }
         }, error => {
            //  console.log('[ERROR] Fetch search data annoucement' + error);
         })   
    }  else {
         this.errSearchTerm = 'Search Term must more than 3 characters' ;
         this.ann_list = this.ann_list_all;
    }
    this.loading = false; 
    }

    resetApplyForm(){
        // if(this.cb_year != null || this.cb_month != null){
            this.searchCommForm.reset();
        // }
        
        //console.log(planDate);
    }

    scrollToElement(): void {
        let element = document.getElementById('targetpage');
         element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
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

        let getCommDetail = BlankVars.getCommDetail+id;
        //console.log(getCommDetail);
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

   searchFilterTitle(searchTerm){
    this.loading = true; 
       if(searchTerm.length > 3){
            this.errSearchTerm = false ;     

            //single filter
            this.ann_list = this.ann_list.filter(subject => Object.keys(subject).some(k => subject[k] != null && 
            subject[k].toString().toLowerCase()
            .includes(searchTerm.toLowerCase())))

            // let filter = {
            //     subject: searchTerm,
            //     sub_category: searchTerm,
            //     location: searchTerm
            // };

            // this.ann_list = this.ann_list.filter(function(item) {
            //     for (var key in filter) {
            //       if (item[key] === undefined || item[key].toString().toLowerCase() != filter[key].toString().toLowerCase())
            //         return false;
            //     }
            //     return true;
            //   });
              
            // console.log(this.ann_list)
       } else if (searchTerm.length == 0) {
            this.errSearchTerm = false ;
            this.ann_list = this.ann_list_all;
       } else {
            this.errSearchTerm = 'Search Term must more than 3 characters' ;
            this.ann_list = this.ann_list_all;
       }
       this.loading = false; 
   }

   cb_gname;
   cb_cat;
   cb_year;
   cb_month;
   searchFilterByCb(cb,cb_val){
    //    console.log(cb, "cb")
    //    console.log(cb_val, "cb_val")
       if (cb == 0){
            this.cb_year = cb_val;
       }else if(cb == 1){
           this.cb_month = cb_val;
       }
    //    console.log(this.cb_year, "cb_year");
    //    console.log(this.cb_month, "cb_month");

       if (this.cb_year != null && this.cb_month == null){
        let filter = {
            year: this.cb_year,
        };
        this.getListByYear(filter);
        this.resetApplyForm();
       }else if(this.cb_month != null && this.cb_year == null){
        let filter = {
            month: this.cb_month
        };
        this.getListByMonth(filter);
        this.resetApplyForm();
       }else if(this.cb_year != null && this.cb_month != null){
        let filter = {
            // subject: this.cb_gname,
            // sub_category: this.cb_cat,
            year: this.cb_year,
            month: this.cb_month
        };
        this.getListbyYearMonth(filter);
        this.resetApplyForm();
       }
   }


   getListByYear(filter){
       this._POST_api_Service.POST_HRC_data(annoucementVars.getYearList, filter).subscribe(data => {
        //    console.log(data);
        //    console.log(data, "getYear");
           this.loading = true;
           this.getCommListAfterFilter(data)
       })

   }

   getListByMonth(filter){
       this._POST_api_Service.POST_HRC_data(annoucementVars.getMonthList, filter).subscribe(data => {
        //    console.log(data);
        //    console.log(data, "getMonth");
           this.loading = true;
           this.getCommListAfterFilter(data)
       })
   }

   getListbyYearMonth(filter){
        // let data = {
        //     year: year,
        //     month: month
        // }
        this._POST_api_Service.POST_HRC_data(annoucementVars.getMonthYearList, filter).subscribe(data => {
            // console.log(data, "getYearMonth");
            this.loading = true;
           this.getCommListAfterFilter(data)
        })
   }
      
   list_group_users;
   getGroupList(){       
        this.loading = true; 
        this._GET_api_Service.GET_HRC_data(annoucementVars.getGroupList).subscribe(data => {
            this.list_group_users = data;
            //console.log('getGroupList',data);
        });
        this.loading = false; 
   }

//    show_list_group;
//    show_list_group_users(){       
//         this.show_list_group = !this.show_list_group;
//         this.getGroupList()
//    }     

   list_category_news;
   getCategoryList(){
        this.loading = true; 
        this._GET_api_Service.GET_HRC_data(annoucementVars.getCategoryList).subscribe(data => {
            this.list_category_news = data;
            //console.log('getCategoryList',data);
        });
        this.loading = false; 
   }

//    show_list_category;
//    show_list_category_news(){       
//         this.show_list_category = !this.show_list_category;
//         this.getCategoryList()
//    }     
      
   list_location;
   getLocationList(){
        this.loading = true; 
        this._GET_api_Service.GET_HRC_data(annoucementVars.getLocationList).subscribe(data => {
            this.list_location = data;
            //console.log('getLocationList',data);
        });
        this.loading = false; 
        //console.log(this.list_location);
   }
   

   show_list_month;
   show_list_month_news(){       
    //    console.log(this.show_list_month,'test apa')
       if(this.cb_month != null){
        // this.resetApplyForm();
        this.cb_month = null;
        this.show_list_month = !this.show_list_month;
        this.getCommList();
       }else {
        this.show_list_month = !this.show_list_month;
        this.getMonthList()
       }
   }     

   list_month;
   getMonthList(){
        this.list_month = [
           {monthNum: 1, monthName: "January"},
           {monthNum: 2, monthName: "February"},
           {monthNum: 3, monthName: "March"},
           {monthNum: 4, monthName: "April"},
           {monthNum: 5, monthName: "May"},
           {monthNum: 6, monthName: "June"},
           {monthNum: 7, monthName: "July"},
           {monthNum: 8, monthName: "August"},
           {monthNum: 9, monthName: "September"},
           {monthNum: 10, monthName: "October"},
           {monthNum: 11, monthName: "November"},
           {monthNum: 12, monthName: "December"}
        ];
        //console.log(this.list_month);
   }
      

   show_list_year;
   show_list_year_news(){   
        if(this.cb_year != null){
        // this.resetApplyForm();
        this.cb_year = null;
        this.show_list_year = !this.show_list_year;
        this.getCommList();
        }else {
        this.show_list_year = !this.show_list_year;
        this.getYearList()
       }    
        
   }     

   list_year;
   getYearList(){
       this.list_year = [2022,2021,2020]
       //console.log(this.list_year);
   }

    // Set page    
    setPage(page: number) {
        // get pager object from service
        //this.pager = this.pagerService.getPager(this.data2.length, page, this.pageSize);
        // get current page of items
       //this.pagedItems = this.data2.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    //setbody background follow homepage
    setBgPage(){
        this._GET_api_Service.GET_SEA_data(annoucementVars.backgroundImg).subscribe(res => {

            let special = res.findIndex(item => item.type === "special");
            if (special >= 0) {
                this.wishingTime = res[special].msg
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
    } //setBgPage

    //default setup in page - language
    checkSelectedLang() {
        let lang = localStorage.getItem('idpLang');
        if (lang) {
            if (lang === 'en') {
                this.enChecked = true;
                this.word = En;
            }
            if (lang === 'my') {
                this.enChecked = false;
                this.word = My;
            }
        }
        else {
            this.enChecked = true;
            this.word = En;
            localStorage.setItem('idpLang', 'en');
        }
    } //checkSelectedLang

    //default setup in page - language
    langChange(id) {
        let selectedLang = id.value;
        if (selectedLang === 'en') {
            this.word = En;
            localStorage.setItem('idpLang', 'en');
            this.enChecked = true;
        }
        if (selectedLang === 'my') {
            this.word = My;
            localStorage.setItem('idpLang', 'my');
            this.enChecked = false;
        }
        document.getElementById('lang_close').click();
    } //langChange

}