import { ComponentFactoryResolver, Component, OnInit, NgModule } from '@angular/core';
import "rxjs/add/operator/map";
import { POST_Service } from '../../../api/post.service';
import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions, URLSearchParams } from '@angular/http';
import { recfriend, recFriendArr, allfriendArr, skillArr, profileInfoArr } from "./arrayCons";
import { GlobalVariable } from "../../../../../environments/environment";
//import { GlobalVariable } from '../../../../../../../ghcm-global';
import { CircleVars } from './circle-vars';
import { GET_Service } from '../../../api/get.service';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../../auth/_services/alert.service';
import { AlertComponent } from '../../../../auth/_directives/alert.component';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PagerService } from '../../admin/job/shared/pager/pager.component';
import { ChangeDetectorRef } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { stringify } from '@angular/core/src/render3/util';
import { templateJitUrl } from '@angular/compiler';
import { notifierCustomConfigFactory } from 'angular-notifier/src/notifier.module';
import { Console } from '@angular/core/src/console';


@Component({
    selector: 'app-u-circle',
    templateUrl: './circle.component.html',
    styleUrls: ['./circle.component.css']
    //encapsulation: ViewEncapsulation.None,
})

@Injectable()
export class UserCircleComponent implements OnInit {

    APIsearchCircle = CircleVars.APIsearchCircle;
    APIcircleRecommend = CircleVars.APIcircleRecommend;
    APIcirclePending = CircleVars.APIcirclePending;
    APIcircleAll = CircleVars.APIcircleAll;
    APIgetProfile = CircleVars.APIgetProfile;
    APIacceptFriend = CircleVars.APIacceptFriend;
    APIsendRequestFr = CircleVars.APIsendRequestFr;
    APIrejectFriend = CircleVars.APIrejectFriend;
    APIendorseSkillset = CircleVars.APIendorseSkillset;
    APIDeendorseSkillset = CircleVars.APIDeendorseSkillset;
    APIallFriend = CircleVars.APIallFriend;
    APIremoveFriend = CircleVars.APIremoveFriend;
    APIuserProfile = CircleVars.APIuserProfile;
    APIListfriendEndorse = CircleVars.APIListfriendEndorse;
    APIgetPersonalDetail = CircleVars.APIgetPersonalDetail;
    APIContactFriend = CircleVars.APIContactFriend;

    imgAPIUrl = GlobalVariable.BASE_API_URL + '/get/image';
    apiKey = GlobalVariable.API_KEY;

    btnEndorse = CircleVars.btnEndorse;
    btnDeEndorse = CircleVars.btnDeEndorse;
    display = 'none';

    name: string = '';
    accfriend: string = '';
    reqfriend: string = '';
    rejfriend: string = '';
    staffno: string = '';
    skillno: number;
    results: boolean;
    myName: string;
    data: any = {};
    circleInfo: {};
    addNewForm: FormGroup;
    loadingData = false;
    loadingDataSearch = false;
    displayTbl = false;
    displayProfile = false;
    userSkill: string = '';
    msg = '';
    status: number;
    endorseSkillset: string = '';
    btnDisplay = false;
    btnLoading: boolean;
    chgBtnEnd: boolean;
    chgBtnDnd: boolean;
    listNameDisplay = true;
    searchNameDisplay = true;
    show: boolean = true;
    displayName: any = true;
    loading = false;
    loadEndorse = false;
    isOpen = false;



    constructor(
        //private pagerService: PagerService,
        private activeRoute: ActivatedRoute,
        private routers: Router,
        private _script: ScriptLoaderService,
        private _GET_api_Service: GET_Service,
        private _POST_api_Service: POST_Service,
        //notifierService: NotifierService,
        private cd: ChangeDetectorRef,
    ) {
        this.getRecFriend();
        this.getPendFriend();
        this.getAllFriend();
        this.getContact();
        this.activeRoute.params.subscribe(params => {
            this.selUser = params.friendID;
        });

    }

    ngOnInit() {

        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        // this.loadingData = true;
        this.displayERA = true;
        // this.displayTbl = false;
        this.imgFriendArrList = this.getImgCir();
        this.apiKeyFriendArrList = this.getApikey();

        // this.recommendedList();

    }

