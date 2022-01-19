import { ComponentFactoryResolver, Component, OnInit, ViewEncapsulation, Injectable, HostListener } from '@angular/core';
import { GET_Service } from '../../../api/get.service';
import { POST_Service } from '../../../api/post.service';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { pluck, map } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { En, My } from './lang-vars';
import { vrpVars } from './vrp-vars';
import { DatePipe } from '@angular/common'
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { GlobalVariable } from "../../../../../environments/environment";


@Component({
    selector: 'vrp',
    templateUrl: './vrp.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./vrp.component.css']
})


export class vrpComponent implements OnInit {

    constructor(
        private http: Http,
        private _GET_api_Service: GET_Service,
        private _POST_api_Service: POST_Service,
        private router: Router,
        private _script: ScriptLoaderService,
        private datepipe: DatePipe
    ) {}

    applyForm: FormGroup;
    enChecked: boolean = true;
    word: any;
    loading = false;
    currUserId: any;    
    currDate = this.datepipe.transform(new Date(), 'dd-MM-yyyy h:mm a');
    
    currentDate = new Date();
    staff_name: string;
    staff_nic: any;
    staff_no: string; //S50375
    name: any; //Rasid Bin Karim
    age: any; //58.9
    gender: any; //Male

    exit_date_1: any;
    exit_date_1_select: any;
    bonus_1: any; //160000
    loan_1: any; //30000
    
    exit_date_2: any;
    exit_date_2_select: any;
    bonus_2: any; //150000
    loan_2: any; //20000

    exit_date_3: any;
    exit_date_3_select: any;
    bonus_3: any; //140000
    loan_3: any; //10000
    selectedExitDate: any;
    date_apply: Date;
    date_apply_button = 0;

    batchId = 1;   
    checkStatus: any;
    checkStatusText: any;
    err_ic: string;
    formatDateExit = "d MMMM yyyy";
    formatDateExitSelect = "yyyy-MM-dd";

    tncMesraPdfURL: any;
    faqMesraPdfURL: any;
    tncHashes: any;
    faqHashes: any;
    checkForm = 0;
    tncCheck: boolean = false;

    offerList=[];
    showVrp: boolean = false;
    showOfferList: boolean =false;
    
    ngOnInit() {

        this.checkSelectedLang();
        this.checkVrpRole();
        this.checkVrpSession();
        this.checkApplicationStatus();
        this.getBasicInfo();    
        //this.getDateList();    
        this.getOfferList();    
        this.getTnc();
        this.getFaq();
        
        this.applyForm = new FormGroup({
            tnc: new FormControl('', Validators.required),
            ic: new FormControl('', Validators.required),
            selectedPlan: new FormControl('', Validators.required)
        })            
       
    } //ngOnInit

    setPlan(planDate){
        this.selectedExitDate = planDate;
        //console.log(planDate);
    }

    resetErrIc(){
        this.err_ic = null;
        //console.log(planDate);
    }

    resetApplyForm(){
        this.applyForm.reset();
        //console.log(planDate);
    }

    convertMonthBM(dateToConvert){         
        let monthBm = ['Januari','Februari','Mac','April','Mei','Jun','Julai','Ogos','September','Oktober','November','Disember']; 
        let dateString = dateToConvert; 
        let newDate = new Date(dateString);
        let convertedMonthBM = monthBm[newDate.getMonth()];
        return convertedMonthBM;
    }
    
    
    submitForm() {
        
        let tnc = this.applyForm.get('tnc').value;
        let ic = this.applyForm.get('ic').value;
        let plan = this.selectedExitDate;
        let checkIc = this.staff_nic;
        this.checkForm = 0;
        
        //validate form
        //check tnc box
        if (tnc === '' || tnc === null) {
            //console.log('tnc: ' +tnc)
            this.checkForm++
        }
        //check ic same with db
        if (ic === '' || ic === null || ic != checkIc) {
            this.err_ic = 'Sila masukkan No Kad Pengenalan yang sah';
            //console.log('ic: ' +ic)
            this.checkForm++
        }

        if (plan === '' || plan === null) {
            //console.log('selectedPlan: '+plan)
            this.checkForm++
        }        
        
        //console.log('Checking form..'+this.checkForm);
        if(this.checkForm === 0){
            //console.log('Checking form..Success');
            this.checkForm=0;
            //console.log('tnc:'+tnc);
            //console.log('ic:'+ic);
            //console.log('plan:'+plan);
            //console.log('checkformerror:'+this.checkForm);

                //set data to post
                let postData = {
                    icNo: this.staff_nic, 
                    dateChoice: this.selectedExitDate      
                }

                //send data to api for insertion
                this._POST_api_Service.POST_VRP_data(vrpVars.postUserApply,postData).subscribe(data => {   
        
                    //console.log('Successfully submitted');
                    //navigate to result page
                    this.router.navigateByUrl('/vrp/result');
                     //console.log(data);
                     this.loading = false;
                },
                error => {
                    console.log('[ERROR] postUserApply' + error);
                });

                //console.log("navigate to /vrp/result");
        }        
    }      

