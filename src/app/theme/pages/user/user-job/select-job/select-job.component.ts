import { ComponentFactoryResolver, Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from '../../../../../auth/_services/alert.service';
import { Http, HttpModule, Response } from '@angular/http';
import { GlobalVariable } from "../../../../../../environments/environment";
import { JobsVars } from '../user-job-vars';
import { EnLang, MyLang } from '../language/language-vars';
import { Location } from '@angular/common';


import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
@Component({
    selector: 'select-job',
    templateUrl: './select-job.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./select-job.component.css']
})

export class SelectJobComponent implements OnInit {
    lobID;
    loading = true; loading2 = true;
    jobLobsArray: any;
    
    jobTotalAPI = JobsVars.jobTotalAPI;
    lobImgSrc;
    lobName;

    title = JobsVars.pageTitle;

    constructor(
        private http: Http, private _location : Location,
        private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service,
        private activeRoute: ActivatedRoute, 
        private routers: Router,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver
    ) {
        this.activeRoute.params.subscribe(params => {
            this.lobID = params.idx - 1;
        });
    }

    enChecked : boolean = true;
    word: any;
    filterType : any;

    jobListArray: any;
    resData : any[];
    data_all: any[];
    data_rel : any[];
    data_exec : any[];
    data_non_exec : any[];
    data_ne_promo : any[];

    ngOnInit() {

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

        let flt = null;
        this.setFilter(flt);

        let jobListAPI = JobsVars.jobListAPI;
        let postDataObj;

        let lobN;
        

        // this._GET_api_Service.GET_data(this.jobTotalAPI).subscribe(lobs => {
        //     this.jobLobsArray = lobs;
        //     console.log(this.jobLobsArray, ' ni apa ?');
            // let lobImgUrl = this.jobLobsArray[this.lobID].image_url;
            // this.lobImgSrc = GlobalVariable.BASE_API_URL + JobsVars.imgAPI + lobImgUrl + '?api_key=' + GlobalVariable.API_KEY;
            //this.lobName = this.jobLobsArray[this.lobID].lob;

            lobN = localStorage.getItem("lobnames");
            

            postDataObj = { lob: lobN };

            this._POST_api_Service.POST_data(jobListAPI, postDataObj).subscribe(data => {

                this.resData = data;
                this.loading = false; this.loading2 = false;
                this.loadData(data);
            },
            error => {
                this._alertService.error("Loading Job List Failed");
                console.log('[ERROR - Job List] ' + error);
                this.loading2 = true;
            })

        // }, error => {
        //     this._alertService.error("Loading Job Total List Failed");
        //     console.log('[ERROR - Job Total List] ' + error);
        //     this.loading = true;
        // });
    }

