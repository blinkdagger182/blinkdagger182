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
import { NotifierService } from 'angular-notifier';

import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { SubscriptionLoggable } from 'rxjs/testing/SubscriptionLoggable';
@Component({
    selector: 'tracking-review',
    templateUrl: './review.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./review.component.css']
})

export class ReviewComponent implements OnInit {

    apply_id;

    private readonly notifier: NotifierService;
    constructor(
        private http: Http, private _location: Location,
        private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service,
        private activeRoute: ActivatedRoute,
        private routers: Router, notifierService: NotifierService,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver
    ) {
        this.notifier = notifierService;

        this.activeRoute.params.subscribe(params => {
            this.apply_id = params.idx;

        });
    }

    enChecked: boolean = true;
    word: any;
    loading = true;
    loadingDisplay1 = true;
    loadingDisplay2 = true;
    isSuperior = false;
    pendingReview = [];
    imgAPIUrl = GlobalVariable.BASE_API_URL + JobsVars.imgAPI;
    ngOnInit() {

        let sup = localStorage.getItem('isSuper');
        if (sup == '1')
            this.isSuperior = true;

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

        if (this.isSuperior) {
            let api = JobsVars.getJobApproveSupList;

            type approve = {
                id: number, adv_id: number, Staff_No: string, name: string,
                job_title: string, lob_img: string, close: string, daysLeft: string, lob: string,
                location: string
            }

            let apprList: approve[] = [];
            let lobImgSrc; let daysLeft

            this._GET_api_Service.GET_data(api).subscribe(res => {
                for (let i = 0; i < res.length; i++) {
                    if (res[i].id == this.apply_id) {

                        let imgURL = res[i].job_image_url;
                        if (imgURL) {
                            lobImgSrc = this.imgAPIUrl + '/' + imgURL + '?api_key=' + GlobalVariable.API_KEY;
                        }
                        else
                            lobImgSrc = '';

                        if (res[i].close) {
                            var closeDt = res[i].close;
                            var today = new Date();
                            var oneDay = 1000 * 60 * 60 * 24;
                            var diff = (Date.parse(closeDt) - Date.parse(today.toString())) / oneDay;

                            if (diff >= 0)
                                daysLeft = Math.ceil(diff);
                            // else
                            //     daysLeft = null;
                        }

                        apprList.push({
                            id: res[i].id, adv_id: res[i].adv_id, Staff_No: res[i].Staff_No,
                            name: res[i].Pernr_Name, job_title: res[i].job_title, lob_img: lobImgSrc,
                            close: res[i].close, daysLeft: daysLeft, lob: res[i].lob,
                            location: res[i].location
                        });
                    }
                }
                this.pendingReview = apprList;
                this.loading = false;
            })
        }

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

    btnBackClick() {
        this._location.back();
    }

    //POSITION INFO
    jobId;
    jobInfoLoading = true;
    jobInfoArr: any;
    leadLevel: boolean;
    jProfile; jDescription; jAoR; jRequire; jSuccess; jDigital; jFunctional; jTechnical; jQualification;

    superior: any;
    msg;
    title;
    lobName;
    lobsArray; 
    // returnUrlId;
    userData: any;
    careerData : any;
    userImg : any;
    superiorImg: any

    applied; appliedStatusID;
    nePromo = false;
    isReview: boolean;
    PosInfoClicked(adv_id) {
        // this.routers.navigate(['/user-job/job-info', adv_id, 1]);
        this.isReview = true;

        //POSITION INFORMATION
        let jobProfileAPI = JobsVars.jobProfileAPI;
        let jobAppAPI = JobsVars.jobAppAPI;
        let jobAppStatusAPI = JobsVars.jobAppStatusAPI;

        let postData = { id : adv_id };

        this._POST_api_Service.POST_data(jobAppStatusAPI,postData).subscribe(data => {
            if(data.length > 0){
                this.applied = true;
                this.appliedStatusID = data[0].status_code;
            }

        })

        this._POST_api_Service.POST_data(jobAppAPI, postData).subscribe(data => {
            this.jobInfoLoading = false;
            this.jobInfoArr = data;
            this.lobName = this.jobInfoArr.info[0].lob;
            this.jProfile = this.jobInfoArr.profile;

            if(this.jProfile[0].type === 3){
                this.nePromo = true;
            }
            this.jDescription = this.jobInfoArr.purpose;
            this.jAoR = this.jobInfoArr.aor; 
            this.jRequire = this.jobInfoArr.requirements;
            this.jSuccess = this.jobInfoArr.success;
            this.jDigital = this.jobInfoArr.digital;

            if(this.jDigital[0].level === 'Lead')
                    this.leadLevel = true;
                else if(this.jDigital[0].level === 'Support')
                    this.leadLevel = false;
            
            this.jFunctional = this.jobInfoArr.functional; 
            this.jTechnical = this.jobInfoArr.technical;
            this.jQualification = this.jobInfoArr.qualification;
        },
        error => {
            this._alertService.error("View Job Profile Info Failed");
            console.log('[ERROR - Job Profile] ' + error);
            this.jobInfoLoading = true;
        });

        let superiorInfoAPI  = JobsVars.superiorInfoAPI;
        this._GET_api_Service.GET_data(superiorInfoAPI).subscribe(data => {
            this.superior = data[0].Rept_To_Name;
        },
        error => {
            console.log("Couldn't get superior info" + error);
        });
    }

    openModal(){
        if(this.enChecked){
            this.title = "Confirm ?"
            if(!this.nePromo){
                this.msg = "Please confirm your application. Your application will be sent to your supervisor ( "+ this.superior + " ) for approval.";  
            }
            else{
                this.msg = "Please confirm your application. Your application will be sent to HCBD for the shortlisting process.";
            }
        }
        else{
            this.title = MyLang.confirm+ ' ?';
            if(!this.nePromo){
                this.msg = "Sila sahkan permohonan anda. Permohonan anda akan dihantar kepada penyelia anda ( "+ this.superior + " ) bagi mendapatkan kelulusan.";
            }
            else{
                this.msg = "Sila sahkan permohonan anda. Permohonan anda akan dihantar ke HCBD untuk disenarai pendek.";
            }
        }
        window.scrollTo(0, 0);
    }

    applyShowMsg = false;
    failed = false;
    applyMsg: string;
    applyStyle: string; applyIcon: string;
    afterSubmit = false;
    jobApplyClicked(job_id){
        
        this.loading = true;
        let postApi = JobsVars.jobApplyAPI;
        let dataPost: any = {
            id : job_id
        }

        let applyRes: any = {};

        let jobApplied = this._POST_api_Service.POST_data(postApi,dataPost).subscribe(data => {
            applyRes = data;
            this.loading = false;

            if(applyRes.status == "Error"){
                
                this.title = (this.enChecked) ? "Uh oh!" : "Maaf!";
                this.msg = (this.enChecked) ? applyRes.msg : applyRes.msgMy;
                this.failed = true;
                   
            }
            else {
                this.title = (this.enChecked) ? "Success!" : "Berjaya!";
                this.msg = (this.enChecked) ?"All progress takes place outside the comfort zone. Good luck and all the best !" :
                            "Kemajuan diri berlaku di luar zon selesa. Tahniah atas tindakan anda dan selamat maju jaya !";
                this.failed = false;
            }

            this.afterSubmit = true;

        });

    }

    afterSubmitClick(){
        this._location.back();
        // this._router.navigate(['/user-job/select-job', this.returnUrlId]);
    }
    //END POSITION INFO

    //CANDIDATE INFO
    APIgetProfile = JobsVars.APIgetProfile;
    getUserProfileAPI = JobsVars.getUserProfileAPI;
    jobApplyLoading = true;
    candidInfoClicked(staffId) {
        var datap = {
            friendID: staffId,     
        }
        let datap2 = {
            staffNo: staffId,     
        }
        this._POST_api_Service.POST_data(this.APIgetProfile, datap).subscribe(dataRes => {

            this.userData = dataRes.body[0];
            this.userImg = this.imgAPIUrl+'/'+this.userData.friendImageUrl+'?api_key='+GlobalVariable.API_KEY;
            this.superiorImg = this.imgAPIUrl+'/'+this.userData.supervisorImage+'?api_key='+GlobalVariable.API_KEY;

            this._POST_api_Service.POST_data(this.getUserProfileAPI, datap2).subscribe(resCareer => {
                this.jobApplyLoading = false; 
                this.careerData = resCareer.career;
            });
        });
        // this.routers.navigate(['/other-profile', staffId]);
    }

    //Sent Request friend Profile
    sendReqProfUser: any = {};
    reqLoadingProfile = false;

    sendRequestProfile(friendID) {

        let api = JobsVars.APIsendRequestFr;

        let data = { friendID: friendID }
        
        this._POST_api_Service.POST_data(api, data).subscribe(dataRes => {
            // console.log(dataRes)
            this.userData.hasSentRequest = true;

        },
        error => {
            console.log('[ERROR + User Not Found]', error);
        })
    }

    selectReject(friendID){
        let api = JobsVars.APIrejectFriend;

        let data = { friendID : friendID };

        this._POST_api_Service.POST_data(api, data).subscribe(dataRes => {
            // console.log(dataRes)
            // this.userData.hasSentRequest = true;
            this.userData.totalFriendsNum = this.userData.totalFriendsNum - 1;
            this.userData.isMutualFriend = false;

            document.getElementById('rejectNo').click();
            this._POST_api_Service.POST_data(this.APIgetProfile, data).subscribe(dataRes => {

                this.userData = dataRes.body[0];
                // console.log(this.userData)
                
            });

        },
        error => {
            console.log('[ERROR + User Not Found]', error);
        })

    }

    RejectPending(friendID){
        let api = JobsVars.APIrejectFriend;

        let data = { friendID : friendID };

        this._POST_api_Service.POST_data(api, data).subscribe(dataRes => {
            
            this.userData.pendingFriendRequest = false;

            document.getElementById('rejectPendNo').click();
            this._POST_api_Service.POST_data(this.APIgetProfile, data).subscribe(dataRes => {

                this.userData = dataRes.body[0];
                // console.log(this.userData) 
            });
        },
        error => {
            console.log('[ERROR + User Not Found]', error);
        })
    }

    selectAccept(friendID){
        let api = JobsVars.APIacceptFriend;

        let data = { friendID : friendID };

        this._POST_api_Service.POST_data(api, data).subscribe(dataRes => {
            
            this.userData.isMutualFriend = true;
            this.userData.totalFriendsNum = this.userData.totalFriendsNum + 1;
            this.userData.pendingFriendRequest = false;

            this._POST_api_Service.POST_data(this.APIgetProfile, data).subscribe(dataRes => {

                this.userData = dataRes.body[0];
                // console.log(this.userData) 
            });
        },
        error => {
            console.log('[ERROR + User Not Found]', error);
        })
    }

    cancelReqProfile(friendID){

        let api = JobsVars.APIrejectFriend;

        let data = { friendID : friendID };

        this._POST_api_Service.POST_data(api, data).subscribe(dataRes => {
            
            this.userData.hasSentRequest = false;

            document.getElementById('cancelReqNo').click();
            this._POST_api_Service.POST_data(this.APIgetProfile, data).subscribe(dataRes => {

                this.userData = dataRes.body[0];
                // console.log(this.userData) 
            });
        },
        error => {
            console.log('[ERROR + User Not Found]', error);
        })
    }
    //END CANDIDATE INFO

    actionTitle: any;
    actionMsg: any;
    isApprove: boolean;
    actionClicked(num) {
        if (num === 1) {
            this.isApprove = true;
            this.actionTitle = this.word.approve + " ?";
            this.actionMsg = this.word.approveMsg;
        }
        else {
            this.isApprove = false;
            this.actionTitle = this.word.reject + " ?"
            this.actionMsg = this.word.approveMsg + ' ' + this.word.rejectMsg;
        }

    }

    gotRemark = false;
    notifyMsg: string;
    checkRemark(e) {
        this.gotRemark = (e.target.value.length) ? true : false;
    }

    approveClicked() {
        let pos = {
            id: this.apply_id,
            remark: '',
            approve: true
        }

        let api = JobsVars.editJobApproveSupList;

        this._POST_api_Service.POST_data(api, pos).subscribe(res => {

            this.notifyMsg = this.word.successApproval;
            this.notifier.notify('success', this.notifyMsg);

            document.getElementById('close_btn').click();

            setTimeout(() => {
                this._location.back();
            }, 3000)
        }, err => {
            this.notifyMsg = this.word.failApproval;
            this.notifier.notify('error', this.notifyMsg);

            document.getElementById('close_btn').click();

        })

    }

    rejectClicked() {
        let remark = (<HTMLInputElement>document.getElementById('remark')).value;

        if (remark.length) {

            let pos = {
                id: this.apply_id,
                remark: remark,
                approve: false
            }

            let api = JobsVars.editJobApproveSupList;

            this._POST_api_Service.POST_data(api, pos).subscribe(res => {

                this.notifyMsg = this.word.successReject;
                this.notifier.notify('success', this.notifyMsg);

                document.getElementById('close_btn').click();

                setTimeout(() => {
                    this._location.back();
                }, 3000)

            }, err => {
                this.notifyMsg = this.word.failReject;
                this.notifier.notify('error', this.notifyMsg);

                document.getElementById('close_btn').click();

            })

        }

    }

}
