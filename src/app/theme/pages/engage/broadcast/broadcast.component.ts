import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { Vars } from '../settings-vars';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { StaffId, StaffIdArr } from "./arrCons";
import { GET_Service } from '../../../api/get.service';
import { POST_Service } from '../../../api/post.service';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';

@Component({
    selector: 'app-e-broadcast',
    templateUrl: './broadcast.component.html',
    styleUrls: ['./broadcast-css.css']
})
export class EngageBroadcastComponent implements OnInit {

    loading = true;
    bMTitle = 'Broadcast Message Form';
    msgMax: number; ttlMax: number;
    broadcastMsgForm: FormGroup;
    loadingStaffId = true;
    loadingLobs = true;
    bcShowMsg = false;
    tab = 1;

    constructor(
        private formBuilder: FormBuilder, private _script: ScriptLoaderService, private _POST_api_Service: POST_Service,
        private _GET_api_Service: GET_Service, private route: ActivatedRoute
    ){
        this.getRequestor();
    }

    enAdmin = false; enUser = false;
    ngOnInit() {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log(currentUser)

        if(currentUser.engagement_role === '2'){
            this.enUser = true;
        }
                
        else {
            this.enAdmin = true;
        }
          
        this.loading = false;
        this.msgMax = 256;
        this.ttlMax = 99;

        this.getLobList();

        this.broadcastMsgForm = new FormGroup({
            bcStaffId: new FormControl(),//minLength(2)),
            bcTitle: new FormControl(null, Validators.required),//minLength(2)),
            bcMsg: new FormControl(null, Validators.required),//minLength(2)),
            bcLob: new FormControl(),
            // bcUrl: new FormControl(),
            bcType: new FormControl(),
            // bcClass: new FormControl(),
        });

        this.broadcastMsgForm.setValue({
            bcStaffId: "",
            bcTitle: "",
            bcMsg: "",
            bcLob: "",
            // bcUrl: "",
            bcType: "default",
            // bcClass: "default",
        });

    };

    ngAfterViewInit() {
        this._script.loadScripts('app-e-broadcast',
            [
                'assets/js/superadmin/submit-alert.js',
            ]);
    }

    bcPostSingle = '/notification/push/single';
    bcPostAll = '/notification/push/broadcast';
    bcByLob = '/notification/push/topic';