    // to get recommended list on right side
    recommendedList() {
        this.loadFriend = true;
        this.isOpen = false;
        this.displayTbl = true;
        this.displayERA = false;
        this.getEndorseFriend = false;
        this.loadCirclefriend = false;

        this._GET_api_Service.GET_data(this.APIcircleRecommend).subscribe(data => {
            this.optFriendList = data.body;
            this.displayTbl = true;
            this.loadingData = false;
            // this.loadFriend = true;

            for (let j = 0; j < data.body.length; j++) {

                this.recTemp.push(
                    {
                        friendID: data.body[j].friendID,
                        friendName: data.body[j].friendName,
                        mutualFriendsNum: data.body[j].mutualFriendsNum,
                        peopleImage: data.body[j].peopleImage,
                        peoplePosition: data.body[j].peoplePosition,
                        peopleStatus: data.body[j].peopleStatus,
                        showLoading: false,
                    }
                )

            }

        },
            error => {
                console.log('[ERROR - Get Recommended List] ' + error);

            }
        );
    }

    // to get profile to view on right side
    profileArr = []
    getProfile(id) {

        this._POST_api_Service.POST_data(CircleVars.APIgetProfile, { friendID: id }).subscribe(res => {

            console.log(res)
            if (res.body) this.profileArr = res.body;
            console.log(this.profileArr)

        }, error => {
            console.log('[ERROR] user not found ' + error)
        })

    }

    //Begin Search Name
    searchData = false;

    onNameKeyUp(event: any) {
        this.name = event.target.value;
        this.results = false;

        if (this.name.length > 1) {
            this.searchUser(this.name);
            this.loadingDataSearch = true;

        }
    }

    body: any = [];
    dataSearch: any = {};
    newData: any = [];

    searchUser(name) {
        let data = {
            searchName: name
        }

        this.loadFriend = false;
        let searchUserSend = this._POST_api_Service.POST_data(this.APIsearchCircle, data);
        let ret = searchUserSend.subscribe(dataRes => {
            this.newData = dataRes.body;
            this.results = false;
            this.isOpen = true;
            this.loadFriend = false;
            this.loadingDataSearch = false;
            this.loadCirclefriend = false;
            // this.displayTbl = true;
            this.getEndorseFriend = false;
            this.loadingEndorseFr = false;

            if (this.dataSearch.body) {
                if (this.dataSearch.results.length > 10) {
                    this.body = this.dataSearch.results.slice(0, 10);

                }
                else {
                    this.body = this.dataSearch.results;
                }
            }
        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            })
    }
    //End Search Name


    getImgCir() {
        let url = GlobalVariable.BASE_API_URL + CircleVars.APIGetImg;
        return url;
    }

    getApikey() {
        let apikey = GlobalVariable.API_KEY;
        return apikey;
    }


    //Begin List of Recommended friend

    optFriendList = Array<recFriendArr>();
    loadFriend = false;
    recTemp = [];

    getRecFriend() {
        // this.loadingData = true;
        this.loadFriend = true;
        this.isOpen = false;
        this.displayTbl = true;
        this.displayERA = false;
        this.getEndorseFriend = false;
        this.loadCirclefriend = false;

        this._GET_api_Service.GET_data(this.APIcircleRecommend).subscribe(data => {
            this.optFriendList = data.body;
            this.displayTbl = true;
            this.loadingData = false;
            // this.loadFriend = true;

            for (let j = 0; j < data.body.length; j++) {

                this.recTemp.push(
                    {
                        friendID: data.body[j].friendID,
                        friendName: data.body[j].friendName,
                        mutualFriendsNum: data.body[j].mutualFriendsNum,
                        peopleImage: data.body[j].peopleImage,
                        peoplePosition: data.body[j].peoplePosition,
                        peopleStatus: data.body[j].peopleStatus,
                        showLoading: false,
                    }
                )

            }

        },
            error => {
                console.log('[ERROR - Get Recommended List] ' + error);

            }
        );
    }
    //End List of Recommended friend


    //Begin List of Pending friend

    PendingFriendList = Array<recFriendArr>();
    pendTemp = [];
    pendCount = 0;
    total;
    notify = false;
    counter: string;

