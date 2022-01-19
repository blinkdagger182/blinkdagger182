import { Component, OnInit, AfterViewInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { DatePipe } from '@angular/common'
import { NgModule }      from '@angular/core';
import { GlobalVariable } from "../../../../../../environments/environment";
import { En, My } from './lang-vars';
import { MovementPermitVars } from './movement-permit-vars';
import { FormGroup,FormControl,Validators } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-movement-permit',
  templateUrl: './movement-permit.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./movement-permit.component.css']
})
export class MovementPermitComponent implements OnInit {

  private readonly notifier: NotifierService;

  constructor(
    private http: Http,
    private _GET_api_Service: GET_Service,
    private _POST_api_Service: POST_Service,
    private router: Router,
    private _script: ScriptLoaderService,
    private datepipe: DatePipe,
    notifierService: NotifierService,
    private sanitizer: DomSanitizer,) 
    { 
      this.notifier = notifierService;
    }

  enChecked: boolean = true;
  word: any;
  loading = false;

  movementPermitForm: FormGroup;
  currDate = new Date();
  currDateDay = this.currDate.getDate(); //Date of the month: 2 in our example
  currDateMonth = this.currDate.getMonth(); //Month of the Year: 0-based index, so 1 in our example
  currDateYear = this.currDate.getFullYear() //Year: 2013
  currDateOnly = new Date(this.currDateYear,this.currDateMonth,this.currDateDay);

  //set default range date
  selectedMoments = [
    this.currDateOnly,
    this.currDateOnly
  ];
  //set min selected date
  dateMin = this.currDateOnly;
  
  check_disclaimer: boolean = false;
  disclaimer=false;

  letterId=6;
  uploadTime=this.currDateOnly;

  ngOnInit() {
    this.checkSelectedLang();
    this.getPurpose();
    this.getSupervisor();

    console.log(this.currDate,this.currDateOnly);  
    
    this.movementPermitForm = new FormGroup({
      iptPurpose: new FormControl('', Validators.required),
      iptOfficeLoc: new FormControl('', Validators.required),
      iptDestination: new FormControl('', Validators.required),
      iptDateFrom: new FormControl('', Validators.required),
      iptDateTo: new FormControl('', Validators.required),  
      iptSupervisor: new FormControl('', Validators.required), 
      checkDisclaimer: new FormControl('', Validators.required),           
    });    
    
    this.notifier.notify('success', "Form load succesfully");
  }//ngOnInit

  btnCancel(){    
    if(confirm("Are you sure to cancel?")) {
      this.router.navigateByUrl('/eletter');
    }
  }
  // get list purpose from API
  purposeList = [];
  getPurpose() {
      this.loading = true; 
      this._GET_api_Service.GET_EVL_data(MovementPermitVars.apiGetPurpose).subscribe(data => {
        this.purposeList=data;
        console.log('purposeList',data)
      }, error => {
            console.log('[ERROR] API: ',MovementPermitVars.apiGetPurpose,'ErrMsg: ',error);
      })
      this.loading = false; 
  }
  
  sup_name;  
  sup_staff_No;  
  sup_Post_Desc;  
  getSupervisor() {
      this.loading = true; 
      this._GET_api_Service.GET_EVL_data(MovementPermitVars.apiGetSupervisor).subscribe(data => {
        this.sup_name=data[0].Name;
        this.sup_staff_No=data[0].staff_No;
        this.sup_Post_Desc=data[0].Post_Desc;
        console.log('supervisor',data)
      }, error => {
            console.log('[ERROR] API: ',MovementPermitVars.apiGetSupervisor,'ErrMsg: ',error);
      })
      this.loading = false; 
  }

  addImageTrigger(){
    $('#ssImg').trigger('click'); 
  }

  resume;
  resumeName;
  resumeUrl = '';
  fileChange(event) {
      let fileList: FileList = event.target.files;
      this.resume = fileList;
      console.log(this.resume) ;
      let form_Data = new FormData();
      form_Data.append('resume', this.resume[0], this.resume[0].name);
      this._POST_api_Service.POST_EVL_ScreenShot(MovementPermitVars.apiPostUploadsuppdoc, form_Data).subscribe(res => {
          console.log("res", res);
          if(res.results ===  true){
              this.resumeUrl = ""
              setTimeout(function() {
                  this.resumeUrl = GlobalVariable.BASE_IDP_URL + this.APIGetImg + "/" + res.image_url+ "?api_key=" + GlobalVariable.API_KEY;
              }.bind(this), 1000); //wait 1 Seconds and hide
              this.resumeName = res.resumeFileName;
              this.uploadTime = res.resumeUploadTime;
          }
      })
  }

