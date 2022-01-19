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
import { FormGroup, FormControl, Validators } from '@angular/forms';


import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
@Component({
    selector: 'search-job',
    templateUrl: './search-job.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./search-job.component.css']
})

export class SearchJobComponent implements OnInit {
    
    loading = true; loading2 = false;
    
    searchForm : FormGroup;

    constructor(
        private http: Http, private _location : Location,
        private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service,
        private routers: Router,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver
    ) {
        
    }

    enChecked : boolean = true;
    word: any;
    searchFilterAPI = '/search/jobAdv/advertised';

    filterData;
    jobListArray;
    
    ngOnInit() {

        this.searchForm = new FormGroup({
            filterLob: new FormControl('', Validators.required),
            filterType: new FormControl('', Validators.required),
            filterRegion: new FormControl('', Validators.required),
            filterRelevant: new FormControl('', Validators.required),
            filterPositionID: new FormControl('', Validators.required),
            filterCompany: new FormControl('', Validators.required),
        });

        let lang = localStorage.getItem('lang');
        console.log(lang)
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


        this._GET_api_Service.GET_data('/search/jobAdv/advertised/filter').subscribe(res => {
            this.filterData = res.filter;
            this.loading = false;
        }, error => {
            console.log('[ERROR - Fail to get search filters] ' + error);
        })     
        
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

    showNoResults = false;
    searchSubmit(){
        this.loading2 = true;
        let posData = {
            lob : this.searchForm.get('filterLob').value,
            type : this.searchForm.get('filterType').value,
            region :  this.searchForm.get('filterRegion').value,
            relevant : this.searchForm.get('filterRelevant').value,
            postid : this.searchForm.get('filterPositionID').value,
            company : this.searchForm.get('filterCompany').value,


        }

        type jobList = {
            id: number, jPos: string, jTitle: string, loc: string, closeDt: string, img: string,
            no_view: number, no_like: number, no_comnt: number, no_apply: number, isLiked: number,
            div : string , type: number,
        }

        let all: jobList [] = [];


        this._POST_api_Service.POST_data(this.searchFilterAPI, posData).subscribe( data => {

            for(let i=0; i < data.length; i++ ){
                let imgSrc = GlobalVariable.BASE_API_URL+JobsVars.imgAPI+data[i].image_url+'?api_key=' + GlobalVariable.API_KEY;
                
                all.push({
                    id: data[i].id, jPos: data[i].position, jTitle: data[i].job_title, loc: data[i].location, 
                    closeDt: data[i].close, img: imgSrc, no_view: data[i].viewCount, no_like: data[i].likeCount,
                    no_comnt: data[i].commentCount, no_apply: data[i].applyCount, isLiked: data[i].isLiked,
                    div: data[i].division , type: data[i].type ,
                });
            }

            this.jobListArray = all;
            if(!this.jobListArray.length){
                this.showNoResults = true;
            }
            this.loading2 = false;
        },
        error => {
            this._alertService.error("Loading Job List Failed");
            console.log('[ERROR - Job List] ' + error);
            this.loading2 = true;
        });
        
    }

    jobInfoClicked(jobId) {
        // localStorage.setItem('returnLobID', this.lobID + 1);
        this.routers.navigate(['/user-job/job-info', jobId]);
    }

    btnBackClick(){
        this._location.back();
    }

    likeClicked(index, id){

        let liked = this.jobListArray[index].isLiked;
        let posData = {
            id : id
        }
        if(liked){
            let api = JobsVars.unLikeJobAPI;
            this._POST_api_Service.POST_data(api, posData).subscribe(res =>{
                this.jobListArray[index].isLiked = res[0].isLiked;
                this.jobListArray[index].no_like = res[0].likeCount;
                
            });
        }
        else{
            let api = JobsVars.likeJobAPI;
            this._POST_api_Service.POST_data(api, posData).subscribe(res =>{
                this.jobListArray[index].isLiked = res[0].isLiked;
                this.jobListArray[index].no_like = res[0].likeCount;
                
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