    loadData(data){

        type jobList = {
            id: number, jPos: string, jTitle: string, loc: string, postDt: string, closeDt: string, img: string,
            no_view: number, no_like: number, no_comnt: number, no_apply: number, isLiked: number,
            div : string,
            type: number,
            org_unit: string
        }

        let all: jobList [] = [];
        let relevant: jobList[] = [];
        let exec: jobList[] = [];
        let non_exec: jobList[] = [];
        let ne_promo: jobList[] = [];

        for(let i=0; i < data.length; i++ ){

            let imgSrc = GlobalVariable.BASE_API_URL+JobsVars.imgAPI+data[i].image_url+'?api_key=' + GlobalVariable.API_KEY;
            
            
            if(this.filterType != 'all'){
                if(data[i].isRelevant == 1){
                    relevant.push({
                        id: data[i].id, jPos: data[i].position, jTitle: data[i].job_title ,loc: data[i].location, postDt: data[i].post_on,
                        closeDt: data[i].close, img: imgSrc, no_view: data[i].viewCount, no_like: data[i].likeCount,
                        no_comnt: data[i].commentCount, no_apply: data[i].applyCount, isLiked: data[i].isLiked,
                        div: data[i].division, type: data[i].type , org_unit: data[i].org_unit
                    });
                }

                if(data[i].type == 1){
                    exec.push({
                        id: data[i].id, jPos: data[i].position, jTitle: data[i].job_title, loc: data[i].location, postDt: data[i].post_on,
                        closeDt: data[i].close, img: imgSrc, no_view: data[i].viewCount, no_like: data[i].likeCount,
                        no_comnt: data[i].commentCount, no_apply: data[i].applyCount, isLiked: data[i].isLiked,
                        div: data[i].division, type: data[i].type , org_unit: data[i].org_unit
                    });
                }

                if(data[i].type == 2){
                    non_exec.push({
                        id: data[i].id, jPos: data[i].position, jTitle: data[i].job_title, loc: data[i].location, postDt: data[i].post_on,
                        closeDt: data[i].close, img: imgSrc, no_view: data[i].viewCount, no_like: data[i].likeCount,
                        no_comnt: data[i].commentCount, no_apply: data[i].applyCount, isLiked: data[i].isLiked,
                        div: data[i].division, type: data[i].type , org_unit: data[i].org_unit
                    });
                }

                if(data[i].type == 3){
                    ne_promo.push({
                        id: data[i].id, jPos: data[i].position, jTitle: data[i].job_title, loc: data[i].location, postDt: data[i].post_on,
                        closeDt: data[i].close, img: imgSrc, no_view: data[i].viewCount, no_like: data[i].likeCount,
                        no_comnt: data[i].commentCount, no_apply: data[i].applyCount, isLiked: data[i].isLiked,
                        div: data[i].division, type: data[i].type , org_unit: data[i].org_unit
                    });
                }

            }
            else{
                all.push({
                    id: data[i].id, jPos: data[i].position, jTitle: data[i].job_title, loc: data[i].location, postDt: data[i].post_on,
                    closeDt: data[i].close, img: imgSrc, no_view: data[i].viewCount, no_like: data[i].likeCount,
                    no_comnt: data[i].commentCount, no_apply: data[i].applyCount, isLiked: data[i].isLiked,
                    div: data[i].division, type: data[i].type , org_unit: data[i].org_unit
                });
            }
        }

        if(this.filterType === 'all') {
            this.data_all = all;
            this.jobListArray = this.data_all;
        }
        else if(this.filterType === 'relevant') {
            this.data_rel = relevant;
            this.jobListArray = this.data_rel;
        }
        else if(this.filterType === 'exec') {
            this.data_exec = exec;
            this.jobListArray = this.data_exec;
        }
        else if(this.filterType === 'non_exec') {
            this.data_non_exec = non_exec;
            this.jobListArray = this.data_non_exec;
        }
        else if(this.filterType === 'ne_promo') {
            this.data_ne_promo = ne_promo;
            this.jobListArray = this.data_ne_promo;
        }
    }

    filterOk(){
        this.loadData(this.resData);
        document.getElementById('cancel_btn').click();
    }

    flt_all: any; flt_rel:any; flt_exec: any; flt_nonEx:any; flt_neP: any;
    fltText;
    setFilter(flt){
        if(!flt){
            let filter = localStorage.getItem('filter');
            if(!filter)
            {
                localStorage.setItem('filter','all');
            }
            this.filterType = filter;
        }
        else{
            localStorage.setItem('filter',flt);
        }
        
        
        if(this.filterType === 'all'){
            this.flt_all = true; this.flt_rel = false; this.flt_exec = false; 
            this.flt_nonEx = false; this.flt_neP = false;
            this.fltText = 'all';
        }
        else if(this.filterType === 'relevant'){
            this.flt_all = false; this.flt_rel = true; this.flt_exec = false; 
            this.flt_nonEx = false; this.flt_neP = false;
            this.fltText = 'relevant';
        }
        else if(this.filterType === 'exec'){
            this.flt_all = false; this.flt_rel = false; this.flt_exec = true; 
            this.flt_nonEx = false; this.flt_neP = false;
            this.fltText = 'executive';
        }
        else if(this.filterType === 'non_exec'){
            this.flt_all = false; this.flt_rel = false; this.flt_exec = false; 
            this.flt_nonEx = true; this.flt_neP = false;
            this.fltText = 'non-executive';
        }
        else if(this.filterType === 'ne_promo'){
            this.flt_all = false; this.flt_rel = false; this.flt_exec = false; 
            this.flt_nonEx = false; this.flt_neP = true;
            this.fltText = 'NE promotion';
        }
    }