    checkEligibleVrpUsr() {               
        //check role user for VRP
        this._GET_api_Service.GET_VRP_data(vrpVars.getRoleVrp).subscribe(data => {
        if ((data.role_lvl > 0) && (data.role_lvl < 5)) 
        {                
                //check session user for VRP
                console.log('getRoleVrp: '+data.role_lvl);
                this._GET_api_Service.GET_VRP_data(vrpVars.getVrpSession).subscribe(data => {
                    console.log('getVrpSession: '+data.length);
                    if (data.length==0) 
                    {
                        this.router.navigateByUrl('/index');
                    }
                }, error => {
                    console.log('[ERROR] cannot check role ' + error);
                });              
            } else {
                //this.showVrp = false;
            }   
        }, error => {
            console.log('[ERROR] cannot check role ' + error);
        })
    }

    checkVrpRole(){
        this._GET_api_Service.GET_VRP_data(vrpVars.getRoleVrp).subscribe(data => {
            console.log('getRoleVrp: ' + data.role_lvl);
            if (data.role_lvl==0) 
            {  
                this.router.navigateByUrl('/index');
            }   
        }, error => {
                console.log('[ERROR] cannot check role ' + error);
        })   
    }

    checkVrpSession(){
        this._GET_api_Service.GET_VRP_data(vrpVars.getVrpSession).subscribe(data => {
            console.log('getVrpSession: DataLen '+data.length);
            if (data.length==0) 
            {
                this.router.navigateByUrl('/index');
            } else {                
                this.showVrp = true;
            }
        }, error => {
            console.log('[ERROR] cannot check role ' + error);
        });     
    }
    
    //check status to navigate to result
    checkApplicationStatus() {      
        this.loading = true;
        //console.log('Checking user status..');
        this._GET_api_Service.GET_VRP_data(vrpVars.getStatusAppl).subscribe(data => {  
            //console.log(data);
            if(data.length > 0) {
                this.staff_no = data[0].staff_no,
                this.checkStatus = data[0].status,
                this.checkStatusText = data[0].text,
                this.date_apply = data[0].choice_of_date    
                if(this.date_apply==this.exit_date_1)
                {
                    this.date_apply_button = 1;
                }
                if(this.date_apply==this.exit_date_2)
                {
                    this.date_apply_button = 2;
                }
                if(this.date_apply==this.exit_date_3)
                {
                    this.date_apply_button = 3;
                }
                // console.log(this.checkStatus);
                // console.log(this.checkStatusText);
                // console.log(this.date_apply);
                // console.log(this.date_apply_button);
                // console.log(data);
            } else {
                console.log('No Data API get_userStatus');
            }        
            this.loading = false;
        },
        error => {
            console.log('[ERROR Get getStatusAppl] ' + error);
        });
        //do check the api. if status bla bla bla then navigate to result
        // if(this.checkStatus){
        //     this.router.navigateByUrl('/vrp/result');
        // }
    }   
    
    checkSelectedLang() {
        let lang = localStorage.getItem('idpLang');
        if (lang) {
            if (lang === 'en') {
                this.enChecked = true;
                this.word = En;
            }
            if (lang === 'my') {
                this.enChecked = false;
                this.word = My;
            }
        }
        else {
            this.enChecked = true;
            this.word = En;
            localStorage.setItem('idpLang', 'en');
        }
    }