    getPendFriend() {

        this.pendTemp = [];
        // this.loadingCircle = false;
        this.loadFriend = true;
        this.isOpen = false;
        this.displayERA = false;
        this.getEndorseFriend = false;
        this.loadCirclefriend = false;

        this._GET_api_Service.GET_data(this.APIcirclePending).subscribe(data => {
            this.PendingFriendList = data.body;
            this.displayTbl = true;

            for (let j = 0; j < data.body.length; j++) {

                this.pendTemp.push(
                    {
                        peopleID: data.body[j].peopleID,
                        people: data.body[j].people,
                        mutualFriendsNum: data.body[j].mutualFriendsNum,
                        peopleImage: data.body[j].peopleImage,
                        peoplePosition: data.body[j].peoplePosition,
                        peopleStatus: data.body[j].peopleStatus,
                        peopleCompany: data.body[j].peopleCompany,
                        showName: false,
                    }
                )
            }

            this.data = this.pendTemp;
            this.total = this.data.length;
            this.notify = true;
            this.onSelect(this.selUser, this.userDetail);
            this.loadingData = false;
            // this.loadFriend = false;   

        },
            error => {
                console.log('[ERROR - Get Pending List] ' + error);

            }
        );
    }
    //End List of Pending friend


    //Begin List of all friend

    friendTemp = [];
    AllFriendList = Array<allfriendArr>();

    getAllFriend() {

        // this.loadingCircle = false;
        this.loadFriend = true;
        this.isOpen = false;
        this.displayERA = false;
        this.getEndorseFriend = false;
        this.loadCirclefriend = false;

        this._GET_api_Service.GET_data(this.APIcircleAll).subscribe(data => {
            this.AllFriendList = data.body;
            this.loadingData = false;
            this.displayTbl = true;
            // this.loadFriend = false;

            for (let j = 0; j < data.body.length; j++) {

                this.friendTemp.push(
                    {
                        friendID: data.body[j].friendID,
                        friendName: data.body[j].friendName,
                        mutualFriendsNum: data.body[j].mutualFriendsNum,
                        peopleImage: data.body[j].peopleImage,
                        peoplePosition: data.body[j].peoplePosition,
                        peopleStatus: data.body[j].peopleStatus,
                        showName: false,
                    }
                )
            }
        },
            error => {
                console.log('[ERROR - Get list of all friend] ' + error);
            }
        );
    }
    //End List of all friend

     //Begin Contact friend

     contactTemp = [];
     contactList = Array<allfriendArr>();
 
     getContact() {
 
         this.loadFriend = true;
         this.isOpen = false;
         this.displayERA = false;
         this.getEndorseFriend = false;
         this.loadCirclefriend = false;
 
         this._GET_api_Service.GET_data(this.APIContactFriend).subscribe(data => {
             this.contactList = data.body;
             this.loadingData = false;
             this.displayTbl = true;
 
             for (let j = 0; j < data.body.length; j++) {
 
                 this.contactTemp.push(
                     {
                         friendID: data.body[j].friendID,
                         friendName: data.body[j].friendName,
                         mutualFriendsNum: data.body[j].mutualFriendsNum,
                         peopleImage: data.body[j].peopleImage,
                         peoplePosition: data.body[j].peoplePosition,
                         peopleStatus: data.body[j].peopleStatus,
                         showName: false,
                     }
                 )
             }
         },
             error => {
                 console.log('[ERROR - Get list of all friend] ' + error);
             }
         );
     }
     //End List of all friend


    //Begin all of circle friends

    selCircleID: any = {};
    circleList: any = [];
    loadCirclefriend = false;
    loadingCircle = false;

    postCircleFriend(selCircleID) {
        let data = {
            friendID: selCircleID
        }

        this.loadingCircle = true;
        this.loadCirclefriend = false;
        this.loadingEndorseFr = false;
        this.loadFriend = false;

        let circleFriendSend = this._POST_api_Service.POST_data(this.APIallFriend, data);
        let postCircleDetail = circleFriendSend.subscribe(dataRes => {

            this.circleList = dataRes.body;
            this.displayTbl = true;
            this.loadCirclefriend = true;
            this.loadFriend = false;
            this.loadingData = false;
            this.loadingCircle = false;
            this.isOpen = false;
            this.getEndorseFriend = false;

        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            })
    }
    //End all of circle friends


    // profileName 
    skillList = Array<profileInfoArr>();
    interestList = Array<profileInfoArr>();
    profileList = Array<profileInfoArr>();
    careerUser: any = {};
    expList = Array<profileInfoArr>();
    eduList = Array<profileInfoArr>();
    expPrevList = Array<profileInfoArr>();
    profCertList = Array<profileInfoArr>();
    awardList = Array<profileInfoArr>();

    selUser: any = {};
    userDetail: any = {};
    endorsement: string[];
    btnshowEndorse: string;
    temp = [];
    // displayCareer : boolean;