    getFltText(){
        if(this.filterType === 'all') return this.word.flt_all;
        else if(this.filterType === 'relevant') return this.word.flt_rel;
        else if(this.filterType === 'exec') return this.word.flt_exec;
        else if(this.filterType === 'non_exec') return this.word.flt_nonEx;
        else if(this.filterType === 'ne_promo') return this.word.flt_NE;
    }


    changeFilter(flt){
        this.filterType = flt;
        this.setFilter(flt);

        this.loadData(this.resData);
        document.getElementById('cancel_btn').click();
    }

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

    jobInfoClicked(jobId) {
        // localStorage.setItem('returnLobID', this.lobID + 1);
        this.routers.navigate(['/user-job/job-info', jobId]);
    }

    btnBackClick(){
        this._location.back();
        // this.routers.navigate(['/user-job']);
    }

    likeClicked(index, id){
        let resDataIndex = this.resData.findIndex( x => x.id === id);

        let liked = this.jobListArray[index].isLiked;
        let posData = {
            id : id
        }
        if(liked){
            let api = JobsVars.unLikeJobAPI;
            this._POST_api_Service.POST_data(api, posData).subscribe(res =>{
                this.jobListArray[index].isLiked = res[0].isLiked;
                this.jobListArray[index].no_like = res[0].likeCount;
                this.resData[resDataIndex].isLiked = res[0].isLiked;
                this.resData[resDataIndex].likeCount = res[0].likeCount;

                this.loadData(this.resData);
            });
        }
        else{
            let api = JobsVars.likeJobAPI;
            this._POST_api_Service.POST_data(api, posData).subscribe(res =>{
                this.jobListArray[index].isLiked = res[0].isLiked;
                this.jobListArray[index].no_like = res[0].likeCount;
                this.resData[resDataIndex].isLiked = res[0].isLiked;
                this.resData[resDataIndex].likeCount = res[0].likeCount;

                this.loadData(this.resData);
            });
        }      

    }

    commentClicked(jobId){
        // localStorage.setItem('returnLobID', this.lobID + 1);
        this.routers.navigate(['/user-job/comments', jobId]);
    }

    likeLoading = true;
    likedList;
    totalLikes;
    totalLikeClicked(index,jobId){
        let currUsrId = JSON.parse(localStorage.getItem('currentUser')).userid;
        this.totalLikes = this.jobListArray[index].no_like;
        type likes = {
            staffId: string, name: string, pos: string, isCircle: string, img: string; currUser: number
        }

        let likeAry : likes[] = [];

        let api = JobsVars.getLikedUserPI;
        let pos = {
            id : jobId
        }
        let imgSrc; let sameUser;

        this._POST_api_Service.POST_data(api, pos).subscribe( data => {

            for( let i=0; i < data.length; i++ ){
                
                let imgURL = data[i].image_url;
                if(imgURL){
                    imgSrc = GlobalVariable.BASE_API_URL+JobsVars.imgAPI+imgURL+'?api_key='+ GlobalVariable.API_KEY;
                }
                else
                    imgSrc = './assets/app/media/img/users/ghcm-user-default.jpg';

                if(data[i].Staff_No === currUsrId)
                    sameUser = 1;
                else
                    sameUser = 0;

                
                likeAry.push({
                    staffId: data[i].Staff_No, name: data[i].Name, pos: data[i].Post_Desc, 
                    isCircle: data[i].isCircle, img: imgSrc, currUser : sameUser
                })
            }

            this.likedList = likeAry;
            this.likeLoading = false

        })
    }

    viewUser(staffId){
        document.getElementById('close_btn').click();
        this.routers.navigate(['/other-profile',staffId]);
    }

    getStatus(status){
        return (status == 0)? "Not Following" : 
            (status == 'FRIEND') ? "Following" :
                (status == 'REQUEST') ? "Request Sent" : "Pending Approval";                    
    }


}