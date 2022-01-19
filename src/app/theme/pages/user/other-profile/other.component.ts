import { Component } from "@angular/core";
import { Http } from '@angular/http';
import { POST_Service } from '../../../api/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { OtherVars } from './other-vars';
import { GlobalVariable } from "../../../../../environments/environment";


@Component({
    selector : 'other-profile',
    templateUrl : './other.component.html',
    styleUrls : ['./other.component.css']
})

export class OtherProfileComponent{

    userID;
    APIgetProfile = OtherVars.APIgetProfile;
    APIcareerProfile = OtherVars.APIcareerProfile;
    imgBaseURL = GlobalVariable.BASE_API_URL + OtherVars.APIGetImg;
    apikey = GlobalVariable.API_KEY;

    constructor(
        private http: Http, private _location : Location,
        private _POST_api_Service: POST_Service,
        private routers: Router, private activeRoute: ActivatedRoute,
    ) {
        this.activeRoute.params.subscribe(params => {
            this.userID = params.idx;
        });
    }

    loading = true;
    userData: any;
    careerData : any;
    userImg : any;
    superiorImg: any
    
    ngOnInit() {
        let data = {
            friendID: this.userID,     
        }

        let data2 = {
            staffNo: this.userID,     
        }

        this._POST_api_Service.POST_data(this.APIgetProfile, data).subscribe(dataRes => {

            this.userData = dataRes.body[0];

            this.userImg = this.imgBaseURL+'/'+this.userData.friendImageUrl+'?api_key='+this.apikey;
            this.superiorImg = this.imgBaseURL+'/'+this.userData.supervisorImage+'?api_key='+this.apikey;

            this._POST_api_Service.POST_data(this.APIcareerProfile, data2).subscribe(resCareer => {
                this.careerData = resCareer.career;
                // console.log(this.careerData);
                this.loading = false; 
            });
            // console.log(this.userData)
        });

    }

    btnBackClick(){
        this._location.back();
    }


    //Sent Request friend Profile
    sendReqProfUser: any = {};
    reqLoadingProfile = false;

    sendRequestProfile(friendID) {

        let api = OtherVars.APIsendRequestFr;

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
        let api = OtherVars.APIrejectFriend;

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
        let api = OtherVars.APIrejectFriend;

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
        let api = OtherVars.APIacceptFriend;

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

        let api = OtherVars.APIrejectFriend;

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

};