    advPosMsg: string;
    advPosStyle: string; advPosIcon: string;
    loadingSubmit = false;
    broadcastMsgFormSubmit(): void {
        this.loadingSubmit = true;
        let postApi: string;
        let dataPost: any = {};
        if(this.broadcastMsgForm.get('bcType').value === 'all') {
            postApi = this.bcPostAll;
            dataPost = {
                notificationTitle: this.broadcastMsgForm.get('bcTitle').value,
                notificationBody: this.broadcastMsgForm.get('bcMsg').value,
                notificationApp: "TeamUp",
                notificationClass: "HappyMeter",
                type: "happymeter"
            }
        }
        
        else if(this.broadcastMsgForm.get('bcType').value === 'single') {
            postApi = this.bcPostSingle;
            let bcStaffIdArr = (this.broadcastMsgForm.get('bcStaffId').value).split(" - ");
            let bcStaffId = bcStaffIdArr[0];
            dataPost = {
                targetUser: bcStaffId, 
                notificationTitle: this.broadcastMsgForm.get('bcTitle').value,
                notificationBody: this.broadcastMsgForm.get('bcMsg').value,
                notificationApp: "TeamUp",
                notificationClass: "HappyMeter",
                type: "happymeter",
            }
        }
        else if(this.broadcastMsgForm.get('bcType').value === 'lob'){
            postApi = this.bcByLob;
            
            dataPost = {
                topic: 'LOB-' +  this.broadcastMsgForm.get('bcLob').value,
                notificationTitle: this.broadcastMsgForm.get('bcTitle').value,
                notificationBody: this.broadcastMsgForm.get('bcMsg').value,
                notificationApp: "TeamUp",
                notificationClass: "HappyMeter",
                type: "happymeter",
            }  
        }

        let updQuaSend = this._POST_api_Service.POST_data(postApi, dataPost);
        let dataAdvPos: any = {};
        let ret = updQuaSend.subscribe(dataQuaRes => {
            dataAdvPos = dataQuaRes;
            if (dataAdvPos.results) {
                this.advPosMsg = 'Successfully Broadcast Message';
                this.advPosStyle = ' alert-success '; this.advPosIcon = ' flaticon-paper-plane ';
                this.bcShowMsg = true;
                setTimeout(function() {
                    this.bcShowMsg = false;
                }.bind(this), 3000); //wait 3 Seconds and hide
            } else {
                this.advPosMsg = 'Fail to Broadcast Message';
                this.advPosStyle = ' alert-danger  '; this.advPosIcon = ' flaticon-circle ';
                this.bcShowMsg = true;
                setTimeout(function() {
                    this.bcShowMsg = false;
                }.bind(this), 3000); //wait 3 Seconds and hide
            }
            this.broadcastMsgForm.setValue({
                bcStaffId: "",
                bcTitle: "",
                bcMsg: "",
                bcLob: "",
                // bcUrl: "",
                bcType: "default",
                // bcClass: "default",
            });
            this.loadingSubmit = false;
        },
            error => {
                console.log('[ERROR] Broadcast Message: ' + error);
                this.bcShowMsg = true;
                this.advPosMsg = 'Fail to Broadcast Message.'
                this.advPosStyle = " alert-danger "; this.loadingSubmit = false;
                setTimeout(function() {
                    this.bcShowMsg = false;
                }.bind(this), 3000); //wait 3 Seconds and hide
            })
    }

    lobList = []; getLOBAPI = '/jobAdv/jobProfile/lob';
    getLobList() {
        if (this.enAdmin){
            this._GET_api_Service.GET_data(this.getLOBAPI).subscribe(data => {
                for (let i = 0; i < data.length; i++) {
                    this.lobList.push(data[i].lob);
                }
                this.loadingLobs = false;
            },
                error => {
                     console.log('[ERROR - Get Lob List] ' + error)
                    this.loadingLobs = true;
                }
            );

        }

        else if (this.enUser){
            
            let trackFilterAPI = '/engagement/tracking/filter';
            this._GET_api_Service.GET_data( trackFilterAPI ).subscribe(res => {

                for (let i = 0; i < res.filter.lob.length; i++) {
                    this.lobList.push(res.filter.lob[i].lob);
                }
                this.loadingLobs = false;
            }, error => {
                console.log('[ERROR - Fail to get tracking filters] ' + error);
                this.loadingLobs = true;
            }) 

        }
        
    }

    bcStaffIdListAPI = '/user/notification/list';
    optReq: StaffId = new StaffId();
    optReqList = Array<StaffIdArr>();
    optReqList2 = [];
    getRequestor() {
        
        let comClusterListSend = this._GET_api_Service.GET_data(this.bcStaffIdListAPI);
        this._GET_api_Service.GET_data(this.bcStaffIdListAPI).subscribe(data => {
            this.loadingStaffId = false;
            for (let i = 0; i < data.length; i++) {
                this.optReqList2.push(data[i].Staff_No + " - " + data[i].Name);
            }
        },error => {
                 console.log('[ERROR - Get Broadcast Staff Id List] ' + error)
                this.loadingStaffId = true;
            }
        );

    }

    single = false;
    lob = false;
    typeChange(){
        if(this.broadcastMsgForm.get('bcType').value === 'single'){
            this.single = true;
            this.lob = false;
        } 
        else if(this.broadcastMsgForm.get('bcType').value === 'lob'){
            this.lob = true;
            this.single = false;
        }
        else {
            this.single = false;         
            this.lob = false;   
        }
    }
}
