import { ComponentFactoryResolver, Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from '../../../../../auth/_services/alert.service';
import { Http, HttpModule, Response } from '@angular/http';
import { GlobalVariable } from "../../../../../../environments/environment";
//import { GlobalVariable } from '../../../../../../../ghcm-global';
import { JobsVars } from '../user-job-vars';
import { InfoVars } from '../job-info/job-info-vars';
import { EnLang, MyLang } from '../language/language-vars';
import { ComVars } from './comments-vars';
import { Location } from '@angular/common';
import { StringBreakPipe } from '../../../../../_custom_pipe/string_break.pipe';

import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { FormGroup, FormControl } from '@angular/forms';
@Component({
    selector: 'comments',
    templateUrl: './comments.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./comments.component.css']
})

export class CommentsComponent implements OnInit {
    jobId;
    // returnUrlId;
    jobLobsArray: any;
    lobImgSrc;
    jobInfoArr: any;
    leadLevel: boolean;
    jProfile; jDescription; jAoR; jRequire; jSuccess; jDigital; jFunctional; jTechnical; jQualification;
    commentLoading = true; commentLoading2 = true;

    addComntForm = new FormGroup({
        newComnt: new FormControl()
    });

    editComntForm = new FormGroup({
        editComnt: new FormControl()
    });

    constructor(
        private http: Http, private _location: Location,
        private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service,
        private activeRoute: ActivatedRoute, private _router: Router,

    ) {
        this.activeRoute.params.subscribe(params => {
            this.jobId = params.idx;
        });
    }

    enChecked: boolean = true;
    word: any;
    commentsData: any;
    imgAPIUrl = GlobalVariable.BASE_API_URL + ComVars.getImgAPI;

    imgSrc2;

    currUserName; currUserImgSrc;
    ngOnInit() {
        this.commentsData = [];

        let currUser = JSON.parse(localStorage.getItem('currentUser'));
        this.currUserName = currUser.body.name;
        this.currUserImgSrc = this.imgAPIUrl + '/' + currUser.body.image_url + '?api_key=' + GlobalVariable.API_KEY;

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

        // this.returnUrlId = localStorage.getItem('returnLobID');

        let jobTotalAPI = JobsVars.jobTotalAPI;

        // this._GET_api_Service.GET_data(jobTotalAPI).subscribe(lobs => {
        //     this.jobLobsArray = lobs;
        //     let lobImgUrl = this.jobLobsArray[this.returnUrlId-1 ].image_url;
        //     this.lobImgSrc = GlobalVariable.BASE_API_URL + JobsVars.imgAPI + lobImgUrl + '?api_key=' + GlobalVariable.API_KEY;
        // });

        let jobAppAPI = InfoVars.jobAppAPI;
        let postData = { id: this.jobId };

        this._POST_api_Service.POST_data(jobAppAPI, postData).subscribe(data => {
            this.commentLoading = false;
            this.jobInfoArr = data;
            this.jProfile = this.jobInfoArr.profile;
            this.jDescription = this.jobInfoArr.purpose;
            this.jAoR = this.jobInfoArr.aor;
            this.jRequire = this.jobInfoArr.requirements;
            this.jSuccess = this.jobInfoArr.success;
            this.jDigital = this.jobInfoArr.digital;

            if (this.jDigital[0].level === 'Lead')
                this.leadLevel = true;
            else if (this.jDigital[0].level === 'Support')
                this.leadLevel = false;

            this.jFunctional = this.jobInfoArr.functional;
            this.jTechnical = this.jobInfoArr.technical;
            this.jQualification = this.jobInfoArr.qualification;
        }, error => {
            this.commentLoading = true;
        });

        this.getCommentsData();

    }

    getCommentsData() {
        type comments = {
            comId: number, name: string, staff_no: string, img: string, comment: string, date: string,
            likeCount: number, isLiked: number
        }
        let commentAry: comments[] = [];
        let postData = { id: this.jobId };
        let getAdsComntAPI = ComVars.getAdsComntAPI;
        let imgSrc;
        this._POST_api_Service.POST_data(getAdsComntAPI, postData).subscribe(data => {

            for (let i = 0; i < data.length; i++) {
                let imgURL;

                imgURL = data[i].image_url;
                if (imgURL) {
                    imgSrc = this.imgAPIUrl + '/' + imgURL + '?api_key=' + GlobalVariable.API_KEY;
                }
                else
                    imgSrc = './assets/app/media/img/users/ghcm-user-default.jpg';

                commentAry.push({
                    comId: data[i].id, name: data[i].Name, staff_no: data[i].Staff_No,
                    img: imgSrc, comment: data[i].comment, date: data[i].update_on,
                    likeCount: data[i].likeCount, isLiked: data[i].isLiked
                })

            }

            this.commentsData = commentAry;
            this.commentLoading2 = false;

        });
    }

    newComment = false;
    get sortCommentsData() {
        return this.commentsData.sort((a, b) => {
            return <any>new Date(a.date) - <any>new Date(b.date);
        })
    }