    langChange(id) {
        let selectedLang = id.value;
        if (selectedLang === 'en') {
            this.word = En;
            localStorage.setItem('idpLang', 'en');
            this.enChecked = true;
        }
        if (selectedLang === 'my') {
            this.word = My;
            localStorage.setItem('idpLang', 'my');
            this.enChecked = false;
        }
        document.getElementById('lang_close').click();
    }

    getBasicInfo() {
        this.loading = true;
        //console.log('Checking basicinfo..');
        this._GET_api_Service.GET_VRP_data(vrpVars.getBasicInfo).subscribe(data => {   
            if(data.length > 0) {
                this.staff_name = data[0].name;
                this.staff_no = data[0].staff_no;
                this.staff_nic = data[0].new_ic_no;
                //console.log(data);
            }
            else {
                console.log('No Data API get_basicInfo');
            }
            this.loading = false;
        },
        error => {
            console.log('[ERROR Get Profile] ' + error);
            this.loading = false;
        });
    } 

    //NEW API
    getOfferList() {
        this.loading = true;
        //console.log('Checking offer list..');
        this._GET_api_Service.GET_VRP_data(vrpVars.getOfferList).subscribe(data => {   
            //console.log('Data length: '+data.length);
            //console.log(data);
            if(data.length > 0){
                this.offerList=data;
                //console.log('Data Offer list: '+data);
                if(data[0].exit_date){
                    this.showOfferList=true;
                    //console.log('Fetching offer list..');
                    //console.log(data);
                } else {
                    //console.log('No data offer list..');                    
                }
            } 
            this.loading = false;
        },
        error => {
            console.log('[ERROR Get DateList] ' + error);
        });
    } 

    getTnc() {
        // pdfMake.createPdf(this.docCPDefinition).download(this.titleCPPdf);
        // this.imgDataUrl = '';       

        this.loading = true;
        this._GET_api_Service.GET_VRP_data(vrpVars.getTnc).subscribe(data => {   
            this.tncHashes = data[0].tnchash;
            this.tncMesraPdfURL = GlobalVariable.BASE_API_URL + "/get/image/" + this.tncHashes+ "?api_key=" + GlobalVariable.API_KEY;
            console.log(this.tncMesraPdfURL); 
            this.loading = false;
            },
            error => {
                console.log('[ERROR Get api tnc] ' + error);
        });
        
        
        // try {
        //     this.currUserId = JSON.parse(localStorage.getItem('currentUser')).userid; //staff id
        //   } catch (e) {
        //     console.error("Failed to get localStorage for currentUser");
        // }

        // let docDefinition = {  
        //     pageSize: 'A4',
        //     pageMargins: [20, 90],
        //     watermark: { text: `By: ${this.currUserId}@${this.currDate}`, color: '#e0e0d1', opacity: 0.3, bold: true },
        //     header: 'C#Corner PDF Header',  
        //     content: 'Sample PDF generated with Angular and PDFMake for C#Corner Blog'  
        // };  
        
        // pdfMake.createPdf(docDefinition).open();  
    }

    getFaq() {
        // pdfMake.createPdf(this.docCPDefinition).download(this.titleCPPdf);
        // this.imgDataUrl = '';          

        this.loading = true;
        this._GET_api_Service.GET_VRP_data(vrpVars.getFaq).subscribe(data => {  
            if(data)
            {
                this.faqHashes = data[0].faqhash;
                this.faqMesraPdfURL = GlobalVariable.BASE_API_URL + "/get/image/" + this.faqHashes+ "?api_key=" + GlobalVariable.API_KEY;
                console.log(this.faqMesraPdfURL); 
                this.loading = false;
            } else {
                console.log('Error API fetch FAQ: No Data'); 
                //console.log(data); 
                this.loading = false;
            }
            },
            error => {
                console.log('[ERROR Get api tnc] ' + error);
        });

        // let docDefinition = {  
        //     watermark: 'test watermark',
        //     header: 'C#Corner PDF Header',  
        //     content: 'Sample PDF generated with Angular and PDFMake for C#Corner Blog'  
        // };  
        
        // pdfMake.createPdf(docDefinition).open();  
    }
}