    onSelect(user, userDetail) {
        this.selUser = user;
        this.userDetail = userDetail;

        let data = {
            friendID: user,
            friendName: userDetail,
            staffNo: user
        }

        this.temp = [];
        this.loadingData = true;
        this.displayTbl = false;
        let count = 0;

        let profileUserSend = this._POST_api_Service.POST_data(this.APIgetProfile, data);
        let getInfoDetail = profileUserSend.subscribe(dataRes => {
            this.profileList = dataRes.body;
            this.skillList = dataRes.body[0].skills;
            this.interestList = dataRes.body[0].interest;

            for (let i = 0; i < dataRes.body[0].skills.length; i++) {

                this.temp.push(
                    {
                        name: dataRes.body[0].skills[i].name,
                        id: dataRes.body[0].skills[i].id,
                        endorse_point: dataRes.body[0].skills[i].endorse_point,
                        point: dataRes.body[0].skills[i].point,
                        endorse: dataRes.body[0].skills[i].endorse,
                        isLoading: false,
                    }
                )

            }
            count++;

            if (count == 2) {
                this.loadingData = false;
                this.displayTbl = true;
                this.displayERA = false;

            }

        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            })

        let CareerUserSend = this._POST_api_Service.POST_data(this.APIuserProfile, data);
        let getCareerDetail = CareerUserSend.subscribe(dataRes => {
            this.expList = dataRes.career.exprience;
            this.eduList = dataRes.career.education;
            this.expPrevList = dataRes.career.previous;
            this.profCertList = dataRes.career.profCert;
            this.awardList = dataRes.career.award;

            count++;
            if (count == 2) {
                this.loadingData = false;
                this.displayTbl = true;
                this.displayERA = false;

            }
            // this.displayCareer = true;

        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            })
    }

    //Routing staffno
    staffDetail(user, userDetail) {
        this.selUser = user;
        this.userDetail = userDetail;

        let data = {
            friendID: user,
            friendName: userDetail,
            staffNo: user
        }
        this.routers.navigate(['/circle', user]);
        this.temp = [];
        this.loadingData = true;
        this.displayTbl = false;
        let count = 0;

        let profileUserSend = this._POST_api_Service.POST_data(this.APIgetProfile, data);
        let getInfoDetail = profileUserSend.subscribe(dataRes => {
            this.profileList = dataRes.body;
            this.skillList = dataRes.body[0].skills;
            this.interestList = dataRes.body[0].interest;

            for (let i = 0; i < dataRes.body[0].skills.length; i++) {

                this.temp.push(
                    {
                        name: dataRes.body[0].skills[i].name,
                        id: dataRes.body[0].skills[i].id,
                        endorse_point: dataRes.body[0].skills[i].endorse_point,
                        point: dataRes.body[0].skills[i].point,
                        endorse: dataRes.body[0].skills[i].endorse,
                        isLoading: false,
                    }
                )

            }
            count++;

            if (count == 2) {
                this.loadingData = false;
                this.displayTbl = true;
                this.displayERA = false;

            }

        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            })
        let CareerUserSend = this._POST_api_Service.POST_data(this.APIuserProfile, data);
        let getCareerDetail = CareerUserSend.subscribe(dataRes => {
            this.expList = dataRes.career.exprience;
            this.eduList = dataRes.career.education;
            this.expPrevList = dataRes.career.previous;
            this.profCertList = dataRes.career.profCert;
            this.awardList = dataRes.career.award;

            count++;
            if (count == 2) {
                this.loadingData = false;
                this.displayTbl = true;
                this.displayERA = false;

            }
            // this.displayCareer = true;

        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            })

    }

    //Begin Endorsement list friends

    selFriendID: any = {};
    selSkillID: any = {};
    selSkillName: any = {};
    endorseFrList: any = [];
    loadingEndorseFr = false;
    getEndorseFriend = false;

    postEndorseFriend(endFriendID, endSkillID, endSkillName) {
        this.selFriendID = endFriendID;
        this.selSkillID = endSkillID;
        this.selSkillName = endSkillName;

        let data = {
            friendID: endFriendID,
            skillID: endSkillID,
            name: endSkillName
        }

        this.loadingEndorseFr = true;
        this.loadCirclefriend = false;
        this.getEndorseFriend = false;
        this.loadingCircle = false;

        let endorseFriendSend = this._POST_api_Service.POST_data(this.APIListfriendEndorse, data);
        let postEndorseDetail = endorseFriendSend.subscribe(dataRes => {

            this.endorseFrList = dataRes.body;
            this.displayTbl = true;
            this.loadFriend = false;
            this.loadingData = false;
            this.loadingEndorseFr = false;
            this.getEndorseFriend = true;
            this.isOpen = false;

        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            })
    }
    //End Endorsement list friends