    viewUser(staffId) {
        this._router.navigate(['/other-profile', staffId]);
    }

    viewUser2(staffId) {
        document.getElementById('close-btn').click();
        this._router.navigate(['/other-profile', staffId]);
    }

    getStatus(status) {
        return (status == 0) ? "Not Following" :
            (status == 'FRIEND') ? "Following" :
                (status == 'REQUEST') ? "Request Sent" : "Pending Approval";
    }

    checkSameUser(staffNo) {
        let userId = JSON.parse(localStorage.getItem('currentUser')).userid;

        if (staffNo.toUpperCase() === userId.toUpperCase())
            return true;
        else
            return false;
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

    now: any = new Date();
    before;
    older_24Hrs(date) {
        this.before = new Date(date);
        return ((this.now - this.before) > (1000 * 60 * 60 * 24)) ? true : false;
    }

    btnBackClick() {
        this._location.back();
        // this._router.navigate(['/user-job/select-job', this.returnUrlId]);   
    }

    addComment() {
        let comnt = this.addComntForm.get('newComnt').value;
        document.getElementById('reset-btn').click();

        this.commentLoading2 = true;
        let addComntApi = ComVars.addCommentAPI;

        let post = {
            id: this.jobId,
            comment: comnt
        }

        this._POST_api_Service.POST_data(addComntApi, post).subscribe(data => {
            this.getCommentsData();
            this.commentLoading2 = false;
        })
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

    deleteComment() {
        let api = ComVars.delOwnCommentAPI;
        let data = { id: this.commentId }

        this._POST_api_Service.POST_data(api, data).subscribe(res => {
            this.commentsData.splice(this.index, 1);
            document.getElementById('close_btn').click();
            //this.getCommentsData();
        })
    }

    editModeClicked(index, comId) {
        $('#edit_' + this.commentId).removeClass('m--hide');
        $('#edit2_' + this.commentId).addClass('m--hide');

        this.index = index;
        this.commentId = comId;

        $('#edit_' + comId).addClass('m--hide');
        $('#edit2_' + comId).removeClass('m--hide');
    }

    updateComnt(index, comId) {
        this.index = index;
        this.commentId = comId;

        let updtdComnt = (<HTMLInputElement>document.getElementById("updComnt_" + comId)).value;

        let editOwnCommentAPI = ComVars.editOwnCommentAPI;

        let data = {
            id: this.commentId,
            comment: updtdComnt
        }

        this._POST_api_Service.POST_data(editOwnCommentAPI, data).subscribe(res => {
            this.commentsData[index].comment = updtdComnt;
            $('#edit_' + comId).removeClass('m--hide');
            $('#edit2_' + comId).addClass('m--hide');

        })

    }

    cancelUpdComnt(comId) {
        $('#edit_' + comId).removeClass('m--hide');
        $('#edit2_' + comId).addClass('m--hide');
    }

    likeClicked(index, comId) {
        let liked = this.commentsData[index].isLiked;
        let posData = {
            id: comId
        }

        if (liked) {
            let api = ComVars.dislikeACommentAPI;
            this._POST_api_Service.POST_data(api, posData).subscribe(res => {
                this.commentsData[index].isLiked = res[0].isLiked;
                this.commentsData[index].likeCount = res[0].likeCount;
            });
        }
        else {
            let api = ComVars.likeACommentAPI;
            this._POST_api_Service.POST_data(api, posData).subscribe(res => {
                this.commentsData[index].isLiked = res[0].isLiked;
                this.commentsData[index].likeCount = res[0].likeCount;
            });
        }
    }


    likeLoading = true;
    likedList;
    totalLikes;
    totalLikeClicked(index, comId) {
        this.likeLoading = true;
        let currUsrId = JSON.parse(localStorage.getItem('currentUser')).userid;
        this.totalLikes = this.commentsData[index].likeCount;

        type likes = {
            staffId: string, name: string, pos: string, isCircle: string, img: string; currUser: number
        }

        let likeAry: likes[] = [];

        let api = ComVars.getUserLikedComntAPI;
        let pos = {
            id: comId
        }

        let imgSrc; let sameUser;

        this._POST_api_Service.POST_data(api, pos).subscribe(data => {

            for (let i = 0; i < data.length; i++) {

                let imgURL = data[i].image_url;
                if (imgURL) {
                    imgSrc = GlobalVariable.BASE_API_URL + JobsVars.imgAPI + imgURL + '?api_key=' + GlobalVariable.API_KEY;
                }
                else
                    imgSrc = './assets/app/media/img/users/ghcm-user-default.jpg';

                if (data[i].Staff_No === currUsrId)
                    sameUser = 1;
                else
                    sameUser = 0;


                likeAry.push({
                    staffId: data[i].Staff_No, name: data[i].Name, pos: data[i].Post_Desc,
                    isCircle: data[i].isCircle, img: imgSrc, currUser: sameUser
                })
            }

            this.likedList = likeAry;
            this.likeLoading = false

        });

    }


}