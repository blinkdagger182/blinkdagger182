import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Vars } from '../settings-vars';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { StaffId, StaffIdArr } from "./arrCons";
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';

@Component({
    selector: 'app-broadcast-message-career-component',
    templateUrl: './broadcast-message-career.component.html',
    styleUrls: ['../settings-css.css']
})
export class StgBroadcastMessageCareerComponent implements OnInit {
    title1 = Vars.title1; broadcastMsg = Vars.broadcastMsg;
    loading = true;
    bMTitle = 'Broadcast Message Form';
    msgMax: number; ttlMax: number;
    broadcastMsgForm: FormGroup;
    loadingStaffId = true;
    bcShowMsg = false;
    tab = 1;
    constructor(
        private formBuilder: FormBuilder, private _script: ScriptLoaderService, private _POST_api_Service: POST_Service,
        private _GET_api_Service: GET_Service, private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.loading = false;
        this.msgMax = Vars.broadcastMsgMax;
        this.ttlMax = Vars.broadcastTtlMax;

        this.broadcastMsgForm = new FormGroup({
            bcStaffId: new FormControl(),//minLength(2)),
            bcTitle: new FormControl(null, Validators.required),//minLength(2)),
            bcMsg: new FormControl(null, Validators.required),//minLength(2)),
            bcLob: new FormControl(),
            bcUrl: new FormControl(),
            bcType: new FormControl(),
            bcClass: new FormControl(),
        });

        this.broadcastMsgForm.setValue({
            bcStaffId: "",
            bcTitle: "",
            bcMsg: "",
            bcLob: "",
            bcUrl: "https://",
            bcType: "default",
            bcClass: "default",
        });
    }

    ngAfterViewInit() {
        this._script.loadScripts('app-broadcast-message-career-component',
            [
                'assets/js/superadmin/submit-alert.js',
            ]);
    }

    bcPostSingleC = Vars.bcPostSingleC;  
    bcPostAllC = Vars.bcPostAllC;
    bcPostTopicC = Vars.bcPostTopicC;

