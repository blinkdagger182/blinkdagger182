import { ComponentFactoryResolver, Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from '../../../../../auth/_services/alert.service';
import { Http,HttpModule, Response } from '@angular/http';
import { GlobalVariable } from "../../../../../../environments/environment";
//import { GlobalVariable } from '../../../../../../../ghcm-global';
import { InfoVars } from './job-info-vars';
import { JobsVars } from '../user-job-vars';
import { EnLang, MyLang } from '../language/language-vars';
import { Location } from '@angular/common'

import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
@Component({
    selector: 'job-info',
    templateUrl: './job-info.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./job-info.component.css']
})

export class JobInfoComponent implements OnInit {
    jobId;
    jobInfoLoading = true;
    jobInfoArr: any;
    leadLevel: boolean;
    isReview: boolean;

    jProfile; jDescription; jAoR; jRequire; jSuccess; jDigital; jFunctional; jTechnical; jQualification;

    constructor(
        private http: Http, private _location : Location,
        private _GET_api_Service: GET_Service, private _POST_api_Service: POST_Service,
        private activeRoute: ActivatedRoute, private _router: Router,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver
    ) {
        this.activeRoute.params.subscribe( params => {
            this.jobId = params.id1;

            if(params.id2){
                this.isReview = true;
            }
            else
                this.isReview = false;

        });   
    }

    superior: any;
    msg;
    title;
    lobName;
    jobTotalAPI = JobsVars.jobTotalAPI;
    lobsArray; 
    // returnUrlId;
    applied; appliedStatusID;

    enChecked : boolean = true;
    word: any;
    nePromo = false;
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

        // this.returnUrlId = localStorage.getItem('returnLobID');

        let jobProfileAPI = InfoVars.jobProfileAPI;
        let jobAppAPI = InfoVars.jobAppAPI;
        let jobAppStatusAPI = InfoVars.jobAppStatusAPI;

        let postData = { id : this.jobId };

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

        let superiorInfoAPI  = InfoVars.superiorInfoAPI;
        this._GET_api_Service.GET_data(superiorInfoAPI).subscribe(data => {
            this.superior = data[0].Rept_To_Name;
        },
        error => {
            console.log("Couldn't get superior info" + error);
        });
                 
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
    loading = false;
    jobApplyClicked(job_id){
        
        this.loading = true;
        let postApi = InfoVars.jobApplyAPI;
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

    btnBackClick(){
        this._location.back();
        // this._router.navigate(['/user-job/select-job', this.returnUrlId]);   
    }

}