  openPDF() {
      window.open(this.resumeUrl);
  }

  submitDeleteResume() {
      this._GET_api_Service.GET_EVL_data(MovementPermitVars.apiUploadRemove+this.letterId).subscribe(dataRes => {
          if(dataRes.results ===  true){
              this.notifier.notify('success', 'Successfully Delete Resume !');
              // this.addImageTrigger();
              this.resumeUrl = ""
          }
          else {
              this.notifier.notify('error', 'Fail to delete resume');
          }
      },
          error => {
              console.log('[ERROR + Fail to delete resume]', error);
          }
      );
  }
  //upload file
  files: File[] = [];
  onSelect(event) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }

  onRemove(event) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }

  confirmCancel(formName) {
    if(confirm("Are you sure to cancel "+formName)) {
      //console.log("Implement delete functionality here");
      this.router.navigateByUrl('/index');
    }
  }

  //submit form
  checkForm;
  err_form;
  submitForm() {
        
    let iptLtype = MovementPermitVars.letterId;
    let iptPurpose = this.movementPermitForm.get('iptPurpose').value;
    let iptOfficeLoc = this.movementPermitForm.get('iptOfficeLoc').value;
    let iptDateFrom = this.movementPermitForm.get('iptDateFrom').value;
    let iptDestination = this.movementPermitForm.get('iptDestination').value;
    let iptSupervisor = this.sup_staff_No;
    let checkDisclaimer = this.movementPermitForm.get('checkDisclaimer').value;
    //alert(this.movementPermitForm.get('iptSupervisor').value);
    this.checkForm = 0;

    //validate form
    //check iptPurpose box
    if (iptPurpose === '' || iptPurpose === null) {
      console.log('checkForm: 1',iptPurpose);
        this.checkForm++
    }
    //check iptPurpose box
    if (iptOfficeLoc === '' || iptOfficeLoc === null) {
      console.log('checkForm: 2',iptOfficeLoc);
        this.checkForm++
    }
    //check iptPurpose box
    if (iptDestination === '' || iptDestination === null) {
      console.log('checkForm: 3',iptDestination);
        this.checkForm++
    }
    //check iptPurpose box
    if (iptDateFrom === '' || iptDateFrom === null) {
      console.log('checkForm: 4',iptDateFrom);
        this.checkForm++
    }
    //check iptSupervisor box
    if (iptSupervisor === '' || iptSupervisor === null) {
      console.log('checkForm: 5',iptSupervisor);
        this.checkForm++
    }
    //check disclaimer
    if (!checkDisclaimer) {
        this.checkForm++
    }     

    //check atleast has 1 upload file    
    let docList = []
    this._GET_api_Service.GET_EVL_data(MovementPermitVars.apiGetSuppdoc).subscribe(data => {
        docList=data;
        console.log('docList',data);
        if(data.length == 0){
          this.checkForm++
        }
    }, error => {
          console.log('[ERROR] API: ',MovementPermitVars.apiGetSuppdoc,'ErrMsg: ',error);
          this.checkForm++
    })
    
    //console.log('Checking form..'+this.checkForm);
    if(this.checkForm === 0){
        //console.log('Checking form..Success');
        this.checkForm=0;

            //set data to post
            let postData = {
              ltype: iptLtype, 
              purpose: iptPurpose, 
              officelocation: iptOfficeLoc, 
              destination: iptDestination, 
              supervisor: iptSupervisor, 
              traveldate: iptDateFrom, 
            }

            //send data to api for insertion
            this._POST_api_Service.POST_EVL_data(MovementPermitVars.apiPostAddletter,postData).subscribe(data => {       
                console.log('postData: ',postData)
                this.loading = true;
                //window.location.reload();
                this.router.navigateByUrl('/eletter/tracking?view=self');
            },
            error => {
                console.log('[ERROR] apiPostAddletter:' + error);
            });
    } else {
      this.err_form = "Please fill form with valid input";
    }     
  }        

  // language
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

}