    //Accept follow friend
    followList = Array<profileInfoArr>();
    sendAcceptUser: any = {};
    acceptLoading = false;

    selectAccept(accfriend) {

        this.sendAcceptUser = accfriend;
        let data = {
            friendID: accfriend
        }
        this.loadingData = true;
        this.displayTbl = false;
        this.acceptLoading = true;

        let followSend = this._POST_api_Service.POST_data(this.APIacceptFriend, data);
        let getInfoDetail = followSend.subscribe(dataRes => {
            this.followList = dataRes;
            this.displayTbl = true;
            this.onSelect(this.selUser, this.userDetail);
            this.loadingData = false;
            this.acceptLoading = false;

            if (dataRes.length >= 1) {
                this.notify = true;
            }
            this.getPendFriend();
            this.friendTemp = [];
            this.getAllFriend();

        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            })
    }

    //Sent Request friend
    sendReqUser: any = {};
    reqLoading = false;

    sendRequest(reqfriend) {

        this.sendReqUser = reqfriend;

        let data = {
            friendID: reqfriend
        }
        this.recTemp = [];
        this.contactTemp = [];
        this.loadingData = true;
        this.loadFriend = true;
        this.reqLoading = true;
        this.displayTbl = false;

        let reqFriendSend = this._POST_api_Service.POST_data(this.APIsendRequestFr, data);
        let getInfoDetail = reqFriendSend.subscribe(dataRes => {
            this.followList = dataRes;
            this.getRecFriend();
            this.getContact();
            this.displayTbl = true;
            this.loadFriend = true;
            this.onSelect(this.selUser, this.userDetail);
            this.loadingData = false;
            this.reqLoading = false;

        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            })
    }


    //Sent Request friend Profile
    sendReqProfUser: any = {};
    reqLoadingProfile = false;

    sendRequestProfile(reqfriendProf) {

        this.sendReqProfUser = reqfriendProf;

        let data = {
            friendID: reqfriendProf
        }
        this.recTemp = [];
        this.contactTemp = [];
        this.loadingData = true;
        this.displayTbl = false;
        this.reqLoadingProfile = true;

        let reqFriendSend = this._POST_api_Service.POST_data(this.APIsendRequestFr, data);
        let getInfoDetail = reqFriendSend.subscribe(dataRes => {
            this.followList = dataRes;
            this.getRecFriend();
            this.getContact();
            this.displayTbl = true;
            this.loadFriend = true;
            this.onSelect(this.selUser, this.userDetail);
            this.loadingData = false;
            this.reqLoadingProfile = false;

        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            })
    }




    //Select name
    selUnfollow: any = {};
    selectedFrName(frName) {
        this.selUnfollow = frName;
    }

    //Reject friend list 
    rejectlist = Array<profileInfoArr>();
    rejectUser: any = {};
    rejectLoading = false;

    selectReject() {

        let data = {

            friendID: this.selUnfollow
        }
        this.friendTemp = [];
        this.loadingData = true;
        this.displayTbl = false;
        this.rejectLoading = true;

        let rejectFriendSend = this._POST_api_Service.POST_data(this.APIrejectFriend, data);
        let getInfoDetail = rejectFriendSend.subscribe(dataRes => {
            this.rejectlist = dataRes;
            this.displayTbl = true;
            this.getAllFriend();
            this.loadingData = false;
            this.onSelect(this.selUser, this.userDetail);
            this.rejectLoading = false;
            // this.loadingCircle = false;
        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            })
    }


    //Cancel request
    rejectLoadingProf = false;

    cancelReqProfile() {

        let data = {

            friendID: this.selUnfollow
        }
        this.friendTemp = [];
        this.loadingData = true;
        this.displayTbl = false;
        // this.rejectLoadingProf = true;

        let rejectFriendSend = this._POST_api_Service.POST_data(this.APIrejectFriend, data);
        let getInfoDetail = rejectFriendSend.subscribe(dataRes => {
            this.rejectlist = dataRes;
            this.displayTbl = true;
            this.getAllFriend();
            this.loadingData = false;
            this.onSelect(this.selUser, this.userDetail);
            this.rejectLoadingProf = false;
            // this.loadFriend = true;
        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            })
    }