    advPosMsg: string;
    advPosStyle: string; advPosIcon: string;
    loadingSubmit = false;
    broadcastMsgFormSubmit(): void {
        this.loadingSubmit = true;
        let postApi: string;
        let dataPost: any = {};
        
        if(this.broadcastMsgForm.get('bcType').value === 'all' && this.broadcastMsgForm.get('bcClass').value === 'normal'){
            postApi = this.bcPostAllC;
            dataPost = {
                title: this.broadcastMsgForm.get('bcTitle').value,
                description: this.broadcastMsgForm.get('bcMsg').value,
            }     
        }
        else if(this.broadcastMsgForm.get('bcType').value === 'all' && this.broadcastMsgForm.get('bcClass').value === 'url') {
            postApi = this.bcPostAllC;
            dataPost = {
                class: "Url",
                category: this.broadcastMsgForm.get('bcUrl').value,
                title: this.broadcastMsgForm.get('bcTitle').value,
                description: this.broadcastMsgForm.get('bcMsg').value,
                image_url: "",
                // type: "video",
            }
        }
        // else if(this.broadcastMsgForm.get('bcType').value === 'all' && this.broadcastMsgForm.get('bcClass').value === 'happymeter') {
        //     postApi = this.bcPostAll;
        //     dataPost = {
        //         notificationTitle: this.broadcastMsgForm.get('bcTitle').value,
        //         notificationBody: this.broadcastMsgForm.get('bcMsg').value,
        //         notificationApp: "TeamUp",
        //         notificationClass: "HappyMeter",
        //         type: "happymeter"
        //     }
        // }
        else if(this.broadcastMsgForm.get('bcType').value === 'single' && this.broadcastMsgForm.get('bcClass').value === 'normal') {
            postApi = this.bcPostSingleC;
            let bcStaffIdArr = (this.broadcastMsgForm.get('bcStaffId').value).split(" - ");
            let bcStaffId = bcStaffIdArr[0];
            dataPost = {
                target: bcStaffId, 
                title: this.broadcastMsgForm.get('bcTitle').value,
                description: this.broadcastMsgForm.get('bcMsg').value,
            }
        }
        else if(this.broadcastMsgForm.get('bcType').value === 'single' && this.broadcastMsgForm.get('bcClass').value === 'url') {
            postApi = this.bcPostSingleC;
            let bcStaffIdArr = (this.broadcastMsgForm.get('bcStaffId').value).split(" - ");
            let bcStaffId = bcStaffIdArr[0];
            dataPost = {
                target: bcStaffId, 
                class: "Url",
                notificationCategory: this.broadcastMsgForm.get('bcUrl').value,
                title: this.broadcastMsgForm.get('bcTitle').value,
                description: this.broadcastMsgForm.get('bcMsg').value,
                image_url: "",
                // type: "video",
            }
        }
        // else if(this.broadcastMsgForm.get('bcType').value === 'single' && this.broadcastMsgForm.get('bcClass').value === 'happymeter') {
        //     postApi = this.bcPostSingle;
        //     let bcStaffIdArr = (this.broadcastMsgForm.get('bcStaffId').value).split(" - ");
        //     let bcStaffId = bcStaffIdArr[0];
        //     dataPost = {
        //         targetUser: bcStaffId, 
        //         notificationTitle: this.broadcastMsgForm.get('bcTitle').value,
        //         notificationBody: this.broadcastMsgForm.get('bcMsg').value,
        //         notificationApp: "TeamUp",
        //         notificationClass: "HappyMeter",
        //         type: "happymeter",
        //     }
        // }
        // else if(this.broadcastMsgForm.get('bcType').value === 'lob' && this.broadcastMsgForm.get('bcClass').value === 'normal'){
        //     postApi = this.bcByLob;
        //     dataPost = {
        //         topic: 'LOB-' +  this.broadcastMsgForm.get('bcLob').value,
        //         notificationTitle: this.broadcastMsgForm.get('bcTitle').value,
        //         notificationBody: this.broadcastMsgForm.get('bcMsg').value,
        //         shouldAddName: false, 
        //         notificationApp: 'TeamUp',
        //         notificationClass: 'Wish',
        //     }    
        // }
        // else if(this.broadcastMsgForm.get('bcType').value === 'lob' && this.broadcastMsgForm.get('bcClass').value === 'url'){
        //     postApi = this.bcByLob;
        //     dataPost = {
        //         topic: 'LOB-' +  this.broadcastMsgForm.get('bcLob').value,
        //         notificationClass: "Url",
        //         notificationCategory: this.broadcastMsgForm.get('bcUrl').value,
        //         notificationTitle: this.broadcastMsgForm.get('bcTitle').value,
        //         notificationBody: this.broadcastMsgForm.get('bcMsg').value,
        //         shouldAddName: false,
        //         image_url: "",
        //         type: "video",
        //         notificationApp: "TeamUp",
        //     }    
        // }
        // else if(this.broadcastMsgForm.get('bcType').value === 'lob' && this.broadcastMsgForm.get('bcClass').value === 'happymeter'){
        //     postApi = this.bcByLob;
        //     dataPost = {
        //         topic: 'LOB-' +  this.broadcastMsgForm.get('bcLob').value,
        //         notificationTitle: this.broadcastMsgForm.get('bcTitle').value,
        //         notificationBody: this.broadcastMsgForm.get('bcMsg').value,
        //         notificationApp: "TeamUp",
        //         notificationClass: "HappyMeter",
        //         type: "happymeter",
        //     }    
        // }
        let updQuaSend = this._POST_api_Service.POST_data(postApi, dataPost);
        let dataAdvPos: any = {};
        
        let ret = updQuaSend.subscribe(dataQuaRes => {
            dataAdvPos = dataQuaRes;
            if (dataAdvPos.status) {
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
                bcUrl: "https://",
                bcType: "default",
                bcClass: "default",
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

    clickTab(type){
        this.tab = type
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

    url = false;
    classChange() {
        if(this.broadcastMsgForm.get('bcClass').value === 'url'){
            this.url = true;
        }
        else {
            this.url = false;
        }
    }
}
