import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BlankVars } from '../default/blank/blank-vars';
import { POST_Service } from '../../../api/post.service';
import { NotifierService } from 'angular-notifier';


@Component({
    selector: 'app-ask-us',
    templateUrl: './ask-us.component.html',
    styleUrls: ['../default/blank/default.css', './ask-us.component.css'],
})

export class AskUsComponent implements OnInit {

    feedbackForm: FormGroup;

    feedbackTmMoveAPI = BlankVars.feedBackTmMove;
    feedbackAPI = BlankVars.feedBack;

    feedbackCat = ['Technical'];
    scShots = '';
    notifyMsg: string;
    imgFiles;

    private readonly notifier: NotifierService;

    constructor(
        private _POST_api_Service: POST_Service,
        notifierService: NotifierService,
    ) {
        this.notifier = notifierService;
     }

    ngOnInit() {

        this.feedbackForm = new FormGroup({
            fbCat: new FormControl(['Technical'], Validators.required),
            fbTitle: new FormControl(null, Validators.required),
            fbMsg: new FormControl(null, Validators.required),
        });

    }

    public resetfeedbackForm() {
        this.feedbackForm = null;
        this.feedbackForm = new FormGroup({
            fbCat: new FormControl(['Technical'], Validators.required),
            fbTitle: new FormControl(null, Validators.required),
            fbMsg: new FormControl(null, Validators.required),
        });
    }

    feedbackFormSubmit() {

        let postApiCat = this.feedbackForm.get('fbCat').value
        let postApi = '';

        if (postApiCat == 'TM Mobility Center') postApi = this.feedbackTmMoveAPI; 
        else postApi = this.feedbackAPI; 

        let dataPost: any = {
            newFeedbackTitle: this.feedbackForm.get('fbTitle').value,
            newFeedbackDescription: this.feedbackForm.get('fbMsg').value,
        };

        let datafbPos: any = {};
        let askUsID;

        this._POST_api_Service.POST_data(postApi, dataPost).subscribe(datafbRes => {

            const wait = ms => new Promise(resolve => setTimeout(resolve, ms)); 
            askUsID = datafbRes.feedbackID;
            let api = BlankVars.scShotAPI;
            let emailAPI = BlankVars.emailAPI;
            datafbPos = datafbRes;
            if (datafbPos.results) {
                if (this.imgFiles && this.imgFiles.length !== 0) {
                    let length = (this.imgFiles.length < 3) ? this.imgFiles.length : 3;
                    for (let i=0; i < length; i++) this.postScreenShots(askUsID,i,api);
                }
                
                setTimeout(function() {
                    this.fbShowMsg = false;
                }.bind(this), 4000); //wait 4 Seconds and hide

                wait(4*1000).then(() => this.postInsEmailAskUs(askUsID, emailAPI)); 


                this.notifyMsg = BlankVars.fdbckSuccess;
                this.notifier.notify('success', this.notifyMsg);
            } else {
                this.notifyMsg = BlankVars.fbbckFail;
                this.notifier.notify('error', this.notifyMsg);
            }
            this.resetfeedbackForm();
        })
    }

    postScreenShots(askUsID,ssIndex, api){
        
        let form_Data = new FormData();
        form_Data.append('askusImg', this.imgFiles[ssIndex], this.imgFiles[ssIndex].name.toLowerCase());
        form_Data.append('feedbackID', askUsID);

        this._POST_api_Service.POST_ScreenShot(api, form_Data).subscribe(res => {

            this.scShots = '';
            this.imgFiles = [];

        }, err=>{
            this.scShots = '';
            this.imgFiles = [];
            this.notifyMsg = "Failed to Upload the Screenshots";
            // this.notifier.notify('error', this.notifyMsg);
        })

    }

    postInsEmailAskUs(askUsID, api){

		let dataInsEmail: any = {
            id: askUsID
        };

        this._POST_api_Service.POST_data( api, dataInsEmail).subscribe(res => {
            
        }, err=>{

            this.notifyMsg = "Failed to Insert email";
            // this.notifier.notify('error', this.notifyMsg);
        })

    }

    addImageTrigger(){
        $('#ssImg').trigger('click'); 
    }

    fileChange(event) {
        
        let fileList: FileList = event.target.files;
        var length = (fileList.length < 3) ? fileList.length :  3;
        
        var imgList = [];
        for(let i=0; i < length; i++){
            imgList[i] = fileList[i];
        }

        this.imgFiles = imgList; 
    }
}