    //Reject Pending friend
    //Select name
    selRejectPend: any = {};
    selectedPendName(rejName) {
        this.selRejectPend = rejName;
    }

    rejectPendlist = Array<profileInfoArr>();
    rejPenLoading = false;

    RejectPending() {

        let data = {

            friendID: this.selRejectPend
        }

        this.loadingData = true;
        this.displayTbl = false;
        this.rejPenLoading = true;

        let rejectFriendSend = this._POST_api_Service.POST_data(this.APIrejectFriend, data);
        let getInfoDetail = rejectFriendSend.subscribe(dataRes => {
            this.rejectPendlist = dataRes;
            this.displayTbl = true;
            this.onSelect(this.selUser, this.userDetail);
            this.loadingData = false;
            this.rejPenLoading = false;

            if (dataRes.length >= 1) {
                this.notify = true;
            }
            this.getPendFriend();

        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            })
    }


    //Remove Recomended friend
    removelist = Array<profileInfoArr>();
    removeUser: any = {};
    remLoading = false;

    selectRemove(removefr) {
        this.removeUser = removefr;

        let data = {

            friendID: removefr,
        }

        this.recTemp = [];
        this.contactTemp = [];
        this.loadingData = true;
        this.displayTbl = false;
        this.remLoading = true;

        let removeFriendSend = this._POST_api_Service.POST_data(this.APIremoveFriend, data);
        let getInfoDetail = removeFriendSend.subscribe(dataRes => {
            this.removelist = dataRes.body;
            this.displayTbl = true;
            this.getRecFriend();
            this.getContact();
            this.loadingData = false;
            this.remLoading = false;

        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            })
    }


    //Endorse skillset
    endorsestyle: string;
    endorseList = Array<profileInfoArr>();
    endorseUser: any = {};
    skillUser: any = {};
    showbtn: boolean = false;
    showbtnDe: boolean = false;
    deEndorseList = Array<profileInfoArr>();
    deendorseUser: any = {};
    deskillUser: any = {};
    addpoint: number;

    selectEndorse(staffno, skillno, index, countpoint): void {

        this.endorseUser = staffno;
        this.skillUser = skillno;
        this.addpoint = countpoint;


        let data = {

            friendID: staffno,
            skillID: skillno,
            endorse_point: countpoint

        }
        for (let i = 0; i < this.temp.length; i++) {
            if (i === index) {
                this.temp[i].isLoading = true;
            }
        }

        let endorseFriendSend = this._POST_api_Service.POST_data(this.APIendorseSkillset, data);
        let sendEndorse = endorseFriendSend.subscribe(dataRes => {
            this.endorseList = dataRes;

            this.onSelect(this.selUser, this.userDetail);

            for (let i = 0; i < this.temp.length; i++) {
                if (i === index) {
                    this.temp[i].isLoading = false;
                    console.log('this.temp', this.temp);
                }

            }

            console.log(data);
        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            })
    }

    //De endorse skillset
    selectDeEndorse(staffno, skillno, index, countpoint): void {
        this.deendorseUser = staffno;
        this.deskillUser = skillno;
        this.addpoint = countpoint;

        let data = {
            friendID: staffno,
            skillID: skillno,
            endorse_point: countpoint
        }
        for (let i = 0; i < this.temp.length; i++) {
            if (i === index) {
                this.temp[i].isLoading = true;
            }
        }
        let deEndorseFriendSend = this._POST_api_Service.POST_data(this.APIDeendorseSkillset, data);
        let sendDEEndorse = deEndorseFriendSend.subscribe(dataRes => {
            this.deEndorseList = dataRes;
            this.onSelect(this.selUser, this.userDetail);

            for (let i = 0; i < this.temp.length; i++) {
                if (i === index) {
                    this.temp[i].isLoading = false;
                }
            }
            console.log(data);
        },
            error => {
                console.log('[ERROR + User Not Found]', error);
            })
    }

    // display Follow friends table

    displayFollowfr() {

        this.loadFriend = true;
        this.isOpen = false;
        this.displayTbl = true;
        this.loadCirclefriend = false;
        this.getEndorseFriend = false;
    }

    imgFriendArrList: any;
    apiKeyFriendArrList: any;
    currentUser: any;
    displayERA = false;

}

