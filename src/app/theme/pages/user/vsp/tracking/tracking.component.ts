import { ComponentFactoryResolver, Component, OnInit, ViewEncapsulation, Injectable, HostListener } from '@angular/core';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { En, My } from './lang-vars';
import { Location, DatePipe } from '@angular/common';
import { trackingVars } from './tracking-vars';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import "rxjs/add/operator/map";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { WindowInterruptSource } from '@ng-idle/core';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { GlobalVariable } from "../../../../../../environments/environment";

declare var $: any;


@Component({
    selector: 'vrp-tracking',
    templateUrl: './tracking.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./tracking.component.css']
})

export class TrackingComponent implements OnInit {

  constructor(    
    private http: Http,
    private _location : Location,
    private _GET_api_Service: GET_Service,
    private _POST_api_Service: POST_Service,
    private router: Router, 
    private _script: ScriptLoaderService,
    private datePipe: DatePipe,
  ) { }
  
  enChecked: boolean = true;
  word: any;
  loading = false;  
  currentDate = new Date();
  
  staff_no: string;
  checkStatus: any;
  checkStatusText: string;  
  date_apply1; 
  
  staff_name: string;
  staff_nic: any;

  ref_no: string;
  applied_on: Date;
  accepted_on: Date;
  rejected_on: Date;
  approved_on: Date;
  approved_by: string;
  expired_on: any;

  showRating: boolean = false;
  rating: any;
  ratingComment: any;
  tncMesraPdfURL: any;
  faqMesraPdfURL: any;
  returnAssetFormPdfURL: any

  //"ref_no": "2021 - 0001 GHCM | MESRA 2021",
  //"applied_on": "2021-04-16T00:19:30.000Z",
  //"accepted_on": null,
  //"rejected_on": null,
  //"approved_on": null,
  //"approved_by": null
  

  ngOnInit() {

    this.checkSelectedLang();
    this.checkVrpRole();
    this.getBasicInfo();
    this.checkApplicationStatus();
    this.showRatingForm();
    this.getTnc();
    this.getFaq();
    this.getRoa();
    
    this.confirmOffer = new FormGroup({
        tnc: new FormControl('', Validators.required),
        ic: new FormControl('', Validators.required)
    })  
    this.cancelOffer = new FormGroup({
        remarks: new FormControl('', Validators.required),
        tnc: new FormControl('', Validators.required),
        ic: new FormControl('', Validators.required)
    })  
    
  }  

  resetApplyFormConfirm(){
    this.confirmOffer.reset();
    this.err_ic = null;
    //console.log(planDate);
  }

  resetApplyFormCancel(){
    this.cancelOffer.reset();
    this.err_ic = null;
    this.err_reason = null;
    //console.log(planDate);
  }

  convertMonthBM(dateToConvert){         
    let monthBm = ['Januari','Februari','Mac','April','Mei','Jun','Julai','Ogos','September','Oktober','November','Disember']; 
    let dateString = dateToConvert; 
    let newDate = new Date(dateString);
    let convertedMonthBM = monthBm[newDate.getMonth()];
    return convertedMonthBM;
  }

  confirmOffer: FormGroup;
  tncCheck: boolean = false;
  checkForm = 0;
  err_ic: string;
  submitFormConfirm() {
        
    let tnc = this.confirmOffer.get('tnc').value;
    let ic = this.confirmOffer.get('ic').value;
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
            }

            //send data to api for insertion
            this._POST_api_Service.POST_VRP_data(trackingVars.postConfirmOffer,postData).subscribe(data => {       
                //this.router.navigateByUrl('/vrp/tracking');
                this.loading = true;
                window.location.reload();
            },
            error => {
                console.log('[ERROR] postUserConfirm' + error);
            });
        }        
    }        
    
    cancelOffer: FormGroup;
    tncCheck2: boolean = false;
    err_reason: string;
    remarks: string;
    submitFormCancel() {
        
        let tnc = this.cancelOffer.get('tnc').value;
        let ic = this.cancelOffer.get('ic').value;
        let remarks = this.cancelOffer.get('remarks').value;
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
        else {            
            this.err_ic = null;
        }
        //check ic same with db
        if (remarks === '' || remarks === null) {
            this.err_reason = 'Sila masukkan sebab';
            //console.log('ic: ' +ic)
            this.checkForm++
        }
        else {            
            this.err_reason = null;
        }
        
        //console.log('Checking form..'+this.checkForm);
        if(this.checkForm === 0){
            this.checkForm=0;

            //alert('nic: '+this.staff_nic+'\n'+'remarks: '+remarks);
                //set data to post
                let postDataCancel = {
                    icNo: this.staff_nic, 
                    remarks: remarks,     
                }
    
                //send data to api for insertion
                this._POST_api_Service.POST_VRP_data(trackingVars.postCancelOffer,postDataCancel).subscribe(data => {       
                    //this.router.navigateByUrl('/vrp/tracking');
                    this.loading = true;
                    window.location.reload();       
                },
                error => {
                    //alert('[ERROR] API postUserCancel: ' + error);
                    this.err_reason = '[ERROR] postUserCancel: ' + error;
                    console.log('[ERROR] postUserCancel: ' + error);
                });
        }        
    }   

    showRatingForm(){
        if(this.checkStatus=='7'||this.checkStatus=='8'||this.rating==null){
            this.showRating = true;
        }
    }

    checkRate1(num){
        let rating = this.rating;
        
        if(num > rating)
            return false;
        else 
            return true;

    }

    checkRate2(num){
        let rating = this.rating;
       
        if(num <= rating)
        {
            return false;
        }
        else
            return true;
        
    }

    newRating; 
    hide_btn = false;
    rateChanged = false;
    ratingClicked(index,num){
        let div = document.getElementById('rateSubmit');
        div.style.display = 'block';
        this.newRating = num;
        this.rating = num;
    }
    checkComnt(){
        this.ratingComment = (<HTMLInputElement>document.getElementById("comnt")).value;
        let div = document.getElementById('rateSubmit');
        div.style.display = 'block';
    }
    updateComnt(){
        
        this.loading = true;
        let postData = {
            rating : this.newRating,
            comment : this.ratingComment 
        }
        //alert(this.newRating+'\n'+this.ratingComment);
        //send data to api for insertion
        this._POST_api_Service.POST_VRP_data(trackingVars.postRating,postData).subscribe(data => {   
            this.loading = false;
            //let div = document.getElementById('rateSubmit');
            //div.style.display = 'none';
            if (data.status === "OK"){
                $("#success").click();
            }
        }, error => {
            $("#error").click();
        })        
        this.loading = true;
    }

  checkVrpRole(){
      this._GET_api_Service.GET_VRP_data(trackingVars.getRoleVrp).subscribe(data => {
          //console.log('getRoleVrp: ' + data.role_lvl);
          if (data.role_lvl==0) 
          {  
                this.router.navigate(['/index'])
                .then(() => {
                  window.location.reload();
                });
          }   
      }, error => {
              console.log('[ERROR] cannot check role ' + error);
      })   
  }

  checkVrpSession(){
      this._GET_api_Service.GET_VRP_data(trackingVars.getVrpSession).subscribe(data => {
          //console.log('getVrpSession: DataLen '+data.length);
          if (data.length==0) 
          {
            this.router.navigate(['/index'])
            .then(() => {
              window.location.reload();
            });
          }
      }, error => {
          console.log('[ERROR] cannot check role ' + error);
      });     
  }

    hcbd_remarks;
    hcbd_remarks_on;
    generated_on;
    //check status to navigate to result
    checkApplicationStatus() {      
        this.loading = true;
        this._GET_api_Service.GET_VRP_data(trackingVars.getStatusAppl).subscribe(data => {  
            console.log(data);
            if(data) {
                this.staff_no = data[0].staff_no,
                this.checkStatus = data[0].status,
                this.checkStatusText = data[0].text,
                this.date_apply1 = data[0].choice_of_date                  
                this.ref_no = data[0].ref_no;
                this.applied_on = data[0].applied_on;
                this.accepted_on = data[0].accepted_on;
                this.rejected_on = data[0].rejected_on;
                this.approved_on = data[0].approved_on;
                this.approved_by = data[0].approved_by;
                this.remarks = data[0].remarks;
                this.rating = data[0].rating;
                this.ratingComment = data[0].comment;
                this.expired_on = data[0].expired_on;
                this.hcbd_remarks = data[0].hcbd_remarks;
                this.hcbd_remarks_on = data[0].hcbd_remarks_on;
                this.generated_on = data[0].generated_on;
                //console.log('date_apply: '+this.date_apply);
                //divert back to mainpage if the user is status NEW or Null

                //if(!this.showVrp&&(this.checkStatus === 1 || this.checkStatus === null)){
                //    this.router.navigateByUrl('/index');
                //}
                this.loading = false;
            }         
        },
        error => {
            console.log('[ERROR Get getStatusAppl] ' + error);
        });
        //do check the api. if status bla bla bla then navigate to result
        // if(this.checkStatus){
        //     this.router.navigateByUrl('/vrp/result');
        // }
    }  
    
    staff_age: any;
    staff_gender: string;
    staff_comp: string;
    staff_batch_id;
    getBasicInfo() {
        this.loading = true;
        this._GET_api_Service.GET_VRP_data(trackingVars.getBasicInfo).subscribe(data => {   
          //console.log('Checking basicinfo..',data);
            if(data.length > 0) {
                this.staff_name = data[0].name;
                this.staff_no = data[0].staff_no;
                this.staff_nic = data[0].new_ic_no;
                this.staff_comp = data[0].comp;
                this.staff_age = data[0].age;
                this.staff_gender = data[0].gender;
                this.staff_batch_id = data[0].batch;
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

    checkEligibleVrpUsr() {               
        //check role user for VRP
        this._GET_api_Service.GET_PPS_data(trackingVars.getRoleVrp).subscribe(data => {
            if ((data.role_lvl > 0) && (data.role_lvl < 5)) 
            {                
                    //check session user for VRP
                    //console.log('getRoleVrp: '+data.role_lvl);   
            } else {
                this.router.navigateByUrl('/index');
            }   
        }, error => {
            console.log('[ERROR] cannot check role ' + error);
        })
    }

    convertWordStatus(toConvert){
        //Accept
        //Reject
        //Offer Expired
        if(toConvert=='1'){
            return 'Baru'
        }
        if(toConvert=='2'){
            return 'Sudah Dipohon'
        }
        if(toConvert=='5'){
            return 'Tidak Berjaya'
        }
        if(toConvert=='6'){
            return 'Berjaya'
        }
        if(toConvert=='7'){
            return 'Terima'
        }
        if(toConvert=='8'){
            return 'Tolak'
        }
        if(toConvert=='9'){
            return 'Tawaran tamat'
        }  
        if(toConvert=='10'){
            return 'Pemberhentian'
        }     
        if(toConvert=='11'){
            return 'Tidak Berminat'
        }       
        //reject - tolak
        //accept - terima
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

  menuClicked(path) {
    this.router.navigate([path]);
    }

    btnBackClick(){
        this._location.back();
    }

    resetErrIc(){
        this.err_ic = null;
        //console.log(planDate);
    }

    // azlina function generate offer letter idividual    
    userId;
    theDate;    
    downloading3 = true;

    titleOfferLetterPdf;
    docOLDefinition; 
    stId: any;
    detailArr; refArr; profileArr; retireArr;
    refRefNo; staffExitDate; generatedDate; appliedDate;
    staffName; staffIc; choiceofdate;
    staffadv_balance; coDate; selectDate; date_apply;
    nettAmt:0; remMth:0; paidMth:0; end_service:string;
    advBal:0; carLoan:0; hseLoan: 0; compLoan: 0; 
    finalBal: 0; scholarship: 0; benefit:0; totalRew: 0; tranche:0;
    year_in_service: 0; factor:0;

    getOfferLetter(itemEOL, batch){
        switch(batch) { 
          case 1: { 
            //statements; 
            this.getOfferLetterMESRA(itemEOL);
            break; 
          } 
          case 2: { 
            //statements; 
            this.getOfferLetterVSP(itemEOL);
            break; 
          } 
          default: { 
            //statements; 
          alert('Staffno: '+itemEOL+'\n'+'Batch: '+batch);
            break; 
          } 
        } 
    }

    getFullDateString(strDate){
      var YearInt = strDate.split("/").pop();
      var MonthInt = strDate.substr(0,strDate.lastIndexOf('/')).substr(0,strDate.lastIndexOf('/')).split("/").pop();
      var DayInt = strDate.split("/").shift();
      const monthNames = ["Januari", "Februari", "Mac", "April", "Mei", "Jun","Julai", "Ogos", "September", "Oktober", "November", "Disember"];
     
      var y: number = Number(MonthInt);
      var strMonth = monthNames[y-1];

      //console.log('inside date func' + DayInt )

      return  DayInt + " " + strMonth + " " + YearInt;
    }

    getOfferLetterVSP(itemOL){
      this.stId = itemOL;
      let dataOL = {
        Staff_Id: itemOL,
      }
      
           this._POST_api_Service.POST_VRP_data(trackingVars.postGetDetailStaff, dataOL).subscribe(datares => {
            this.detailArr = datares;
            this.profileArr = this.detailArr.profile;
            this.refArr = this.detailArr.reference; 
            this.retireArr = this.detailArr.retirement; 
           // this.choiceofdate = this.profileArr[0].choice_of_date.split("T")[0].split('-').reverse().join('/');
            this.choiceofdate = this.profileArr[0].choice_of_date;
            this.staffName = this.profileArr[0].name;
            this.staffIc = this.profileArr[0].new_ic_no
            this.refRefNo = this.detailArr.reference[0].ref_no;  
            this.staffExitDate = this.retireArr[0].exit_date;
            this.generatedDate = this.profileArr[0].generated_on;
            this.appliedDate = this.profileArr[0].applied_on; 
            if(this.choiceofdate.length > 0) {
              this.date_apply = this.choiceofdate;
                           

                  this.advBal = this.retireArr[0].adv_balance;
                  this.carLoan = this.retireArr[0].bal_car_loan;
                  this.compLoan = this.retireArr[0].bal_comp_loan;
                  this.hseLoan = this.retireArr[0].bal_house_loan;
                  this.finalBal = this.retireArr[0].final_acc_bal;
                  this.scholarship  = this.retireArr[0].scholarship;
                  this.benefit = this.retireArr[0].benefit;
                  this.remMth = this.retireArr[0].remaining_month;
                  this.paidMth = this.retireArr[0].salary;
                  this.nettAmt = this.retireArr[0].nett_amount;
                  this.tranche = this.retireArr[0].tranche_percentage;
                  this.year_in_service = this.retireArr[0].year_in_service;
                  this.factor = this.retireArr[0].factor;
                  this.end_service = '30/09/2021';
                
            }

            let ofl:DatePipe = new DatePipe('en-Us');
            let currDate = ofl.transform(this.generatedDate, 'dd/MM/yyyy');
            this.theDate = ofl.transform(new Date(), 'dd/MM/yyyy');
            currDate = (currDate == null || currDate == '') ? this.theDate : currDate;
            currDate = this.getFullDateString(currDate);
            //currDate = ofl.transform(currDate,'dd/MM/yyyy');
            try {
             this.userId = JSON.parse(localStorage.getItem('currentUser')).userid;
           } catch (e) {
             console.error("Failed to get localStorage for currentUser");
           }
         
           this.titleOfferLetterPdf = `Surat Tawaran Pelan Perpisahan Sukarela_VSP2021_${this.stId}.pdf`;
           setTimeout(() => {
             this.downloading3 = false;
             let myOL_refNo = this.refRefNo;
             let myOL_name = this.staffName.toUpperCase();
             let myOL_ic = this.staffIc;
             let myOL_choiceofdate = this.datePipe.transform(this.choiceofdate, 'dd/MM/yyyy'); 
             let myOL_advBal = this.advBal; 
             let myOL_carLoan = this.carLoan; 
             let myOL_hseLoan = this.hseLoan; 
             let myOL_compLoan =  this.compLoan; 
             let myOL_finalBal = this.finalBal; 
             let myOL_schol = this.scholarship; 
             let myOL_benf = this.benefit;      
             let myOL_paid = this.paidMth;   
             let myOL_remMth = this.remMth;
             let myOL_netAmt = this.nettAmt;
             let myOL_trenche = this.tranche;
             let myOL_endService = this.end_service;
             let myOL_yis = this.year_in_service;
             let myOL_appliedDate = this.getFullDateString(ofl.transform(this.appliedDate, 'dd/MM/yyyy').toString());
             let myOL_form = this.factor;
             //myOL_form = Number(myOL_form) > 36.00 ? 36.00 : myOL_form;
       
             this.docOLDefinition = {
               pageSize: 'A4',
               pageMargins: [20, 90],
               background: function(page) {
                 if (page !== 1) {
                   return [
                     {
                       columns: [
                         {
                           width: 175,
                           alignment: 'center',
                           table: {
                             width: ['auto'],
                             body: [
                               [{ text: `\n`, lineHeight: 0.8}],
                             ]
                           },
                           layout: 'noBorders',
                           margin: [20, 105, 0, 0]
                         }
                       ],
                     },
                   ]
                 }
               },
               header: {},
                            
               footer: {
               columns: [
                { text: 'Telekom Malaysia Berhad (128740-P), Human Capital Business Operations, Level 10 North Wing, Menara TM, Jalan Pantai Baharu 50672 Kuala Lumpur, Malaysia.  	www.tm.com.my', alignment: 'left', margin:40, color: '#AAB7B8', fontSize: 10,},
              ]},
                      
               content: [],
               images: {
                logoTM: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAApQAAAExCAYAAADC9jL8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH2QIVDzctOmao9gAAIABJREFUeJzs3XmcXXV9//HX59w7M9n3BIhBIJksNOIWBWlBwk6SgksbqrX151JL64JKK2TFK1kgotTiitbW2tb6g591iUnYyiIom7ghmGUSEBAheyDbzNx7Pr8/JsHJzCSZuXPu/Z577vv5ePhoMjP3nHfKzNzP+S6fL4iIiIiIiIiIiIiIiIiIiNQkCx1ARETkSNyxzcsZBxyTixkXwwiDkcAIc0bEESPMaTAYAeAwFMgf9brwYgQlYLcb7cS86BG7opidROxy2OmwK4rYHEX8ftQ8dlX2XypSu1RQiohIUM/cwMBBu5kYR0x0Z2LkTHRjInAscBxwDL0oEKtgP7DZ4TmD5w1+68ZTBr/1mKeb8jw1bAHbQocUCUEFpYiIVM3mAs1EvD6C1zicYhGnuHNi6FwJ2uGwLjKewFkPrCvBY+MWsckMDx1OpFJUUIqISEVsWcFQa+O0GE4zeBNwGjA2dK5AXgR+afCL2PmFw6PjpvFru5RS6GAiSVBBKSIiidhWYFgpxxkGM4GzgNeTjqnqtHoJeAjnJ248kCvxk9EFXgwdSqQcKihFRKQsOwqMKOY4g44C8s10FJC5oKFqW9HhEXPucLhzbMwDVqAYOpRIb6igFBGRXtl5LSPbi5zJH0YgX4MKyEra7c4dEXwv38DKEfPZETqQyOGooBQRkR75zeS2r+eNsXO+wyyDU1EBGUoRuMfgf4olvnNsgc2hA4l0poJSRERetq3AhFLEeWZcBJwPjAqdSbppx1ltEf82eiyr7TLaQwcSUUEpIlLHniwwYGiOMxwuMLjI4ZTQmaRPtgDfyBtfHLmI34YOI/VLBaWISJ3ZsozjKHExcAnG2cCg0Jmk30oG342Nfx63iPtDh5H6o4JSRKQObLuG6aWIt5jzFuANQBQ6k1TM/cRcPfaT3B06iNQPFZQiIhm1eQmTMf7CnHcA00Pnkaq7K3auPuZqfhw6iGSfCkoRkQzZUWBEKeKv3Hg38MbQeSQVVnuJj44r0BI6iGSXCkoRkRrnjm1ZxpnmfAD4M2Bg6EySOm3mfKY4kOXHfoI9ocNI9qigFBGpUc8XGJfP8V533ocxJXQeqQlPG3x8zGL+J3QQyRYVlCIiNWbLNZzlxuUGFwMNofNITfrvhjwf0uk7khQVlCIiNeDJAgMG53iXwUfoOPJQpL9+F8W8d/QnuSN0EKl9KihFRFJsW4EJpRwfNPgAMCZ0Hskcx/nnMcdwpU7ckf5QQSkikkLbruH02PgY8DY0rS2Vd2+pxKU6I1zKpYJSRCQl3LGty5lNzJXAm0PnkbrzDMbbxy7ip6GDSO1RQSkiEpgXyG+LeAfGlTpLWwLbb/DOMYv5XuggUltUUIqIBPL89QyOWnm/OVcAJ4TOI3JAyeED4xbzb6GDSO1QQSkiUmXbCgyLc3wUuBxttJF0cowrxy7iM6GDSG1QQSkiUiWdCsmPAaNC5xE5GoN5YxazInQOST8VlCIiFbatwLBSnsvN+TgqJKW2uMGHxizmy6GDSLqpoBQRqZBtBYaVcnzE4ApUSErtKuH81dir+XboIJJeKihFRBL2zA0MHLiXj7rzCVRISja0uXHuuEXcHzqIpJMKShGRhHiB/NaI92F8EhgfOo9Iwn5PxIyxC/l96CCSPlHoACIitc4d27yUuVsjHse4CRWTkk3HEXOzF2gMHUTSRwWliEg/bF3CeVuX8rA5N2NMCZ1HpMLO2BqxLHQISR9NeYuIlGHzNbyOiBXmnB86i0iVlSLnzNFX80DoIJIeKihFRPpgyzKOM2epO+9BszxSr5y1O0fw2smX0xo6iqRDPnQAEZFa4AUat+a5nJhPOgwJnUckKGPayJ0sAhaHjiLpoBFKEZGj2LqUtzl8Gqc5dBaRFNlnxuQxi/hd6CASnkYoRUQOY/M1vM6MG9yZGTqLSAoNdLgauCx0EAlPI5QiIl3sKDCiPc8Scz6I1kmKHEkReNXYxawLHUTC0i9KEZED3LGtS/nrYo615nwY/Y4UOZo88A+hQ0h4GqEUEQG2XcP02PgicFboLCI1Zne+xPEjC+wMHUTC0RpKEalrmwsMsYjFsfFxoCF0HpEaNKQ9z7uBG0MHkXA0nSMidWvrUt5iOZ7AuBIVkyJlM+d9oTNIWJryFpG683yBcbkc/wy8I3QWkazIlThhVIGnQ+eQMDRCKSJ1Zcs1/GWU4wlUTIokKs4xJ3QGCUdrKEWkLmwrMCGO+ArGHE3NiCTPnTnAl0PnkDA0QikimeaObbmGv41zPI5pBEWkYozTQ0eQcPSgLiKZtaXAeHL8O3Be6Cwi9cCMCTqKsT5pyltEMmnrEt4ew1cNRofOIlIv3HgtqKDsah1Dxzj5qRE+2bHxhh0DPg4YDwwFhtPRaWII0ATkgL1dLrML2GvYXife6dgeg71gWwyeiomfiuApiDZOZvuLVfznASooRSRjNhcYYjk+5/B+TcGIVFnMFGBV6BihOOQ2MvJkx051/FTgNcAUYFTH7yM7MDXsvblcU5e/j+x4pXe6zqEf6biqxxsY+Tj47RB9p5ntD1ovb9gfKihFJDO2LuVUh//CaQ6dJQNewNnhxk5zdmDscNgB7I6MnQfew150pwTs9oj2ni4SwSCPaSJiiDkNOMPcGGjGSI8ZiTHKYaTBKOAYOkZmpFY5I0JHqCaH3HpGzzBKFzh2zgZ4IzCkCvXbkUQOp4CdAv4PGxj5+HrsxiEM+M/xPNd11DMxeoAXkZrnjm1bxlXuLEEPykez1eF5g2cdXojgWZznifidxTxPzDOjYLMVaKt2ML+Z3NYnOMYijifiWGKOdzgJoxmYDEyk+6iNpIg5N465mo+GzlFJv2Ho6By5S8BmAefS8TBUC7YDXzPaPzuZ3VuSvrgKShGpaS8uZ3RrkX/XDu6XvQi0AC3mtMRGC05LKeaZ3aP4/eTLaQ0dsFxeIHohxwk5OAXjtR7zWjNeTUehqfezFHD493GLeU/oHEl7krHHtlN8K/ifgc2kth9cdzv22SK5z0xny+6kLqofQBGpWVuW8gacm4GTQmepsp10KhqJaCnBBi/ScmyBzaHDVduuAqPaGjjdYk53+BPgVGBQ6Fx1yfjq2EVcFjpGEh5n7JAG2v8ceBfYOWSv1eIW8CXt7LxpOv2fkVBBKSI1acs1/B3G58j2FOh+4HEzfunwmDm/aivxq/EFtoYOlmZeoHFbjjMcLjK4qGM9mVSF85mxV/OJ0DHK5WAbGHEmRO8F/3M6dl1nmuHrY+xvprLjvv5dR0SkhhzYxf0V4F2hsyTsGZxfOTxGxC8i51ejS2ywAsXQwWrdtgITSnnejvMOgzeh975KunrsYpaEDtFXGxk5PMbf69iHoC439cVgnze2XzWZ8pbF6IdKRGrGluVM8RLfMXhV6Cz94Dgb3HgA42fm/KqxxK+GF9geOlg92LGUE0rwTocP4EwMnSdznMvGXs1XQ8forXWMnhYRf9jh/1AHo5FHY9hPS5QuncauJ/v+WhGRGrB5GbMs5ltQc21JdrnxsMU8QI6HG9t5QMVjeF4g2pLjInM+iDGL7K2PC8KM08Ys4uHQOY7EIdrAyFnA5cD5qBbqaqthl0xm+wN9eZH+nygiqeaObVvKlQ7LSH+PwtjhCTMe9JgHcvDQqJjfWIE4dDA5vO3LeFUcc7XDn6HCsj/i0gCGHfsJ9oQO0hOHaD0jLzVYBEwPnSfl9gNzp7Djh719gQpKEUmt5woMasjxdeAdobMcxl7gJ27cGzkPWomHRxeo+pFnkoznr+GUnHEdMDt0lhq1buxipoUO0dXdkJ/AiHc6thCYGjpPDWlzeNtUdqzuzReroBSRVNqxlBOKzneB14XO0kkr8CBwtzt3jY15KEQDcKmszUuZa87n6DhnWXrL+dzYq/l46BgH/RQahjPq3Y7PByaFzlOj9kJ0zhS2PXS0L1RBKSKps3kpbzbn/wFjA0cpGjwM3E3M3fuG8pPjr2Bf4ExSBduvY3ipnZuAvwidpWbEnDP2k9wdOsbdkH8FI98PzANODBwnC7bk8TdOZOdvj/RFKihFJFU2X8N7zLgJaAxw+xLwc+Buh7socf+4AomdJCG1Z8tSPoZzPbV9Mko1bB8zlXF2KaVQARyshVF/3rHe2ieHypFFBj9uZsdZxuH/+6qgFJFUcMe2LGWZwfwq3/p5YFVsrGks8r8jC+ys8v0l5bYsYw4x/0OYh5yaYPD5MYu5PNT91zH83IjcdY6/IVSG7POrp7DzsD1GVVCKSHDP3MDAgXv4psOfV+F2JYeHMVYTs2rsYn5hhlfhvlLDti7lLd5xzKeKyu5iLzF1XIGWat+4heEzYuxasPOrfe86tD+idEozL/b431kFpYgEtbnAsZbj+3Scv1wp24E1GGuaIm4dtoBtFbyXZNTWJfy9w5dC50gd5/tjr+at1bxlC8OandxSh0tRLVM1Dt+fyo4e/1vrP4KIBLPtGqZ7xA/dE18478AvDFabs2rUNB4OubZLsmPLEr4FvDN0jjRx48xxi7i/Gvd6khEjirDIsY+g0eIQ3IlOm8q2R7p+QouMRSSILZ/i7Nj4Hzyxk29ace4EvucxPxxX4PmErivysnyJDxZznEf4DgTp4Hx/3OLKF5MOUQuj3tNOvBzsmErfTw7LIF4I3UekNUIpIlW3eQl/bvCfQFM/L7XHYLU734tifqim4lINBzoR/FvoHCnQDpwydjHrKnmTDYyY6dgNpKsnbT0r5WDiJHY83fmDGqEUkaraeg0fdvgc5R+juBP4ocF39g3mNvWFlGobG/PNrXkW4jSHzhKSwVfGVLCY3MjIV5bwzzpWjc160nu5IvZ+4JOdP6gRShGpigNnci9xWFjGyzdjfC9yvjNqHHfbZbQnHlCkDzYv4SMGN4bOEdAzDXleM2I+OxK/MBMG7mPvfPB/BAYmfX1JxNop7Di58wdUUIpIxfnN5Lau4ybg/X142dMG33Xnu2Omcb821Uia7Cowqi3HC9TnTJ8bXDBmMXcmfeF1jJxl8Hl0VGLqGTZ9MtufOPj3evxBEJEqOlBM/ge92xn7HM63LeL/jl7II+oPKWk1vMD2LUu5D+fs0FmqzeALSReTGxg1wYn/ier0opUEOPG5wMsFZRQwi4hk3IFi8r84cjG5A/g6MeeMKXH82Kv5hzGLeFjFpKRezH2hI1SbwWNtJeYldb27Ib+BUR93/DdorWRNcezczn/XCKWIVIQXyG9bx7eAuT18eh+w0uC/dwxnzeTLaa1yPJF+c+Oxelo35rDNS7x9fIG9SVyvhVF/HONfcvw1SVxPqsvgjZ3/roJSRBLnjm1dyjc4tJgsAXeY89/exHfHXsVLYdKJJMOcJ+toJ0IpivmLMQkcr7iWMUMjSiti/O/QXo5aNn4DQ8ZOZvcWUEEpIhWwbQnXYLyLjsX7DwDfKpa45dgCm0NnE0mKGy/WSzXkxhVjP8n/9vc6Gxh1QUzpq8AJCcSS4PLTgXtABaWIJGxbgQkl41yMhaUi3zquwFOhM4lUQoPRVqyDlb7mLB27uH8tkjYycngR/6zj7zONSmaGY+MP/lkFpYgkanSBZ4E/Dp1DpNLajZGW9YLS+dyYq1ncn0usY+TsEnzVsFckFUvS4g8FpXZ5i4iIlCEqMjp0hooy/mXMYq4o9+WPM2zUOkZ+02AVoGIyg5xYI5QiIiL9Ypx89C+qTebcOHoRHyu3fdeB87f/A5iQcDRJkUhT3iIiIv3jxqtDZ6gENxaPXcxSru77a++G/ARGfsphHtmZBS0CLwF7gVZgJ9AGvhssBnYd5fVN4IM6/mgDwAaCD3EYbjCcGj5e0uGYg39WQSkiIlKec0IHSFgJ+NC4RdxUzos3MHySY99yODXhXElqBzYb9nvHn3f8BSN6zoi3x7Ajgh0xtj3CdpSIdgxmwI7jeXZfJQM9Do15hg7LYSMgP65EPA7sFWDjIvw4h+OAE+nYGT+0klnKMODgH1RQioiI9NHW5UzzUqbOm97p8K5xi1ldzos3MOKvHfsCMCzhXH3RCjzr8HQEz8TYU8AzETxj+O+gfXMzu1PXumw6tMFLW4GtcOQ+n79l+MhW7ASDE2Ki5gif6jAVOBkYW428nRkMPvhnFZQiIiJ9FJf4swz1vvkNOd46bgHr+/rCJzlxQBu7vubwV5UI1oOtQItDS4RvANsE1tJO9NuT2fq8ke0jW09g1w46jqv9RdfPdRSb+SlQOtmxqYZNBZ8KNAONlcjj0HDwzxn6eRAREak8LxBtzdECnBQ6S78536eJvy7n5Kp1jH5FhH/P8TcknGoPsB5YC/4bI1oHpRbItUxm+4sJ3yvz7ob88Qw70cm/LsZfb/gMsBnAqAQu//QUdpwAGqEUERHpk83G+VHtF5OtGAvGLOKfytnJvYFRpzvxdw6s7yuLw/PAbwzWga81ot/kiNedxM6nsz7SWE1nQxFebKFjOv2Wgx9fy/CTcuRmgL/eYQYd/+tTKyzvNPKpEUoREZE+2LKEHwFnhs5RNueJOMc7j1nIr8p5+XpGvAfsK0BTL1/yIvA48JjDYzn88XZKvzqZl7aVc3+pnN8w4sSI6DTDZwIzgWlH+nqH305lx4mgglJERKTXtlzDWVjH2cU1yN34cusg/vH4Kyhr5/J6Ri4FFh7hSzaC/9ywRx1+XcJ/fTI7nyorrQT3BGOOy1G8wLC3AxfQaVd3B394CjtPAxWUIiIiveKObV3KQ8AbQ2fpM2c9zt+N/SR3l3uJDYy42rFPvXzFjnWOP3PsUaf08ybsZyexc2cieSV11jJmaI7SJQ7vpmP0shG4cgo7rgcVlCIiIr2ydSn/x51vhM7RR23Ait0llp9UYH+5F1nPyHcCV4L9CPiR0fajyezeklhKqSm/5JjBTewfN41dTx78mApKERGRo9hVYFRbjifodDJIDbgnyvGh0Qt4InQQyT7t8hYRETmKthxfpFaKSaPF4Moxi/hu6ChSPzRCKSIicgSbr+FSM/5v6By9sBNYOqbE561AW+gwUl9UUIqIiBzGCwUmRjkeBUaEznIEe3C+3B6zYnyBraHDSH3SlLeIiEgPniwwIMpxC+ktJvcCXy6V+PSxBVJ3RrXUFxWUIiIiPRiS5/M4rw+dowd7gK/GESuOWcgLocOIgApKERGRbrYuZZ47fxM6RxfPufHFpiJfGV5ge+gwIp1pDaWIiEgnW5ZwCfBdIAqdBcDgMYzPji7y39psI2mlglJEROSAzUs5w5zbgEGBo7QC3zX42uhF3G2GB84jckQqKEVERIAXruE1kXEvMDxYCGctxr8Uc3zzuAXoJBqpGSooRUSk7m1ewmSDHwNjA9x+J/AdN745diH3aTRSapEKShERqWu/L3BiPsd9wIQq3na/OauI+K8dw1g9+XJaq3hvkcRpl7eIiNStbQUmxHnuwKtSTO7Dud2N7+cb+J9R89hVhXuKVIUKShERqUu/X87YuMhtOM2VuofDtshYCfygrcht4wvsrdS9RELSlLeIiNSd7dcxvNTOPcBrE750DDzqcCfGrWOn8GO7lFLC9xBJHY1QiohIXdmygqGlNm4juWLyWYM7YuO2YpH/1XnaUo9UUIqISN3wAo1b2/k+cFqZlygCvzT4iTsPxjEPHlNgU4IRRWqSCkoREakL7tjWpfwrztm9fY0ZT3nMY248ZPDj0gAeOfYT7KlkTpFapIJSRETqwtalXA286zCf3gX8GuMxYn7pEb/O53lMO7FFekcFpYiIZN7mAkMcxprxVY/ZHhnPuvG0G88MMJ4ZtoBtoTOKiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiIiEjZLHQA6b0TZxYGxIObBvb3OoNKDI9zRP25hpWKDcVcfkhfX+dubXnzPf25d28VIysWY3+pGveKGlr9qe8VdlbjXlJZ0+cWGl/a2zS488fykQ3Nx54/+PdSkYg8ww95YewDcpEd8vPpznC3P/ysmZOPjaGdv8bwQWBNh6bwppZV85eAeb//QSJHMWPGTQ1bjt3e4+/zAVFDjrh9WE+f6/HnAIC4NUe0tzf33g87hu5pbX/8nsLuvmSW9El9QTl9ZmFIa9OAE6K8H1dy8mYM9ZiIqOOb2GAkAB4Px4kwG2LuDW7RIPCuv6Qjx3r45qfJYFDXDzo2xPCGLh82YEQf/xnlvEayaUe3jzgxxq7uX2ol8Bd7uMaLDiWD/cA+wM19p1u0x9yfd/i3ljULtiQdPAkHi7WBUXGEk2sqxTYY4mHEDLAoGkIcD/Uoyr/8cw24+xDzgz+H1tRRgIFHZvghP1dDHfIAkfkA95eLuwg6v+n5MLBcp9eNJIXc7dyNa+bfFTqHHN34iwuDhnh+ZDHOj8pHxYF4btjB9yvzuCG2aAgxjRYxGLyJ2F9+v3FjeOR/eOhws4HAgJf/DjngkILOOv6e6/SBATgDD/2Sbu85jcBg0m0P8IwZv/OYH8ft0Q2b7pzXw+9GSaP80b+k8ppnFYZFUeNrYvdX49Zs+AmOnQCc0GqMhpjYD1S/DmYd//dQ9nJ57D1/AWB9qqCtx2uI9Ev34qXjm3J09y89/Pdf1+/jg9/zbsR47lv9yFeW6XMLjcWXcifFuagZt0k4x8dmYwwfgzMaszHgx7TuYVgjTqmUO/DvcF7+2fWOH27zQ//dBgd+6Dv4yz/o3XMc/Cr3I/2kp/45GoAI/wCggjKgE2cWBuQHNk6MnRPNbKJFnOjuJxkcA4x0GGkwihJNMRARE8cRL3+XesefzA+8gR38nu30/WzAkb5de/Xdmp23qsHANHemYZwbNZSagHmhQ0nvBCkoT3xrYUS+vel8PJ4Jdg4wNfYD7yrW6Q1DRPrIV7asuerZSt7h1RdcP3hvY/GNuL8ZtzeBT2vdwyuJyP3hDbPTA9nBd1bpEzdmUShEFApx6Cz1YsrFnxlT8vYzreRvxjgdeD3QEP2hOjzk3UnvVBUWWY9T7ZJOVSsom2fd2ET00lz36B3W5ud1TEfrx1EkQR5FvrwSF5520bUnFnP8Be5v20v7DOKDvztUKFbQ8OYHBpzcAo+HDpJlE+beMLBp7763RNhfx6W2Cw1yemtKCefp0BGk9ypeUE6/sDCqLWq4wm333+I2VtPIIhXzr+t/uOjhpC429ZIVQ0vF4rtxe1fR/E2aOqg+y/mrUUFZESddsuyYqGhX2J79l4EN1ztT+jj2i9AZpPcqVlBOn1tobN3d+I+txifQhhSRynK2AfOTuNRJs5eekLPcR0rF0t+ADVcZGU5sTAydIWsmXbD0eMtHV1HkfUC/u2ZIxZS8zR4IHUJ6ryIF5aQ5185o3eP/hnFKJa4vIocy88s3rF7Yr53dky68ttnyXsD5C9xTsWGv3pkzJXSGrJg+szCkbWDDPDe7AhWS6ef8Uju8a0vibxrNs5b/Pe6fo6NFgYhU3i0bVi8se2d386zCMKNxqZtfhuvnNl18UugEWTBp1vK37je+ZHBc6CzSS8Y9oSNI3yRXUM69OTdpz4YvAH+X2DVF5Giezzfx9+W+ePLsZec79jWHE5IMJYnRf5d+GH9xYdDAUsNnTe9LtcftttARpG+SKSjn3pxr3rPxG2B/lcj1RKQ3ipFx6drvLtjW51fOvTnXvHvDMseuRO0W0uyYji6FOjGnr06avfSEXCn6IfCq0Fmkz/btH9J0X+gQ0jf9On6vg1tHMekqJkWq66r1qxb0+ZfutLctH928p+V2zK5CxWTaNUy64DNjQ4eoNSddtOzVOaIfo2KyVt377C1X7AsdQvqm3wVl8+zln1QxKVJlxv9rWT3/n/r6spNmLz2h2Mr9wDkVSCUVkGssad1fH0yefd2bc5HdC7widBYpj+G3hs4gfdevgnLynOVvB7s6qTAi0itridve39dp0MlzVpycI7oPmFahXFIBsZeODZ2hVkycfd0pTvwD1KqupllO6ydrUdkF5dSLl5zkztfRlJlINe3B+bOWNYUX+/KiSRde2+xeuh04vkK5pELMbXzoDLVg0oXXNhvxbcDw0FmkX55ev3LB2tAhpO/KKyjn3pwrlXLfRk+BIlXl5n/TsmbBE315TfOsFRPI+R3AhArFkgpyV6ubo5l+YWGU5X2N2gLVPoc1oTNIecoqKCfvbvkH4NSEs4jIkV23cdXCb/flBeMvLgzCSisNTqxQJqkwA015H8ncm3Otucb/wmkOHUUS4Gj9ZI3qc0E59aIlU934VCXCiMhh3dKyev6Cvr3EbVCp8RvAaysRSKrDzTXlfQST9m74JHBR6BySiHZvj+4OHULK0+eCshTlbgQGVCCLiPTsob25tvf0eRPO7OWXA3MrE0mqJ9I07mE0z1l+ibktCp1DkuHwoI5brF19KignzVr+VuCCCmURka6MFpyLn1tZ2NuXlzVfeN10x66rVCypJteUdw+m/OnSV+D8G9oYmhkGq0NnkPL1uqBsnnVjkxk3VDKMiBziWeLc2S1rFmzp06sKhYgo/iaaScgKTXl34xbH0b8Co0InkeSo/2Rt63VB6ez5AHBSBbOIyB9sycWl81rWXPVsX1/Y/EjjezFeX4lQEsSAqZesGBo6RJpMmrP8w2i2LFuc5zasXvDL0DGkfL0qKCfMvWEg5n3cECAiZXG2kfOL1t26eF1fXzp9ZmEIztJKxJJwiq3xMaEzpEXzrOV/ZG4rQueQhJmv1pn1ta1XBeXAPfs+rP5eIlXxQmzR2S0rF/6snBe3Dm56N2ozkzlRzkeHzpAKc2/OmfENYGDoKJIsd1sVOoP0z1ELyqmXrBjqcGU1wojUud/l4tJZm1bPe6y8l7vh/qFkI0kauKERSmDS7g0fc3hj6BySuNYB+9ruDB1C+ueoBWVcLH0UbEw1wojUK4encrm0uqg8AAAgAElEQVTSmeVMcx/UPOvaNwN/lGAsSYvY6/538JQ51040M/VAzqYfP35PYXfoENI/RywoXznn2pEO/1itMCJ1ar3norPWrVz8ZH8uYvhfJhVIUsZsXOgIYbnF7l8BBodOIslzd7ULyoAjFpSN+EeA4VXKIlJ/nAe82HDmppXznu7PZZpn3djkZmpinln1XVBOmnPtu4HzQ+eQysjltX4yCw5bUHbsFvWPVDOMSD0x59vFfW3nbLz9E5v7ey3P7ZkNjEwglqRS/U55N89aPtZcPZAzbOP6lQvWhg4h/Zc/3CdaBzV8QGsnRSqiaM7CDWvmX59UmwyL/R1JXEdSq3435RgrUAPzzHLQ6GRG9DhCOX1uoRHsH6odRqQOPBMZ52xYs+DTSRWTzbNubAIuSuJaklJOXT7cT5q1/E+A94TOIZUTmd8eOoMko8eCsnVP07uBV1Q5i0iWOcbX4rbolPWrFtyX6IVtz9nAsCSvKSlTh22DZs4s5M34IjqrO8v27Rs08K7QISQZ3ae8596cY2/LVahfvUgynJ8BV7SsXnBvhW7w1spcV1Kk7kYonx3c+GGc14TOIZXj2F3P3nLFvtA5JBndRign79l4KU5ziDAiGfOEYX/Zsmb+G1rWVKiYLBQi4JKKXFvSpGniedfVTceNky9cdhyOek5mnLlr/WSGdBmhdINr54WJIpIJJTNui2P/wsY1C27tWCc5v2I3a34ofyqmY1HrwoD2ccCu0DGqoT1nn0HLODIvzkcqKDPkkIKyec7yC9zt1aHCiNSoNpyfEPH9Us7/+8kfLHyh48MLq3Br03R3nYhKNhrYEDpHpU2as+xsnHeGziEVt7a//XclXQ4doYzt41r+LHJUL+E86sbDZvy4aU/bXcGODTN7S5D7StU50bGhM1TazJmF/LNuN6KNONlnamaeNS8XlM2zlv8RxgUhw4ikyF7w3+L2NBFPm/sGsN/EJVu7cdikJ7nl0lLogFMuXj4tLjEtdA6pDosYHTpDpT0zsOGjBq8KnUMqz4lVUGbMywWlR/5qc7sDbBj4MGAAgENkhx6/OAAYWOWcIr21F2gFdgPtdKw5ix12GMTALsxesti3O+wws+2xsyOyeHsJ35G33PY4bt3asqbwYsh/RG/Esb0FtWOoH3G2WwedfOGy49rNrg6dQ6pi14jnx9wfOoQk6+WCcuOqhd8Gvp3ERV8559o+HwHXGEeDoyhu7O+949gHeGR9LnhzVsrhuZcXgZecvBlD/3BhGj1iMEDkPiA2G2pxPJTIRuEcB0wEpnGU89Hrl/0E4ifMid0o4rwEQGR7wVoBzH1nbOaRe7ub7QaIS74nn7M2gBLsAHC3trz5HoBSe353e0OxPR7UtL/e2k8Y8Z+6ZgbrydjQASpJG3Hqyu2PPnpZe+gQkqzDHr3YH0+vmr+jjJeV85pUOfnCZce15+yXZPwXfzninL1z08qFWoCdkOkXFka1up0eOodUUZTd3yuTZ1/3ZifWRpy6YTodJ4M0mpagXY3tu4A+j85mn/9Gu/mS1ZZruAjIhc4hVeSMCx2hEmbOLOSdWCfi1A/P5aPVoUNI8lRQJmhgselNVGjUt6aZfnkkzbE5oTNI1WXytJxnBzd+GG3EqR/Oz9f94KrnQseQ5KmgTJAZZ4bOkEbazZewjtNxzgsdQ6rLIXNtg06c/eljdSJOffFIp+NklQrKBJnFepPvTrv5Ejb54cY3QjanP+XwjOy1DcpT/DTaiFNXIlf/yaxSQZmQqZesGOpup4XOkULazZew2FzT3fWpsZwOGmk1Zc7yM4G/Cp1DqmrzhlPbHgkdQipDBWVCSu3tM4GG0DnSxnCtn0yYuc0OnUHCyLtnYqf3zJmFfOx8Hm3EqS/GHRQKcegYUhkqKBNiROeHzpBCHuXzag+RoEkXXD8OeF3oHBKGWZyJjTm/G9T4QeA1oXNIdZlrgCHLVFAmxI1zQ2dIHe3mS15D+yz0c1u/LFfzp+WcOPvTxzraiFOHSo2l9ltDh5DK0RtTAiZefN0rgT8KnSNttJsveeZkef1kybHrIXqrO28D+8/QgdLG4trfmNPgxeuAEaFzJMwd+4Y7ZwDvDh0mjcz8gcdvK2wPnUMqRz0TE5ArxbN0onJ32s2XsLk359jTkt2lFc7nN66Zf2Wnj3xv0uzlJxhqx3WQ4TXdOmjiRded4RZnreDaa+aXtqxasArgxJmFR/ODGr+BBmwO4Xo/yDx9wyfA4aLQGVJIu/kSNvGlTaeTvZGdg9rifPRPXT9o0BIiTFrFWO2uoZx7cy6K4qxtxHGMd25YtfDlYik/pOlN6L21m5hIBWXG6Zu+n6bPLTRiajLdjXbzJS6K4gxPd9v/9nw8pz9f/Sxp5jXbf3TS3g0fBF4bOkeSzP1rLasW/OCQj5U0ot6DZzatnvdY6BBSWSoo+2n/3oY/wRkSOkfaaDdfRWS2oDS858X6ZpurHCXtarJtUPOs5WPN7ZrQORK2pTWK5nX7aORnBciScn5b6ARSeSoo+8mIMvsm3w/azZewKX+69BXAKaFzVIp7qcfpMHN7odpZ0sxqtKA0uJ7MLdewBU+vmr+j80dmzLipwZ3TQyVKK62frA8qKPvL/YLQEdJGu/mSF8e5WaEzVNDGljWLN/b0iVIca4TyUDXXNqj5T5ef7pa1nc/2YMvqeV/v+tEdY3ecBgwKECjNWgfsa7szdAipPBWU/XCgXVBmR43KpafRSsjucYsOh/1+icx+X80sNaC22gbNvTlHzJfI1kackhsfBuvW3CNnJW3Q7O7ex+8p7A4dQipPBWU/WOz65dGTnOt0nAQ1z7qxKcsbv+zIDyBbqhakNjRMe9vymikqm/duvIyMbcTB+OrGVfMf7flzphmrLuwID4ySLSoo+8HcszwNWR7nuZaVC34eOkaWOHuyvPFrX3Ff648O98mWNfO3AsUq5kk931eqidZBzbOWj8V9WegcCduSb2RxT5+YcvFnxjjMqHagtDvc+mjJHhWUZZox46aGLI8alc18dU9TQVI+i5gdOkOlOHbXU/cU9h/+K8yBrVULVAPaaaiNjTmRZfBEHFuw9rsLtvX0GS+1XoDeUw9ltBxufbRkj775y7Tz2K1nZHjUqGxaP1kBnt31k+a9OJ7T0XnwneRycep7UTbPWvom3N8bOkfCHmo5tfVfD/tZ13R3V+6ofVwdUUFZpii2zI4a9UO7dvMla8qcaycC00LnqJS825qjfpFphLKz1J+WM/fmHBZ9gWxtxIlj4g8f/rAGN4fsHotapqOsj5aMUUFZJjcuDJ0hhe7Xbr5kxbFn+fts7dpb5z91tC8yRzu9O4nidLcOat7d8rdkbS2hcdOm1Yt+erhPn3TR8lMwxlczUuoZu2HwvaFjSPWooCyD2gX1zHszfSl94maZne7Gej16oZ3encTmqR2hbJ61fCywJHSORDnbDrcR56C8mTp+dOXc2bLm8tbQMaR6VFCWwYpxlkeNypbLa3ojSRPm3jDQ8HNC56gUj3u3vspNI5SdGRwXOsNhmS/HaqxX5tGYzTvcRpyXRWj9ZDd6P6g3KijLYJbdXbf9sHH9ygVrQ4fIkgG7W88EBobOURHGbmPwj3v51Rqh7MzTefzi5NnLTwN7X+gcSTJ45IgbcYDpMwtD3DmjWplqRRSVjr4+WjJFBWUfzZhxUwNwbugc6eO3hU6QNW7Z3d3dl+kww5+vdJxa4mbpG6EsFCKHL5Ct95S4RPzBw2/E6dA6MH820FSlTLXisfU/XPS70CGkurL0w18VO4/degYwNHSOtDFTe4ikZXskvPfTYRbldJ53J4anboRy8sNNfwu8IXSOJDl87UgbcV4WRTrgojtNd9chFZR9ZETZHTUq3759gwbeFTpEljTPWjIJpzl0jkrxYqnXI9rtUUkjlIcaNX1uoTF0iIOmvW35aHdfGjpHopxtDU0s7OXXZvjBrzxxHKmgrEMqKPvKM93GpSyO3fXsLVfsC50jS8xyWX5weWzj7Yue6e0XP9k0eStwxGnHerN/Vz41rYOKbVybtY04Hh3+RJzOply8fBpwQhUi1ZLtm4ZOfCB0CKk+FZR9cKBd0KtC50ibXp12In3iZLoNSd++X265tISOXzyE59PRi3Li7KVvwHl/6BwJ++nGN7b+S2++MC5pdLIHtx74mZU6o4KyD6JinOVRo34o3R46QZZMmHvDQPCZoXNUihGVs/vzhcSD1LI4Cn/8YqEQRURfJlvvI3Ec21E34nSiGasuDA0w1Kss/SKohiyPGpVrbcuaxRtDh8iSgXv3nUNW2wXBrmEvjOzzdJiroDxEZH5s6AyTHmp8PxnbiIPx9U23zn+kN186fWZhCHBWhRPVmtjd7ggdQsJQQdlLzbNubCIis02my9b7006kt2LL8qjH7Y8+ell7X19kpoLyEBYFnfKe9rblow2uDZkhcR0n4szv7Ze3DW44C7UL6uqRljUL1De2Tqmg7LU9Z+EMCZ0ibZxYBWXCPMPtggwvr72Um1oHdeYedMq7vdWXZm0jjpkt6s1GnIOcDB+LWiZzDTDUMxWUvWXa3d2NsXvE82PuDx0jS6ZetGQqMCl0jgrxKJ8va72tuZqbd2YQbMp74uylbzDsb0Pdv0J+uuHU1q/26RWuJVBdeV4DDPVMBWXvZXbUqGzOneVMX8rhxVEuuw8uzs/X/eCq58p6rblGKDtxI8wIZcdGnMydiGPw4T5sxDnYLuikCmaqPc5zLSsX/Dx0DAknS78UKqZ51pJJwLTQOdJH0xtJc8jsNJpH5e/+jIk0QnmoICOUzQ83vQ84LcS9K8f/dcPqBQ/15RVxyXU6Tlfmq8E8dAwJRwVlb0T57I4alc9z+UjHLSZo/MWFQWR416iXcuW3lzK00P9QVT9+cdrblo8GX17t+1aUsy3KNfV6I84fZLpPbFnMrJx2YJIhKih7wXW0Vnf9mb6UHg2OG84mu7tG+3V6Rj4X/T7JMBkwdsaMmxqqecNiG0sIUMhW2OL1K/+xT03zX33B9YPJ8INfmdpLrdH/hg4hYamgPIoJc28YaLjaBXVlqJl5wjK+a7Rfp2cM+d0IjVB2sXfM1jHVulfzxctej5O5jTgtQ5r7thEH2NfQNpPsPviV6/5Nd87bFTqEhKWC8igG7N33ZrLbZLpscRxp/WTSsr1r9Nb+vLhj85fr+MVO2hs5rjp3cqMUfRHIVed+VRHj8UfKecjJ+INfWVzH7woqKI/K3TTd3V2/pi+lu4zvGo292HBb/y9jKig78VJ1jl9snrX8veBvqsa9qsf/tWXNogfLe6mOW+wql9cGTVFBeVSW4V23/dCv6UvprlT0LH+fPbLx9k8k0fZHa3Y7iYgrvtP7xLcWRmB2XaXvU2XbcVtQzgsPPPhNTDhPrdu4fuWCtaFDSHgqKI9g0oXXNpPdJtPlc9Pu7oSZ2QWhM1ROYrs/tY7yUBXfIJNva1hWjftUlbOo3OMB4zjTy1LK4qDRSQFUUB5RlHNNd3cXeyl/R+gQWTJ9ZmEIGd41ani/1k8e5Jh6UXbiRBVdQzl59rLXgl1WyXtUnfOzcjbidHq9+k92oeMW5SAVlEfg6jXWk6SmL+WA1sGN55DdXaObN5za9kgSFzJ4IYnrZIZV8jxvN3f7ElnbiEP8oXKX62S9T2xZjN0w+N7QMSQdVFAeRvOsG5vAZ4bOkTZ6Gq2IzD64mLOmL0faHfFa6Dzvztw5plLXnjTn2ndjnF6p64fRj404ZL5PbHmcO1vWXN4aOoakgwrKw4j9pTNQu6BuPB+roEyaZ3jjl3li/UpjV0HZmVGZgvLEtxZGmHN9Ja4djLMt32Tz+ncJtQvqTgMM8gcqKA8jMs4PnSGFXmhZueDnoUNkSfOF100HXhk6R4WUGkvtiayfBCCKtNTiUBUpKBtaG68hYxtxHOav/e6Cbf28SIY3zpVFx+/KIVRQHo6Zeo11Yc6tYB46R5Z4VMrudLf5A4/fVtie1PUai7HaBh1qDHNvTnSN4+TZy17rxgeTvGZ49uDG09q+3p8rHGgXpI4fnRg8puN3pTMVlD2YdMH144DXhM6RNh5peiNpZtmdRouJkhudBI5pbd8C6IHmD6KTWjckePyim2NfIFsbcUrk4g/1dx2vlzQ62ZWDRiflECooexDl284DLHSOlGmPW03ndyfoQLugPwmdo1IsipPqPwnAPfcUiqgX5SHyxeSOX5w8+9r3kL3vx6+0rFz4s/5exHXARTc6fle6UkHZAyfSdHd392+6c96u0CGyZP/AxvOAxtA5KsJ5rkLrbdU66FCJrHWc9rblox1WJHGtFNlcbGxb1N+LTJh7w0DgzQnkyRIdvyvdqKDsift5oSOkkEYnE2YR2W2cb766EuttXQXlIRxL5PjF9lYydyKOu3/iqe8Vdvb3OgP37jsHGJBApCzR8bvSjQrKLibOvu4UjPGhc6RNjKY3EudkdyTc7bZKXNbg95W4bq1y739z88mzl59m8IEk8qSFw30b1yz4j0Su5abTcbowXO8H0o0Kyi4iYrUL6u7pTavnPRY6RJZMnH3dKWS3XVB73B5V5nhOM7UO6sSifh6/OPfmnDtfIlvvBUUn+lCCI+SZ7cRQpmTbgUlmZOmXSFJUUHZl6Gk0YTmPszzqUbn1tu5qU9KJxd6vXd6Tdm/8e4zXJ5UnJW5M6gF46kVLpqJ2QYdIuh2YZIcKyk5OnFkYgM5q7S5OdreugFt2Rz3cKzgdZq4Ryk68H8tzTpz96WPNfEmSeVLgd3jbp5K6WBzlsrsspUyu43flMFRQdtI4uEnHLXbX2rSveHfoEFky8bzrhgNnhM5RKYZV7AEkItLxi4cqeyNN3oqfAUYkmCU4N//HljWFFxO7ntoFdaP19HI4Kig7Kblruru7ex+/p7A7dIgsyTXF5wINoXNUyNMtaxY8UamLl4hVUB6qrF3ezX967Uycv0w6TGB3bVy18NtJXexAu6Azk7peRmg9vRyWCspODJ2G0JWh9ZNJc/fsrp+s8Hpbi01tgw41BrxPhzDMmHFTA3H8JbJ1eENblONDSV7wQLsgzVh1pvX0cgQqKA/QcYs9cy/pF0jistuGpNLtRFrWzN8KtFfyHjUmP+mCz/Rp2nvXsduvADu5UoECuWH9ygVrk7ygY5ld59wP2t0th6WC8gDLFc8nW0/sSdjYsmbxxtAhsuRAu6BXhM5RIfv2DRp4V2VvYY7r+MVDNLT1uhflxIuveyXuiysZJ4Cn9+bakt9c5GT2wa9MrU172ir88y21TAXlQabp7q5c092Ji4izvMj/vmdvuWJfxe9iam7emfXhASVXLH0OGFzBOFXnkX3suZWFvUlec+Ls5VNQu6CutJ5ejkgF5UE6brEbU3uISsjsg0u11tua6fjFzjy2XjXInzxn2Rw3e1ul81STGas3/nD+d5O+bk7NzLvReno5GhWUwKQ5y16l4xa7MHbD4HtDx8iSrLcLqtZ6W8e007szO/qJSyfOLAxwtxurEaeK9sdF+2glLuzO7Epct5ZpPb0cjQpKwFyn43TjdnfLmstbQ8fIEhvg55DddkFrq7be1mONUHZiHH2EMjeocSEwsQpxqshXbLxtfkvSV50w94aBGG9O+ro1rno/31KzVFACEKmg7Mpdp+MkzOI4u6MeXr3dn4amvA/hfsSCsnnW8j8yuLJacapkU3Fv+3WVuLDaBfXAtPxJjq7uC8rmWTc2geu4xS7ivE5DSF6W25BU7nScrhxtyjnEkaa8C4UIs68BjdULVHlmfvlT9xT2V+LasVtm1zmXy4n1fiBHVfcFZewvnQEMCp0jZR7btHLe06FDZMmBdkETQueoiGqvt40ined9qAkUCj3+Lm9+qPEy8D+udqAK+96GVQsrVuCYjlvsateI58fcHzqEpF/dF5SRaf1kD/Q0mrDIPMvT3XdWc71trljUCOWhGqc92NRtlHLKny59BUZFpoUD2lsi/lilLj7l4uXTULugrm5/9NHLdJiAHFXdF5SYpje6iey20BEyx/3C0BEqxa16090ArQNKWkPZRSnnr+/6sTi2LwLDAsSpIFv65OpFv63U1b2U3Z/TcrmOW5RequuCcuolK8YDrw2dI2V2Df/9qB+HDpElmW8XFFlVj2N76nuFnUBF1s/Vqtg5rfPfJ8++9s/A3hIqTyU4tg4ffEOF75HdmYTyxLQ3aIOm9EpdF5TFUknHLXan6Y2EWUN8NtltFxRkva2DelF2YsbbD/558pwVJzv+5ZB5KiFnfLiSSyumzywMAbRBsxODRzfe/gmtWZZeyYcOEJK5Fl93pemN5Jn5nAw/twT5fjHYDJwY4t6p5DRPmnPtQoP17qUbgbGhIyXs5vWr5t9ZyRu0DhpwLsRNlbxHrYnNqzr7ILWtfgvKuTfn2NOiDTmH8jinXyDJs8yuy4rjYO2lngt039Qy96WhM1SEsTuy+IrK3ye+EK/4XWpKpON3pQ/qdsp74kubTgdGhM6RKs7Pn/zBQm14SNCBdkHHh85RIbteuX//gyFubO6ahqsTHnth/Q8X/a7yN9KMVRebN5za9kjoEFI76ragjKJYvzy68Mj1NJqwnMezQmeooNvvuadQDHFjNzU3rxO/Pn5f+z9X+iYHHvyOeoRlPTFnDYVCHDqH1I66LShx1C6oC01vJM+NzJ6OE3S9rZtG0rPPjehD1XhoyfiDX1k80vuB9E1dFpRTL1kxHuN1oXOkjKY3EtY8qzCM7LYLCtpOxCKd510H/nPD6nk/qsaNsvzgV6b2uNVuDx1CaktdFpRxsXQhGd52W6Y7Nb2RLKfxHLLbLuhnIduJaMo783YWyV9ZjRtlvU9sme7fdOe8XaFDSG2py4LSQdMbXRhaP5m0jnZB2eTmYZsdl0ralJNh7rb4qdVXVqXXaNTkF5DdB7+yuOv9QPqu7grKmTMLedD6yS5KjaV2tQtKXHaP9Qy93nb/kMFqG5Rdv9g4ZFI1G7NruruLXF7rJ6Xv6q6gfHrAgDcBw0PnSBMzf+Dx2wrbQ+fIkozvGg2+3vbZW67YB7wUMoNUhOPx33PLpaUq3c6IXQXloTauX7lgbegQUnvqrqBUu6Du3KPVoTNkTY5Sht+k7NZ0rLc1Hb+YOf71ljWLqtbbtPni5a/DGF+t+9UCD3T6ldS+uiso0fRGd7n4ttARssaxzK7TNdLx/eK4Csps2Ynbgmre0IqRBhi6sbDro6Vm1VVBOfWSFeOB14TOkSrOcy0rF/w8dIwsmXrJiqFkd9doatbbmql1UKaYLWxZs2BLVe8ZxZld51ymfa2Dm+4NHUJqU10VlKVSaRZqF3Qo89VgOsE2QcX20rlkdNdomtbbWqzWQRnyi5ZBk26q5g2nX1gY5W6nV/OeaefYXQfWJ4v0WV0VlDgXho6QNq7TcRJnEbNDZ6iUdH2/WHVHs6RSPDIur95GnA5tuYaLgFw175l2pnZB0g91U1DOmHFTA2oX1FW70XZX6BCZk+UHF7dUrJ8E8MjVOigDzPnm+lUL7qv2fd0ssw9+5SvpdBwpW90UlDuP3XoGahfU1f0tawovhg6RJZluF+Q817Jm3i9Cx3hZHKu5ee17sd3y86p+10Ihwjm/6vdNMYenWtYs3hg6h9SuuikoDe3m60qnISTPLM7u6GTK1tvGntMu75rnhWqdiNPZ5Icb3wiMq/Z908zwO0NnkNpWNwUlnt1j8Mql0xCSZ57d9ZNm6WonYnFJBWVt+/WEve2fD3HjOMPHopbLjf8NnUFqW10UlBMvvu6VwLTQOVLmSZ2GkKzpMwtDyG67oGKpNUrVG86A4UW1DaphkdnH77mnUAxybzf1Iz5UbLGl6udbak9dFJRRUafjdGOkopdgluwf2Hge2W0X9OCmO+ftCp2js8dvKbThbAudQ8py6/pV84NMsU664PpxDjNC3DvFflX1HqCSOXVRULqZCsouDK2fTFqEZ/Z0nJgonQ8g5tqYU3tKMdGVwe7e0D6LOnnv6y3H7gidQWpf5n+oJsy9YaDh54TOkTL79g0aqHZBCXPL7jSaeyk17YIOZWpuXmvM/n3T6nmPBbu9owGG7vR+IP2W+YJy4N595wADQ+dIEzPu1mkIycp0uyDYsunU4s9Ch+iJo+MXa8zeXC5aHOzuc2/OAecGu386te7Ltf4odAipfZkvKN0ts9OQZXNSOtpUu8xLWW6afweFQhw6RE8M007vGuLmn133g6uCNaSf+NKm04FRoe6fSs4Dz60s7A0dQ2pf5gtKILPTkOVyL2n9ZMIs2+t007l+EjB3FZS144V8Ln99yABRpA2aPdD6SUlEpgvKKRcvnwZMCp0jXWyDTkNI1oF2QX8SOkeFeCnv6T2OTZtyaofzqXU/uOqlwClUUHZh6j8pCcl0QVkqqnltV46nqjl1FhxoF9QYOkdFOD9/8gcLU7tO0T3Sed61Yf2EfW1fCxlg6iUrxgOvCpkhhXZuGNz809AhJBsyXVBmfBqyLOY6HSdxluFlFUZ6RycBM53nXQsMWxCqiflBpWI8G7CQGVLoHm65tBQ6hGRDZgvKieddN5zsnlpSrn37hzTdFzpE1hhkd+OXp3f9JEAxj9oGpd9DG1bP+5/QIUAzVt3p/G5JTmYLSmuIzyajp5aUy7G71C4oWRlvF/Ti8M2jfxI6xJE8+fr2LUDQkS85MiO6EsxDZpgx46YGjPNCZkijKKfjFiU52S0oTU+jXZmxOnSGrMl4u6C7Hn30svbQIY6oo52Rdnqnln9/w+p5wXsc7jx26xk4Q0LnSJln169csDZ0CMmOjBaUbrjNDp0ideKi+k8mLNPrdD3d6yc70cacNDJ2e9E/EjoGgBFl9+e0TOba3S3JymRB2Xzx8tdhjA+dI2XWql1Qsg60C/rj0DkqJe9WEx0BHJ4NnUG6M/dFG29f9EzoHAC4Zqy68kjrJyVZmSworain0W5SvrmiFrUNapwJNKmCPdAAAAc+SURBVIXOUQmOrVt76/ynQufojcj5XegM0s1PNwye/IXQIQBOmr30BGBa6Bxp01DUCKUkK5MFpWe5jUvZamO0qZY4nt3d3XjNLI9w05R3yhRx+9u0tKPJeaTlT10Zj//mtoXqkCCJylxBOf3Cwijw00LnSBVjNwy+N3SM7LELQyeolMhSfDpOF+6ugjJFHPunljXzfx46x0Ge5XXOZXKtn5QKyFxB2ZZruAjIhc6RJu52b8uay1tD58iSSRde20x2j/Vs3Tdo4F2hQ/SWa8o7TX46YHDrotAhDpow94aBhp8TOkfamMdaPymJy1xB6ehptCtz1+k4CbNcnNnRSeBHtdSvNN9gKijTYVcuV7r08VsKbaGDHDRgd+uZwMDQOVKmCEXNWEnislVQzr05B1o/2VXJYvWfTJgTZXb9pHvtrJ8EiIttmvJOAcPev27l4idD5+jM1Y+4B/Zwy5rCi6FTSPZkqqCc+NKm04FRoXOkzNonVy/6begQWdI868YmMz8rdI6KiaipgrJlTeHFjnXCEtAXN6ye/53QIboyUEHZlatdkFRGpgpKy2X61JLymGm6O2Gxv5TlUzee3bhq4a9Dh+gz107vgB7Ch/xD6BBdTZy9fArZXedcttijO0JnkGzKVkEZa/1kVxHqP5k0i6IMr5/0Wv1+UXPzMB5rKrXNTuOmv5yWP/Vkx6ahEx8IHUKyKTMF5dRLVozHeF3oHKli7I7jwfeFjpE1hmf3jcqimmkXdCjTCGX1PYvnZj9+W2F76CA9cU139+TOtPQHlezJTEFZai9eBFjoHKni3JnGkYNaNvWSFeOBU0LnqJBSG9Tk+ipHvSirbFdMNLtlzVWpHBk+cCxqdtc5l8lAB1xIxWSmoMSy22S6bE6Njjal14EHl4yyh55eNX9H6BTliFRQVtOLRnTJptXzHgsd5HDaBjecRUaPRe0Hj/K5mtpwJ7UlGwVlR7ug80LHSJs4H2lDTtIy/OBiNX3ee5TKkbIMegG3mRtWz/tR6CBHon7EPfrVuh9cpQcvqZhMFJTNu9e/EbUL6urXm1bOezp0iEzJ+oNLDR232JVHGqGsNIenvGRnpOlYxcNyrZ/sgaa7paIyUVBiucyOGpXNTFMbCWve13Iq2X1w2b7h1LZHQocoVymOVVBW1i8bS/7HG2+b3xI6yNE0X3jddOCVoXOkTqT3BKmsbBSUag/RjRNrujtppex+nzncRqEQh85RrlEvjH0O0O7VSjC+XNzb9qbf3Lbw/7d3P79RVXEUwM+5d0ZqY7VpWKEbCejCEEnEBSGQYBQIiW4AF/wDJJq4MDFpqotZIfwJxv/AJkBSWhKiogSC0czChcSUtiI11sCCNjNOZ/rm3eOigWTqUKCd9r57uZ/dzJuZd2bey+T77rs/5nxHeSIl957vCAW08NLc0HXfIZK4BV9QvnG4MgTobd85CoWoD/6z9ZrvGNEh4m0JZ1ir46xUrZ7KBMz6zhGZ+ySOTY2PfHT7h0rTd5gnJr7jO0Lx6Ntq9VTmO0USt+ALypYtvwvA+s5RKEL68+ix5QsX7PGdY4OoZG3wq2cQmPGdISJXnDW7b42PnPMd5Kmc+MYC2u87RtGIHPOdIYlfyXeAdaM5DMl3ioJJyy32WrNUPkRFe+ESx+hPYhpCap1an5uQG5669EWQBchri5NvOZhB3zkKxiErpwE5yYYLvoUSUry3IdfIWQY7WreojGO0/ScRy+hPpRbKdbgH8uNXGktvhlpMAoCTPeg7Q/Hwp+nLn931nSKJX9AtlNuPntkFuJd95yiYNF1Qz4nCl9F29FfA0wV10kxaLOvpkLom4Cu4gdGpiU9ahR/C/ThOB9MpsJKCvUBIwhJ0QUnlh8D079FBYS6dV2SvHjm9C+Q23zk2SC2WAVy5w+82/Hsum+FPCOcBfH1r4vObvsP0TKVi8Av2IfWA6uCQFrhINkfYBWXEq5asnfved4LYWMN4JzMHvotlANcfAzt/29GYqkN4wXeWAhGAWUpVGV41NFcmLw7/6jvURtj+83M7gHTsV5gp8hKZSVyCLSi3vV/pR44DvnMUTBto/+g7RHSIvbG2ehARTXY8+mGuo6fHCBwHUPYdp0cEYB5ABqAOYhFCE0JNRJvAfQFtI9Uc2TTAPRFzcO4uydl/bTb591il4fk7bAoD7U5dHjoJuOg7Q/LsCLagNH0vSo3WPilnibZjVJ/gtgimf62fTcGRWFjLe9s5m7RaXO01kmolsv2o7SaHa9jV9+/6tzT/Gv101f0kPSLcgDQNACTrIru26FFYcMT/Jwd3Eg3nu3400bZC7RE7buVg12LAwDQI1+q2zTnVlkz38+vO+PA8wEjLY2B6YuQkgJOvf3B2YKmdDZVprXPqk+HzAKDcDZasoaQ+cfm59aLcPGm6/qZaLvQeHgs6LRrDh3M65lmeZWVbf/DYlFu6faHS9VxJHkO6A2OGfccoErrUfzLZPP8BxASTiv++tmkAAAAASUVORK5CYII='
               },
               styles: {
                OFL_title: {
                   color: '#AAB7B8',
                   fontSize: 10,
                   bold: true,
                   alignment: 'left',
                   margin: [35, 20, 0, 0],
                   lineHeight: 1,
                 },
                 rujStyle: {
                  color: 'black',
                  fontSize: 12,
                  bold: true,
                  alignment: 'left',
                  margin: [35, 0, 0, 0],
                  lineHeight: 1,
                },
                 header: {
                   color: '#fd5806',
                   bold: true,
                   fontSize: 14,
                   lineHeight: 1,
                 },
                 postTitle: {
                   bold: true,
                   fontSize: 14,
                   color: 'black',
                   alignment: 'left',
                   lineHeight: 1,
                 },
                 
                 posDetail: {
                   fontSize: 12,
                   bold: false,
                   color: 'black',
                   alignment: 'left',
                   margin: [40, 0, 40, 0],
                   lineHeight: 1,
                 },

                 Subjblack12: {
                  fontSize: 12,
                  color: 'black',
                  bold: true,
                  alignment: 'left',
                  margin: [40, 0, 40, 0],
                  lineHeight: 1,
                },

                 Subjblack14: {
                   fontSize: 14,
                   color: 'black',
                   bold: true,
                   alignment: 'left',
                   margin: [40, 0, 40, 0],
                   lineHeight: 1,
                 },
                
                  textblack: {
                     fontSize: 12,
                     bold: false,
                     alignment: 'justify',
                     margin: [40, 0, 40, 0],
                     lineHeight: 1,
                   },

                   textblack2: {
                    fontSize: 12,
                    bold: false,
                    alignment: 'right',
                    margin: [50, 0, 10, 0],
                    lineHeight: 1,
                  },

                   numberblack: {
                    fontSize: 12,
                    bold: false,
                    alignment: 'left',
                    margin: [40, 0, 40, 0],
                  },

                  numberblack2: {
                    fontSize: 12,
                    bold: false,
                    alignment: 'left',
                    margin: [35, 0, 50, 0],
                  },

                  numberblack3: {
                    fontSize: 12,
                    bold: false,
                    alignment: 'left',
                    margin: [30, 0, 50, 0],
                  },

                  text1black: {
                    fontSize: 12,
                    bold: false,
                    alignment: 'justify',
                    margin: [50, 0, 40, 0],
                  },

                  textUnderline: {
                    fontSize: 12,
                    bold: false,
                    alignment: 'justify',
                    margin: [40, 0, 40, 0],
                    decoration: 'underline',
                  },

                   dateblack: {
                    fontSize: 12,
                    bold: false,
                    alignment: 'center',
                    margin: [40, 0, 40, 0],
                  },

                  dateblack2: {
                    fontSize: 12,
                    bold: true,
                    alignment: 'center',
                    margin: [40, 0, 40, 0],
                  },

                  paidblack: {
                    fontSize: 12,
                    bold: false,
                    alignment: 'left',
                    margin: [65, 0, 40, 0],
                  },

                  paidblack2: {
                    fontSize: 12,
                    bold: false,
                    alignment: 'left',
                    margin: [10, 0, 40, 0],
                  },

                  fasa2black: {
                    fontSize: 12,
                    bold: false,
                    alignment: 'left',
                    margin: [80, 0, 40, 0],
                  },

                  per5black: {
                    fontSize: 12,
                    bold: false,
                    alignment: 'justify',
                    margin: [70, 0, 40, 0],
                  },

                  per5Addblack: {
                    fontSize: 12,
                    bold: false,
                    alignment: 'left',
                    margin: [70, 0, 0, 0],
                  },

                  hrItalicUnderline: {
                    fontSize: 12,
                    bold: false,
                    italics:true,
                    alignment: 'left',
                    decoration: 'underline',
                  },

                  ItalicUnderline: {
                    fontSize: 12,
                    bold: false,
                    italics:true,
                    alignment: 'left',
                    decoration: 'underline',
                    margin: [70, 0, 0, 0],
                  },

                  asterikblack: {
                    fontSize: 9,
                    bold: false,
                    italics:true,
                    alignment: 'left',
                    margin: [65, 0, 40, 0],
                  },

                  imgSign: {
                    alignment: 'left',
                    margin: [40, 0, 0, 0],
                  },

                  boldText12: {
                    fontSize: 12,
                    bold: true,
                    alignment: 'left',
                    margin: [65, 0, 0, 0],
                  },

                  boldUnderline12: {
                    fontSize: 12,
                    bold: true,
                    alignment: 'left',
                    decoration: 'underline',
                  }
                 }
               }
     
               // Populate the header of the PDF 
               this.docOLDefinition.header = {
                 table: {
                   widths: ['auto', '*', 'auto'],
                   //headerRows: 1,
                   body: [
                     [{ rowSpan: 3, text: ``},{ rowSpan: 3, text: `Human Capital Business Operations`, style: 'OFL_title'}, { rowSpan: 3, image: 'logoTM', fit: [100, 100] }],
                     [{ text: `` }, '', ''],
                     [{ text: ``, margin: [0, 0, 0, 10], bold: true }, '', ''],
                     ['',{ text: `Ruj. Kami: ${myOL_refNo}` , style: 'rujStyle' }, { text: currDate }],
                   ]
                 },
                 layout: 'noBorders',
                 margin: [20, 20, 20, 40]
               };
     
               // Populate the content of PDF
               let myOFLtContent;
               this.docOLDefinition.content = [];
     
               // We invoke another request to convert the blob to Base64
        
               myOFLtContent = [
                 { // 0.
                   table: {
                     widths: [350],
                     body: [
                       [{ text: '' }], 
                     ]
                   },
                   layout: 'noBorders',
                   margin: [5, 20, 0, 5]
                 },
   
                 { // 1.
                   columns: [
                     {
                       width:'*',
                       alignment: 'left',
                       table: {
                         width: ['auto'],
                         body: [
                         
                           [{ columns: [{ text: `NAMA : ${myOL_name}`, style: 'posDetail' }] }],
                           [{ columns: [{ text: `NO KP : ${myOL_ic}`, style: 'posDetail' }] }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ columns: [{text: `TAWARAN PELAN PERPISAHAN SUKARELA (VOLUNTARY SEPARATION PLAN) `, style: 'Subjblack12'}] }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ text: 'Perkara di atas adalah dirujuk.',style: 'textblack' }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ text: 'Seperti anda sedia maklum, Pelan Perpisahan Sukarela (Voluntary Separation Plan) 2021 adalah satu pelan sukarela khas yang diwujudkan oleh pihak Syarikat untuk tempoh masa yang terhad bagi memberi peluang kepada anggota untuk meneroka aspirasi dan sebarang minat yang berbeza di luar Syarikat tanpa perlu menunggu umur persaraan mahupun atas faktor peribadi dengan menerima Bayaran Pampasan.',style: 'textblack' }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ text: [{text: 'Pada ', fontSize: 12, bold: false}, {text: `${myOL_appliedDate} `, fontSize: 12, bold: true},
                              'Syarikat telah menerima permohonan anda untuk menyertai skim tersebut.  Dengan permohonan anda itu, pihak Syarikat menganggap anda telah memahami sepenuhnya syarat - syarat berkaitan dengan Pelan Perpisahan Sukarela (Voluntary Separation Plan) 2021 tersebut.'
                            ], margin: [40, 0, 40, 0], alignment: 'justify', fontSize: 12
                          }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ text: 'Sehubungan itu, sukacita dimaklumkan bahawa permohonan anda untuk Pelan Perpisahan Sukarela telah diluluskan oleh pihak Pengurusan Syarikat: ',style: 'textblack' }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ text: `Tarikh akhir perkhidmatan : 30 September 2021`,style: 'dateblack2' }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ text: 'Selaras dengan kelulusan ini, anda akan menerima pampasan di bawah Pelan Perpisahan Sukarela (Voluntary Separation Plan) 2021 ini berdasarkan perkara-perkara di bawah :-',style: 'textblack' }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ text: `1.	Pampasan akan dibayar mengikut formula di bawah: `,style: 'textblack' }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ columns: [{width: 10, text: `A`,style: 'textblack'},{width: 10, text: `.`,style: 'textblack'},{ text: 'Formula Pampasan ',style: 'textUnderline' }] }],
                           [{ text: 'Pampasan berdasarkan tarikh akhir perkhidmatan anda.  ',style: 'paidblack' }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ text: `=   (1.5 x Tahun Perkhidmatan dengan Syarikat)* x Gaji Pokok`,style: 'paidblack' }],
                           [{ text: `    *terhad kepada maksima 36 sahaja`,style: 'paidblack' }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ columns: [{width: 10, text: `B`,style: 'textblack'}, {width: 10, text: `.`,style: 'textblack'},{ text: `Senarai Hutang Ditolak dari Pampasan`,style: 'textUnderline' }] }],
                           [{ text: `(Pampasan) tolak (Baki Pinjaman dan Baki Akaun Penamat)`,style: 'paidblack' }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ text: `2.	Jumlah Pampasan yang diterima adalah seperti berikut: `,style: 'textblack' }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ columns: [{width: 10, text: `A`,style: 'textblack'}, {width: 10, text: `.`,style: 'textblack'},{ text: 'Pampasan anda: ',style: 'textUnderline' }] }],
                           [{ text: `=	(1.5  x ${myOL_yis}) x RM ${myOL_paid}`,style: 'paidblack' }],
                           [{ text: `=	${myOL_form} x RM ${myOL_paid} = RM ${myOL_benf}`,style: 'paidblack' }],
                           [{ text: `    *terhad kepada maksima 36 sahaja`,style: 'paidblack' }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ text: `Tertakluk kepada Akta Cukai Pendapatan 1967`,style: 'paidblack' }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           //[{ text: `\n`, lineHeight: 0.8}],
                           [{ columns: [{width: 10, text: `B`,style: 'textblack'}, {width: 10, text: `.`,style: 'textblack'},{ text: 'Senarai Hutang Ditolak: ',style: 'textUnderline' }] }],
                           [{ text: `\n`, lineHeight: 0.8}], 
                           [{ columns: [{width: 100, text: `i.`,style: 'textblack2'},{ width: 300, text: `Pinjaman Perumahan*`,style: 'paidblack2' }, {text: `: RM ${myOL_hseLoan}`,}] }],
                           [{ columns: [{width: 100, text: `ii.`,style: 'textblack2'},{ width: 300, text: `Pinjaman Kenderaan*`,style: 'paidblack2' }, {text: `: RM ${myOL_carLoan}`,}] }],
                           [{ columns: [{width: 100, text: `iii.`,style: 'textblack2'},{ width: 300, text: `Pinjaman Komputer*`,style: 'paidblack2' }, {text: `: RM ${myOL_compLoan}`,}] }],
                           [{ columns: [{width: 100, text: `iv.`,style: 'textblack2'},{ width: 300, text: `Pinjaman Yayasan Telekom Malaysia`,style: 'paidblack2' }, {text: `: RM ${myOL_schol}`,}] }],
                           [{ columns: [{width: 100, text: `v.`,style: 'textblack2'},{ width: 300, text: `Baki Akaun Penamat`,style: 'paidblack2' }, {text: `: RM ${myOL_finalBal}`,}] }],
                           [{text: `(*Baki setakat 30 Jun 2021, tidak termasuk bayaran bulanan Julai 2021 hingga bulan akhir perkhidmatan)`,style: 'asterikblack' }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ text: `Anggaran jumlah akhir Pampasan (TERTAKLUK kepada penyelesaian cukai LHDN)`,style: 'boldText12'}],
                           [{ columns: [{ width: 120, text: `diterima :`,style: 'boldText12'},{text: `RM${myOL_netAmt}`,style: 'boldUnderline12'}] }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ columns: [{width: 10, text: `3`,style: 'numberblack'}, {width: 10, text: `.`,style: 'numberblack'},{ text: `Tidak ada sumbangan di bawah Akta Kumpulan Wang Simpanan Pekerja 1991 dan/atau Akta Keselamatan Sosial Pekerja 1968 yang akan dibayar oleh salah satu pihak berkenaan dengan pembayaran di bawah Pelan Perpisahan Sukarela ini. `,style: 'text1black' }] }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ columns: [{width: 10, text: `4`,style: 'numberblack'}, {width: 10, text: `.`,style: 'numberblack'},{ text: `Bayaran akhir Pampasan adalah selepas dikenakan potongan statutori (termasuk tetapi tidak terhad kepada pemotongan cukai pendapatan dan jumlah pinjaman tertunggak atau hutang yang dimiliki oleh pegawai kepada Syarikat). Pembayaran akan dilepaskan kepada pegawai, setelah pemotongan statutori dan/ atau kontrak yang diperlukan sebagaimana yang dikehendaki oleh undang-undang seperti berikut: `,style: 'text1black' }] }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ text: `•	Pembayaran fasa pertama (hari gaji bulan terakhir perkhidmatan)`,style: 'paidblack' }],
                           [{ text: `-	${myOL_trenche} dari RM ${myOL_netAmt}`,style: 'fasa2black' }],
                           [{ text: `•	Pembayaran fasa kedua (pada hari gaji bulan Disember 2021 atau hari gaji`,style: 'paidblack' }],
                           [{ text: `     bulan yang seterusnya tertakluk kepada penerimaan Surat Penyelesaian`,style: 'fasa2black' }],
                           [{ text: ` 	Cukai daripada pihak LHDN) `,style: 'fasa2black' }],
                           [{ text: `-	Baki Pampasan selepas potongan statutori.`,style: 'fasa2black' }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ columns: [{width: 10, text: `5`,style: 'numberblack'},{width: 10, text: `.`,style: 'numberblack'},{ text: `Untuk maklumat lanjut berkenaan dengan baki pinjaman anda, sila hubungi talian`,style: 'text1black' }] }],
                           [{ columns: [{ width: 276, text: `1800 - 88 - 9779/4 atau email kepada`,style: 'per5Addblack'}, {text: `hrhelpdesk@tm.com.my.`,style: 'hrItalicUnderline'}]}],
                           [{ text: `Untuk maklumat lanjut, berkenaan dengan baki akaun penamat anda, sila berhubung dengan unit Final Account & Collection Management TM. Sebarang pertanyaan selain daripada dua perkara diatas, sila email kepada `,style: 'per5black'}],
                           [{ text: `mobilitycentre@tm.com.my.`,style: 'ItalicUnderline'}],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ columns: [{width: 10, text: `6`,style: 'numberblack'},{width: 10, text: `.`,style: 'numberblack'},{ text: [{text: 'Anda adalah dikehendaki membuat pilihan samada menerima atau menolak tawaran di ERA dalam tempoh ', bold: false}, {text: `tiga (3) hari`, bold: true},
                           {text: `dari tarikh surat ini. Anda dianggap menolak tawaran Pelan Perpisahan Sukarela ini sekiranya pihak kami tidak menerima apa - apa jawapan dalam tempoh yang diberikan.`, bold: false}] ,style: 'text1black'}] }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ columns: [{width: 10, text: `7`,style: 'numberblack'},{width: 10, text: `.`,style: 'numberblack'},{ text: `Persetujuan anda menerima tawaran ini adalah dianggap sebagai muktamad dan pihak Syarikat tidak akan mempertimbangkan sebarang permohonan anda untuk menarik balik persetujuan penerimaan tawaran ini.`,style: 'text1black' }] }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ columns: [{width: 10, text: `8`,style: 'numberblack'},{width: 10, text: `.`,style: 'numberblack'},{ text: `Dengan persetujuan anda menerima tawaran ini, anda adalah bersetuju bahawa Pampasan dan juga apa - apa bayaran yang dibuat di bawah Pelan Perpisahan Sukarela ini akan dikira sebagai bayaran terakhir dan muktamad dari pihak Syarikat.`,style: 'text1black' }] }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ columns: [{width: 10, text: `9`,style: 'numberblack'},{width: 10, text: `.`,style: 'numberblack'},{ text: `Anda tidak berhak untuk menuntut apa-apa bayaran lain termasuk apa-apa faedah penamatan dan ganti tiga (3) bulan notis dari pihak TM selepas daripada ini.`,style: 'text1black' }] }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ columns: [{width: 5, text: `1`,style: 'numberblack3'},{width: 5, text: `0`,style: 'numberblack2'},{width: 10, text: `.`,style: 'numberblack'},{ text: `Terma dan syarat Pelan Perpisahan Sukarela ini dikepilkan bersama untuk makluman anda.`,style: 'text1black' }] }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ text: 'Pihak Pengurusan Syarikat ingin mengambil peluang ini untuk merakamkan ucapan terima kasih di atas sumbangan yang telah diberikan sepanjang perkhidmatan anda dengan pihak Syarikat. ',style: 'textblack' }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{ text: 'Sekian dan salam hormat.',style: 'textblack' }],
                           [{ text: `\n`, lineHeight: 0.8}],
                           [{
                            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAxMAAAFLCAYAAACtGNHjAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAJOgAACToAYJjBRwAALT+SURBVHhe7Z13sC1Hnd/5w8a1LrtssL1FrdflLdhdV9mACUISCFBACCUkBBIopyeesoTCU3gKKKenHFCWeALlnHNOCGUhlCOKTxGhDHjHfFrvd/d3m+6ZnnPm3HvuPd9PVdcJ09PT3dPT8/t2/FglhKhl3rx51U477VR95zvfqZZbbrlq2WWXrZZYYolqzz33rJ599tng5//9v/8XPoUQQgghRgmJCSFq+Jd/+ZfqgQceqDbffPNqqaWWCmKCTwTF+eefX7311ltj/oQQQgghRg2JCSFqQCRcddVV1RprrFF985vfDL0TSy65ZLXKKqtUjz322HxfQgghhBCjicSEEDUwfOnss88OPRFf+tKXqsUXX7z61re+FcQFw5/gT3/6U/gUQgghhBg1JCbESEPPg8134BNh4Oc/cPyoo46qll9++errX/966JVYZpllqk022aR6/fXXg58///nPmjMhhBBCiJFEYkKMNIgAxAAgHPjOp7kPP/yw2n///asVV1wx9Ejgll566WqHHXao3njjjXAe4FcIIYQQYtSQmBAjC0IClxIC/E8vBWKCVZvomWCI06KLLhrmTRxyyCFjk6+FEEIIIUYViQkxspiYAASFfQcTGbhZs2aFFZxYDha38sorV5dddln1/vvvB7/mTwghhBBi1JCYECOLCQA+6YH44x//+FeigP9mzpwZeiWYL8EQp4022qh6+umnxwRHPM9CCCGEEGJUkJgQI4vvffjggw/G5ksYfH/ppZfCyk2LLbZYmC/B5Ovtttuueu+994IfzonPE0IIIYQYFSQmxMjihQA9Ex7++/3vf19deeWVYVgTQoL5Et/+9rerXXfdNZwHfKpXQgghhBCjisSEGFkQAdY7EYsJeOWVV6qjjz46rOTEnIlvfOMbYfL1QQcdFM7hXIZBmbAQQgghhBg1JCbEyIMosMnUXhyw9OucOXPC0CbEBDtgf/e7362OO+64cBwkJoQQQggxykhMCPEXrIfCPoFN6WbPnl0tt9xyYZjTV7/61WrNNdesrrvuujE/GuYkhBBCiFFGYkKMLAgCEwUIAoQBzv5jmNPmm28eeiYQ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EEKMKHfeeWe19dZbhxf02muvHXa9xjhiAzshhBBiuiMxIYQQfXDFFVdUq666algKdo011qiWWmqpatddd60efPDBcJyVnIQQQojpisSEEEL0wTnnnFOtssoqYbM6Pn/wgx9Uc+fODfMp4MMPPwyfQgghxHREYkIIIXqEDekOOeSQsOM1ImKZZZapZs6cWd16661je0ewj4QQQggxXZGYEEKIiH/5l38ZJwbsd7y53GWXXVZtttlm1fLLLx+GOfG5yy67hF2tgfM0zEkIIcR0RmJCCCEivJh4//33x4RELAxOOumkavXVVw9Cgp6J1VZbrTrhhBOq559/PhwnnD/+8Y/huxBCCDEdkZgQQogaEBAIAt8rYd+PO+64sOylCYl11123uvHGG6u33347HEdMaJiTEEKI6YzEhBBCNPDee++NTaRGSHzwwQfh93777Vd9//vfD5OvWdFp0003rV544YUxf+qZEEIIMd2RmBBCiAQIAYPeCRv6hIjAXXfddWE/ie9973thFSc+WRL2jTfeCOdITAghhBgFJCaEECICEWDzI0xI2HfEAb8POuigMLyJngk+2ayO+RI2xMnEhBBCCDGdkZgQQogEJgToheA7cx98LwOrNiEk6JWwz1tuuaV69913w3ETHkIIIcR0RmJCCCFqoIcBEBM4fj/33HPV9ttvHyZdr7zyymGI0+abbx42qjMBgT9NvhZCCDHdkZgQQogEfoiS9UwAk7EvvPDCaosttqjWWWedsGHdd7/73eqnP/3pOPEgMSGEEGIUkJgQQkw6DAmyVv8UdXMPOK/uOHCcsPn0rgSbO2H8/ve/rw488MBqww03rNZaa62wUR17TZxxxhlj4XItc/z28y7A/rPj9imEEEJMNSQmhBCThhnZKTFh/3tDnOMMI8KvGeM2IRrHb475401wHiswPfPMM9Xjjz8+5p588skwnOmJJ56oXnrppeq1114Lw5juuuuusAQsk64REfRMsKrTTTfdNBYe17U422//HefTxad9F0IIIaYSEhNCiEmD/Rq8wW/Gtn2aKDD4j3NwdswMce88f/jDH6rf/e531W9/+9vq7rvvru6///7wefvtt4cN5i655JJq7ty51WGHHRb2jdh7772rPffcM7iDDz44uKOPPjpsUHfsscdW+++/fxAQrN6EoGCI00YbbVRde+2186/411ga+TSR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5z+HT5aEnTFjRhASzJVgWdh11123uvvuu8NxwjG/QgghhOgGiQkhxFCTEgGpXooTTjhhbClYhjituOKKYX8JlouFP/7xjxITQgghRMdITAghhh4vHExc/OlPfxrrsWCoE8LBeiUQEwx3Ov/888eGQX344Yd/JUCEEEII0R8SE0KIKYEJAQRELCbuvPPOaptttgkCglWcEBTsMXHfffeF83D4F0IIIUS3SEwIIYYexADDlAABgfO9DKeffnqYL8HQJsQEPRT8fu6558Jx/JrwEEIIIUR3SEwIIYYexAAbzpkoiIUBe0msssoqQUzQI8Ewpz322KN67bXXwnH8a76EEEII0T0SE0KIoQcR8cEHH2TFxPbbb18ts8wyoVeCJWHXXHPN6rTTTqvefvvtcFw9E0IIIcRgkJgQQgw99Cq8/vrrQRTwHYc4YOgTE6w33HDDsEGdiYmZM2dWt912WxAggF/OFUIIIUS3SEwIIYaeN998szr55JNDTwPCwIYs8f+pp54ahjXhmCux2GKLVVtssUVYvQnefffdMERKCCGEEN0jMSGEGHpeeOGFauedd65uvvnmIA4MeiX23Xff6tvf/nbolUBQMNxp2223HRMc77333tgQKeupEEIIIUQ3SEwIIYYexATzIPbaa6+wCZ0NWXrjjTfCLteLLrpoEBE4lodlzwkTE7ZZHedYb4UQQgghukFiQggx9Lz00kvV6quvHlZsuuiii6p33nkniIO77747CIjvfOc7YYgT8yYQHRdffPGYmPBzJfx3IYQQQvSPxIQQYuh59dVXq80337z65je/We2+++7Vs88+G+ZPHH/88WGI0w9+8INq5ZVXrpZddtlqxx13DJO1/SZ1zLPQpnVCCCFE90hMCCGGnnnz5oV9IxZZZJEwrOmWW26pHn744eonP/lJGNa02mqrjW1Yd8QRR4RzmCthy8EiJDQJWwghhOgeiQkhxNDDMKfDDz88DGOiB+K4444LqzgxpImlYHEcW2eddaoLL7wwnMNEbRMTDHmyHbSFEEII0R0SE0KIoYedrE844YRqhRVWCHMnNt1002qjjTYKYmLttdcOu15/61vfCkOgnnzyyXCODWtCSNj8CRMXQgghhOgGiQkhxNBDL8NZZ50VhjOttdZaYTjTUkstFXoi1ltvvWrppZcOE7BPP/304N/EA7CCE70STL5W74QQQgjRLRITQoihBxFwzz33hJ2umRtBTwRDm0xcMJeC/1jpyTBBgZjQkrBCCCHEYJCYEEJMCdhwjgnXDGdCOMyYMaNaddVVQw8Fm9XNnj27uvPOO+f7/kiA0BvBcCet5CSEEEIMBokJIcRQQ68C+0ow32HWrFlhojXiYebMmWH+xIILLhiGOc2dO7d65ZVXwjk2pIlPzsPx3Q9/EkIIIUT/SEwIIYYaRICJgm222Sb0TLDfBEvCMgGbvSXYzO7mm2+ef8ZHk69tsrUXE+qhEEIIIbpFYkIIMSWgV2GLLbYIE62XW265MAmbYU6ICSZhP/DAA8Ff3APBdy8shBBCCNEdEhNCiKHGeiXY8ZplYJdYYokwzOmHP/xhGPK08MILV9tvv/3YkrDWk2EgJnD+PyGEEEJ0g8SEEGKoMRHA8rDsfv3FL36x+sY3vhF6JJZZZplq/fXXry699NLqrbfeCv7ACwo+ERMa4iSEEEJ0j8SEEGJKQO/EAQccEJaGXWyxxULvBJvU3XrrrUFI+CFMfEc8mKDgO6tBCSGEEKJbJCaEEEON9TLg7r///ur888+vjjvuuOqUU04ZmycB5gdiMUHPhDasE0IIIbpHYkIIIYQQQgjRExITQgghhBBCiJ6QmBBCCCGEEEL0hMSEEEIIIYQQoickJoQQQgghhBA9ITEhhBBCCCGE6IGq+v/ItPwI2W8EeQAAAABJRU5ErkJggg==',
                            width: 200,
                            height: 125,
                            style: `imgSign`,
                           }],
                          ]
                        },
                       layout: 'noBorders',
                     },
                    ]
                  },
                ];
     
                         
             this.docOLDefinition.content.push(myOFLtContent);
             this.downloadOfferLetter();
           }, 1500)
         }, error => {
             console.log('[ERROR] Fail to fetch Report for All Candidate: ' + error);
         });
    }
        
    getOfferLetterMESRA(itemOL){
        this.stId = itemOL;

        let dataOL = {
          Staff_Id: itemOL,
        }
             this._POST_api_Service.POST_VRP_data(trackingVars.postGetDetailStaff, dataOL).subscribe(datares => {
              this.detailArr = datares;
              this.profileArr = this.detailArr.profile;
              this.refArr = this.detailArr.reference; 
              this.retireArr = this.detailArr.retirement; 
             // this.choiceofdate = this.profileArr[0].choice_of_date.split("T")[0].split('-').reverse().join('/');
              this.choiceofdate = this.profileArr[0].choice_of_date;
              this.staffName = this.profileArr[0].name;
              this.staffIc = this.profileArr[0].new_ic_no
              this.refRefNo = this.detailArr.reference[0].ref_no;  
              this.staffExitDate = this.retireArr[0].exit_date;
              this.generatedDate = this.profileArr[0].generated_on;
                          
              if(this.choiceofdate.length > 0) {
                this.date_apply = this.choiceofdate;
                             
              //  if(this.date_apply==='2021-07-01T00:00:00.000Z')
              if(this.date_apply==='01/07/2021')
                {
                    this.advBal = this.retireArr[0].adv_balance;
                    this.carLoan = this.retireArr[0].bal_car_loan;
                    this.compLoan = this.retireArr[0].bal_comp_loan;
                    this.hseLoan = this.retireArr[0].bal_house_loan;
                    this.finalBal = this.retireArr[0].final_acc_bal;
                    this.scholarship  = this.retireArr[0].scholarship;
                    this.benefit = this.retireArr[0].benefit;
                    this.remMth = this.retireArr[0].remaining_month;
                    this.paidMth = this.retireArr[0].salary;
                    this.nettAmt = this.retireArr[0].nett_amount;
                    this.tranche = this.retireArr[0].tranche_percentage;
                    this.end_service = '30/06/2021';
                  }

               if(this.date_apply==='01/08/2021')
                {
                  this.advBal = this.retireArr[1].adv_balance;
                  this.carLoan = this.retireArr[1].bal_car_loan;
                  this.compLoan = this.retireArr[1].bal_comp_loan;
                  this.hseLoan = this.retireArr[1].bal_house_loan;
                  this.finalBal = this.retireArr[1].final_acc_bal;
                  this.scholarship  = this.retireArr[1].scholarship;
                  this.benefit = this.retireArr[1].benefit;
                  this.remMth = this.retireArr[1].remaining_month;
                  this.paidMth = this.retireArr[1].salary;
                  this.nettAmt = this.retireArr[1].nett_amount;
                  this.tranche = this.retireArr[1].tranche_percentage;
                  this.end_service = '31/07/2021';
                }
                              
                if(this.date_apply==='01/09/2021')
                {
                  this.advBal = this.retireArr[2].adv_balance;
                  this.carLoan = this.retireArr[2].bal_car_loan;
                  this.compLoan = this.retireArr[2].bal_comp_loan;
                  this.hseLoan = this.retireArr[2].bal_house_loan;
                  this.finalBal = this.retireArr[2].final_acc_bal;
                  this.scholarship  = this.retireArr[2].scholarship;
                  this.benefit = this.retireArr[2].benefit;
                  this.remMth = this.retireArr[2].remaining_month;
                  this.paidMth = this.retireArr[2].salary;
                  this.nettAmt = this.retireArr[2].nett_amount;
                  this.tranche = this.retireArr[2].tranche_percentage;
                  this.end_service = '31/08/2021';
                }
              }

              let ofl:DatePipe = new DatePipe('en-Us');
              let currDate = ofl.transform(this.generatedDate, 'dd/MM/yyyy');
              this.theDate = this.datePipe.transform(new Date(), 'dd-MM-yyyy h:mm a');
              currDate = currDate ? null : this.theDate;
              try {
               this.userId = JSON.parse(localStorage.getItem('currentUser')).userid;
             } catch (e) {
               console.error("Failed to get localStorage for currentUser");
             }
           
             this.titleOfferLetterPdf = `Surat Tawaran Pelan Persaraan Sukarela_MESRA2021_${this.stId}.pdf`;
             setTimeout(() => {
               this.downloading3 = false;
               let myOL_refNo = this.refRefNo;
               let myOL_name = this.staffName.toUpperCase();
               let myOL_ic = this.staffIc;
               let myOL_choiceofdate = this.datePipe.transform(this.choiceofdate, 'dd/MM/yyyy'); 
               let myOL_advBal = this.advBal; 
               let myOL_carLoan = this.carLoan; 
               let myOL_hseLoan = this.hseLoan; 
               let myOL_compLoan =  this.compLoan; 
               let myOL_finalBal = this.finalBal; 
               let myOL_schol = this.scholarship; 
               let myOL_benf = this.benefit;      
               let myOL_paid = this.paidMth;   
               let myOL_remMth = this.remMth;
               let myOL_netAmt = this.nettAmt;
               let myOL_trenche = this.tranche;
               let myOL_endService = this.end_service;
              
               this.docOLDefinition = {
                 pageSize: 'A4',
                 pageMargins: [20, 90],
                 background: function(page) {
                   if (page !== 1) {
                     return [
                       {
                         columns: [
                           {
                             width: 175,
                             alignment: 'center',
                             table: {
                               width: ['auto'],
                               body: [
                                 [{ text: `\n` }],
                               ]
                             },
                             layout: 'noBorders',
                             margin: [20, 105, 0, 0]
                           }
                         ],
                       },
                     ]
                   }
                 },
                 header: {},
                              
                 footer: {
                 columns: [
                  { text: 'Telekom Malaysia Berhad (128740-P), Human Capital Business Operations, Level 10 North Wing, Menara TM, Jalan Pantai Baharu 50672 Kuala Lumpur, Malaysia.  	www.tm.com.my', alignment: 'left', margin:40, color: '#AAB7B8', fontSize: 10,},
                ]},
                        
                 content: [],
                 images: {
                  logoTM: 'data:image/png;base64,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'
                 },
                 styles: {
                  OFL_title: {
                     color: '#AAB7B8',
                     fontSize: 10,
                     bold: true,
                     alignment: 'left',
                     margin: [35, 20, 0, 0]
                   },
                   rujStyle: {
                    color: 'black',
                    fontSize: 12,
                    bold: true,
                    alignment: 'left',
                    margin: [35, 0, 0, 0]
                  },
                   header: {
                     color: '#fd5806',
                     bold: true,
                     fontSize: 14,
                   },
                   postTitle: {
                     bold: true,
                     fontSize: 14,
                     color: 'black',
                     alignment: 'left',
                   },
                   
                   posDetail: {
                     fontSize: 12,
                     bold: false,
                     color: 'black',
                     alignment: 'left',
                     margin: [40, 0, 40, 0],
                   },

                   Subjblack14: {
                    fontSize: 14,
                    color: 'black',
                    bold: true,
                    alignment: 'left',
                    margin: [40, 0, 40, 0],
                  },
                  
                    textblack: {
                       fontSize: 12,
                       bold: false,
                       alignment: 'justify',
                       margin: [40, 0, 40, 0],
                     },

                     numberblack: {
                      fontSize: 12,
                      bold: false,
                      alignment: 'left',
                      margin: [40, 0, 40, 0],
                    },

                    text1black: {
                      fontSize: 12,
                      bold: false,
                      alignment: 'justify',
                      margin: [50, 0, 40, 0],
                    },

                    textUnderline: {
                      fontSize: 12,
                      bold: false,
                      alignment: 'justify',
                      margin: [40, 0, 40, 0],
                      decoration: 'underline',
                    },

                     dateblack: {
                      fontSize: 12,
                      bold: false,
                      alignment: 'center',
                      margin: [40, 0, 40, 0],
                    },

                    paidblack: {
                      fontSize: 12,
                      bold: false,
                      alignment: 'left',
                      margin: [65, 0, 40, 0],
                    },

                    fasa2black: {
                      fontSize: 12,
                      bold: false,
                      alignment: 'left',
                      margin: [80, 0, 40, 0],
                    },

                    per5black: {
                      fontSize: 12,
                      bold: false,
                      alignment: 'justify',
                      margin: [70, 0, 40, 0],
                    },

                    per5Addblack: {
                      fontSize: 12,
                      bold: false,
                      alignment: 'left',
                      margin: [70, 0, 0, 0],
                    },

                    hrItalicUnderline: {
                      fontSize: 12,
                      bold: false,
                      italics:true,
                      alignment: 'left',
                      decoration: 'underline',
                    },

                    ItalicUnderline: {
                      fontSize: 12,
                      bold: false,
                      italics:true,
                      alignment: 'left',
                      decoration: 'underline',
                      margin: [70, 0, 0, 0],
                    },

                    asterikblack: {
                      fontSize: 9,
                      bold: false,
                      italics:true,
                      alignment: 'left',
                      margin: [65, 0, 40, 0],
                    },

                    imgSign: {
                      alignment: 'left',
                      margin: [40, 0, 0, 0],
                    },

                    boldText12: {
                      fontSize: 12,
                      bold: true,
                      alignment: 'left',
                      margin: [65, 0, 0, 0],
                    },

                    boldUnderline12: {
                      fontSize: 12,
                      bold: true,
                      alignment: 'left',
                      decoration: 'underline',
                    }
                   }
                 }
       
                 // Populate the header of the PDF 
                 this.docOLDefinition.header = {
                   table: {
                     widths: ['auto', '*', 'auto'],
                     //headerRows: 1,
                     body: [
                       [{ rowSpan: 3, text: ``},{ rowSpan: 3, text: `Human Capital Business Operations`, style: 'OFL_title'}, { rowSpan: 3, image: 'logoTM', fit: [100, 100] }],
                       [{ text: `` }, '', ''],
                       [{ text: ``, margin: [0, 0, 0, 10], bold: true }, '', ''],
                       ['',{ text: `Ruj. Kami: ${myOL_refNo}` , style: 'rujStyle' }, { text: currDate }],
                     ]
                   },
                   layout: 'noBorders',
                   margin: [20, 20, 20, 40]
                 };
       
                 // Populate the content of PDF
                 let myOFLtContent;
                 this.docOLDefinition.content = [];
       
                 // We invoke another request to convert the blob to Base64
                 myOFLtContent = [
                   { // 0.
                     table: {
                       widths: [350],
                       body: [
                         [{ text: '' }], 
                       ]
                     },
                     layout: 'noBorders',
                     margin: [5, 20, 0, 5]
                   },
     
                   { // 1.
                     columns: [
                       {
                         width:'*',
                         alignment: 'left',
                         table: {
                           width: ['auto'],
                           body: [
                           
                             [{ columns: [{ text: `NAMA : ${myOL_name}`, style: 'posDetail' }] }],
                             [{ columns: [{ text: `NO KP : ${myOL_ic}`, style: 'posDetail' }] }],
                             [{ text: `\n` }],
                             [{ text: `\n` }],
                             [{ columns: [{text: `TAWARAN PELAN PERSARAAN SUKARELA (MESRA 2021) `, style: 'Subjblack14'}] }],
                             [{ text: `\n` }],
                             [{ text: 'Pelan Persaraan Sukarela (MESRA 2021) adalah satu pelan sukarela khas yang diwujudkan oleh pihak Syarikat untuk tempoh masa yang terhad bagi memberi peluang kepada anggota yang memilih untuk bersara pilihan dan secara sukarela dengan menerima Pampasan dan faedah - faedah yang di tetapkan.',style: 'textblack' }],
                             [{ text: `\n` }],
                             [{ text: 'Sukacita dimaklumkan bahawa permohonan anda untuk persaraan sukarela di bawah MESRA 2021 telah diluluskan oleh pihak Pengurusan Syarikat:',style: 'textblack' }],
                             [{ text: `\n` }],
                             [{ text: `Tarikh akhir perkhidmatan : ${myOL_endService}`,style: 'dateblack' }],
                             [{ text: `\n` }],
                             [{ text: `1.	Pampasan akan dibayar mengikut formula di bawah: `,style: 'textblack' }],
                             [{ text: `\n` }],
                             [{ columns: [{width: 10, text: `A`,style: 'textblack'},{width: 10, text: `.`,style: 'textblack'},{ text: 'Formula Pampasan ',style: 'textUnderline' }] }],
                             [{ text: 'Pampasan berdasarkan tarikh akhir perkhidmatan anda.  ',style: 'paidblack' }],
                             [{ text: `\n` }],
                             [{ text: `=   0.5 x  Gaji Pokok x Baki Bulan Perkhidmatan dengan Syarikat`,style: 'paidblack' }],
                             [{ text: `\n` }],
                             [{ columns: [{width: 10, text: `B`,style: 'textblack'}, {width: 10, text: `.`,style: 'textblack'},{ text: `Senarai Hutang Ditolak dari Pampasan`,style: 'textUnderline' }] }],
                             [{ text: `(Pampasan) tolak (Baki Pinjaman, Bayaran Pendahuluan`,style: 'paidblack' }],
                             [{ text: `Akhir Tahun 2020 dan Baki Akaun Penamat)  `,style: 'paidblack' }],
                             [{ text: `\n` }],
                             [{ text: `2.	Jumlah Pampasan yang diterima adalah seperti berikut: `,style: 'textblack' }],
                             [{ text: `\n` }],
                             [{ columns: [{width: 10, text: `A`,style: 'textblack'}, {width: 10, text: `.`,style: 'textblack'},{ text: 'Pampasan anda: ',style: 'textUnderline' }] }],
                             [{ text: `=	0.5  x RM${myOL_paid} x ${myOL_remMth}`,style: 'paidblack' }],
                             [{ text: `=	RM ${myOL_benf}`,style: 'paidblack' }],
                             [{ text: `\n` }],
                             [{ text: `Tertakluk kepada Akta Cukai Pendapatan 1967`,style: 'paidblack' }],
                             [{ text: `\n` }],
                             [{ text: `\n` }],
                             [{ columns: [{width: 10, text: `B`,style: 'textblack'}, {width: 10, text: `.`,style: 'textblack'},{ text: 'Senarai Hutang Ditolak: ',style: 'textUnderline' }] }],
                             [{ text: `\n` }], 
                             [{ columns: [{ width: 340, text: `1.	Bayaran Pendahuluan Akhir Tahun 2020`,style: 'paidblack' }, {text: `: RM ${myOL_advBal}`,}] }],
                             [{ columns: [{ width: 340, text: `2.	Pinjaman Perumahan*`,style: 'paidblack' }, {text: `: RM ${myOL_hseLoan}`,}] }],
                             [{ columns: [{ width: 340, text: `3.	Pinjaman Kenderaan*`,style: 'paidblack' }, {text: `: RM ${myOL_carLoan}`,}] }],
                             [{ columns: [{ width: 340, text: `4.	Pinjaman Komputer*`,style: 'paidblack' }, {text: `: RM ${myOL_compLoan}`,}] }],
                             [{ columns: [{ width: 340, text: `5.	Pinjaman Yayasan Telekom Malaysia`,style: 'paidblack' }, {text: `: RM ${myOL_schol}`,}] }],
                             [{ columns: [{ width: 340, text: `6.	Baki Akaun Penamat`,style: 'paidblack' }, {text: `: RM ${myOL_finalBal}`,}] }],
                             [{text: `(*Baki setakat 28 Februari 2021, tidak termasuk bayaran bulanan Mac 2021 hingga bulan akhir perkhidmatan)`,style: 'asterikblack' }],
                             [{ text: `\n` }],
                             [{ text: `Anggaran jumlah akhir Pampasan (TERTAKLUK kepada penyelesaian cukai LHDN)`,style: 'boldText12'}],
                             [{ columns: [{ width: 120, text: `diterima :`,style: 'boldText12'},{text: `RM${myOL_netAmt}`,style: 'boldUnderline12'}] }],
                             [{ text: `\n` }],
                             [{ columns: [{width: 10, text: `3`,style: 'numberblack'}, {width: 10, text: `.`,style: 'numberblack'},{ text: `Tidak ada sumbangan di bawah Akta Kumpulan Wang Simpanan Pekerja 1991 dan/atau Akta Keselamatan Sosial Pekerja 1968 yang akan dibayar oleh salah satu pihak berkenaan dengan pembayaran di bawah MESRA 2021. `,style: 'text1black' }] }],
                             [{ text: `\n` }],
                             [{ columns: [{width: 10, text: `4`,style: 'numberblack'}, {width: 10, text: `.`,style: 'numberblack'},{ text: `Bayaran akhir Pampasan adalah selepas dikenakan potongan statutori (termasuk tetapi tidak terhad kepada pemotongan cukai pendapatan dan jumlah pinjaman tertunggak atau hutang yang dimiliki oleh pegawai kepada Syarikat). Pembayaran akan dilepaskan kepada pegawai, setelah pemotongan statutori dan/ atau kontrak yang diperlukan sebagaimana yang dikehendaki oleh undang-undang seperti berikut: `,style: 'text1black' }] }],
                             [{ text: `\n` }],
                             [{ text: `•	Pembayaran fasa pertama (hari gaji bulan terakhir perkhidmatan)`,style: 'paidblack' }],
                             [{ text: `-	${myOL_trenche} dari RM${myOL_netAmt}`,style: 'fasa2black' }],
                             [{ text: `•	Pembayaran fasa kedua (hari ke 60 selepas tarikh akhir perkhidmatan sekiranya`,style: 'paidblack' }],
                             [{ text: `   Syarikat telah menerima Surat Penyelesaian Cukai daripada pihak LHDN dan`,style: 'fasa2black' }],
                             [{ text: ` 	mengikut jadual pembayaran yang telah ditetapkan) `,style: 'fasa2black' }],
                             [{ text: `-	Baki Pampasan selepas potongan statutori.`,style: 'fasa2black' }],
                             [{ text: `\n` }],
                             [{ columns: [{width: 10, text: `5`,style: 'numberblack'},{width: 10, text: `.`,style: 'numberblack'},{ text: `Untuk maklumat lanjut berkenaan dengan baki pinjaman anda, sila hubungi talian`,style: 'text1black' }] }],
                             [{ columns: [{ width: 276, text: `1800 - 88 - 9779/4 atau email kepada`,style: 'per5Addblack'}, {text: `hrhelpdesk@tm.com.my.`,style: 'hrItalicUnderline'}]}],
                             [{ text: `Untuk maklumat lanjut, berkenaan dengan baki akaun penamat anda, sila berhubung dengan unit Final Account & Collection Management TM. Sebarang pertanyaan selain daripada dua perkara diatas, sila email kepada `,style: 'per5black'}],
                             [{ text: `mobilitycentre@tm.com.my.`,style: 'ItalicUnderline'}],
                             [{ text: `\n` }],
                             [{ columns: [{width: 10, text: `6`,style: 'numberblack'},{width: 10, text: `.`,style: 'numberblack'},{ text: `Anda adalah dikehendaki membuat pilihan samada menerima atau menolak tawaran di ERA dalam tempoh empat belas (14) hari dari tarikh surat ini. Anda dianggap menolak tawaran Pelan Persaraan Sukarela ini sekiranya pihak kami tidak menerima apa - apa jawapan dalam tempoh yang diberikan.`,style: 'text1black' }] }],
                             [{ text: `\n` }],
                             [{ columns: [{width: 10, text: `7`,style: 'numberblack'},{width: 10, text: `.`,style: 'numberblack'},{ text: `Dengan persetujuan anda menerima tawaran ini, anda adalah bersetuju bahawa Pampasan dan juga apa - apa bayaran yang dibuat di bawah Pelan Persaraan Sukarela ini akan dikira sebagai bayaran terakhir dan muktamad dari pihak Syarikat.`,style: 'text1black' }] }],
                             [{ text: `\n` }],
                             [{ columns: [{width: 10, text: `8`,style: 'numberblack'},{width: 10, text: `.`,style: 'numberblack'},{ text: `Anda tidak berhak untuk menuntut apa-apa bayaran lain termasuk apa-apa faedah penamatan dan ganti tiga (3) bulan notis dari pihak TM selepas daripada ini.`,style: 'text1black' }] }],
                             [{ text: `\n` }],
                             [{ columns: [{width: 10, text: `9`,style: 'numberblack'},{width: 10, text: `.`,style: 'numberblack'},{ text: `Terma dan syarat Pelan Persaraan Sukarela ini dikepilkan bersama untuk makluman anda.`,style: 'text1black' }] }],
                             [{ text: `\n` }],
                             [{ text: 'Pihak Pengurusan Syarikat ingin mengambil peluang ini untuk merakamkan ucapan terima kasih di atas sumbangan yang telah diberikan sepanjang perkhidmatan anda dengan pihak Syarikat. ',style: 'textblack' }],
                             [{ text: `\n` }],
                             [{ text: 'Sekian dan salam hormat.',style: 'textblack' }],
                             [{ text: `\n` }],
                             [{
                              image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAxMAAAFLCAYAAACtGNHjAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAJOgAACToAYJjBRwAALT+SURBVHhe7Z13sC1Hnd/5w8a1LrtssL1FrdflLdhdV9mACUISCFBACCUkBBIopyeesoTCU3gKKKenHFCWeALlnHNOCGUhlCOKTxGhDHjHfFrvd/d3m+6ZnnPm3HvuPd9PVdcJ09PT3dPT8/t2/FglhKhl3rx51U477VR95zvfqZZbbrlq2WWXrZZYYolqzz33rJ599tng5//9v/8XPoUQQgghRgmJCSFq+Jd/+ZfqgQceqDbffPNqqaWWCmKCTwTF+eefX7311ltj/oQQQgghRg2JCSFqQCRcddVV1RprrFF985vfDL0TSy65ZLXKKqtUjz322HxfQgghhBCjicSEEDUwfOnss88OPRFf+tKXqsUXX7z61re+FcQFw5/gT3/6U/gUQgghhBg1JCbESEPPg8134BNh4Oc/cPyoo46qll9++errX/966JVYZpllqk022aR6/fXXg58///nPmjMhhBBCiJFEYkKMNIgAxAAgHPjOp7kPP/yw2n///asVV1wx9Ejgll566WqHHXao3njjjXAe4FcIIYQQYtSQmBAjC0IClxIC/E8vBWKCVZvomWCI06KLLhrmTRxyyCFjk6+FEEIIIUYViQkxspiYAASFfQcTGbhZs2aFFZxYDha38sorV5dddln1/vvvB7/mTwghhBBi1JCYECOLCQA+6YH44x//+FeigP9mzpwZeiWYL8EQp4022qh6+umnxwRHPM9CCCGEEGJUkJgQI4vvffjggw/G5ksYfH/ppZfCyk2LLbZYmC/B5Ovtttuueu+994IfzonPE0IIIYQYFSQmxMjihQA9Ex7++/3vf19deeWVYVgTQoL5Et/+9rerXXfdNZwHfKpXQgghhBCjisSEGFkQAdY7EYsJeOWVV6qjjz46rOTEnIlvfOMbYfL1QQcdFM7hXIZBmbAQQgghhBg1JCbEyIMosMnUXhyw9OucOXPC0CbEBDtgf/e7362OO+64cBwkJoQQQggxykhMCPEXrIfCPoFN6WbPnl0tt9xyYZjTV7/61WrNNdesrrvuujE/GuYkhBBCiFFGYkKMLAgCEwUIAoQBzv5jmNPmm28eeiYQ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EEKMKHfeeWe19dZbhxf02muvHXa9xjhiAzshhBBiuiMxIYQQfXDFFVdUq666algKdo011qiWWmqpatddd60efPDBcJyVnIQQQojpisSEEEL0wTnnnFOtssoqYbM6Pn/wgx9Uc+fODfMp4MMPPwyfQgghxHREYkIIIXqEDekOOeSQsOM1ImKZZZapZs6cWd16661je0ewj4QQQggxXZGYEEKIiH/5l38ZJwbsd7y53GWXXVZtttlm1fLLLx+GOfG5yy67hF2tgfM0zEkIIcR0RmJCCCEivJh4//33x4RELAxOOumkavXVVw9Cgp6J1VZbrTrhhBOq559/PhwnnD/+8Y/huxBCCDEdkZgQQogaEBAIAt8rYd+PO+64sOylCYl11123uvHGG6u33347HEdMaJiTEEKI6YzEhBBCNPDee++NTaRGSHzwwQfh93777Vd9//vfD5OvWdFp0003rV544YUxf+qZEEIIMd2RmBBCiAQIAYPeCRv6hIjAXXfddWE/ie9973thFSc+WRL2jTfeCOdITAghhBgFJCaEECICEWDzI0xI2HfEAb8POuigMLyJngk+2ayO+RI2xMnEhBBCCDGdkZgQQogEJgToheA7cx98LwOrNiEk6JWwz1tuuaV69913w3ETHkIIIcR0RmJCCCFqoIcBEBM4fj/33HPV9ttvHyZdr7zyymGI0+abbx42qjMBgT9NvhZCCDHdkZgQQogEfoiS9UwAk7EvvPDCaosttqjWWWedsGHdd7/73eqnP/3pOPEgMSGEEGIUkJgQQkw6DAmyVv8UdXMPOK/uOHCcsPn0rgSbO2H8/ve/rw488MBqww03rNZaa62wUR17TZxxxhlj4XItc/z28y7A/rPj9imEEEJMNSQmhBCThhnZKTFh/3tDnOMMI8KvGeM2IRrHb475401wHiswPfPMM9Xjjz8+5p588skwnOmJJ56oXnrppeq1114Lw5juuuuusAQsk64REfRMsKrTTTfdNBYe17U422//HefTxad9F0IIIaYSEhNCiEmD/Rq8wW/Gtn2aKDD4j3NwdswMce88f/jDH6rf/e531W9/+9vq7rvvru6///7wefvtt4cN5i655JJq7ty51WGHHRb2jdh7772rPffcM7iDDz44uKOPPjpsUHfsscdW+++/fxAQrN6EoGCI00YbbVRde+2186/411ga+TSR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5z+HT5aEnTFjRhASzJVgWdh11123uvvuu8NxwjG/QgghhOgGiQkhxFCTEgGpXooTTjhhbClYhjituOKKYX8JlouFP/7xjxITQgghRMdITAghhh4vHExc/OlPfxrrsWCoE8LBeiUQEwx3Ov/888eGQX344Yd/JUCEEEII0R8SE0KIKYEJAQRELCbuvPPOaptttgkCglWcEBTsMXHfffeF83D4F0IIIUS3SEwIIYYexADDlAABgfO9DKeffnqYL8HQJsQEPRT8fu6558Jx/JrwEEIIIUR3SEwIIYYexAAbzpkoiIUBe0msssoqQUzQI8Ewpz322KN67bXXwnH8a76EEEII0T0SE0KIoQcR8cEHH2TFxPbbb18ts8wyoVeCJWHXXHPN6rTTTqvefvvtcFw9E0IIIcRgkJgQQgw99Cq8/vrrQRTwHYc4YOgTE6w33HDDsEGdiYmZM2dWt912WxAggF/OFUIIIUS3SEwIIYaeN998szr55JNDTwPCwIYs8f+pp54ahjXhmCux2GKLVVtssUVYvQnefffdMERKCCGEEN0jMSGEGHpeeOGFauedd65uvvnmIA4MeiX23Xff6tvf/nbolUBQMNxp2223HRMc77333tgQKeupEEIIIUQ3SEwIIYYexATzIPbaa6+wCZ0NWXrjjTfCLteLLrpoEBE4lodlzwkTE7ZZHedYb4UQQgghukFiQggx9Lz00kvV6quvHlZsuuiii6p33nkniIO77747CIjvfOc7YYgT8yYQHRdffPGYmPBzJfx3IYQQQvSPxIQQYuh59dVXq80337z65je/We2+++7Vs88+G+ZPHH/88WGI0w9+8INq5ZVXrpZddtlqxx13DJO1/SZ1zLPQpnVCCCFE90hMCCGGnnnz5oV9IxZZZJEwrOmWW26pHn744eonP/lJGNa02mqrjW1Yd8QRR4RzmCthy8EiJDQJWwghhOgeiQkhxNDDMKfDDz88DGOiB+K4444LqzgxpImlYHEcW2eddaoLL7wwnMNEbRMTDHmyHbSFEEII0R0SE0KIoYedrE844YRqhRVWCHMnNt1002qjjTYKYmLttdcOu15/61vfCkOgnnzyyXCODWtCSNj8CRMXQgghhOgGiQkhxNBDL8NZZ50VhjOttdZaYTjTUkstFXoi1ltvvWrppZcOE7BPP/304N/EA7CCE70STL5W74QQQgjRLRITQoihBxFwzz33hJ2umRtBTwRDm0xcMJeC/1jpyTBBgZjQkrBCCCHEYJCYEEJMCdhwjgnXDGdCOMyYMaNaddVVQw8Fm9XNnj27uvPOO+f7/kiA0BvBcCet5CSEEEIMBokJIcRQQ68C+0ow32HWrFlhojXiYebMmWH+xIILLhiGOc2dO7d65ZVXwjk2pIlPzsPx3Q9/EkIIIUT/SEwIIYYaRICJgm222Sb0TLDfBEvCMgGbvSXYzO7mm2+ef8ZHk69tsrUXE+qhEEIIIbpFYkIIMSWgV2GLLbYIE62XW265MAmbYU6ICSZhP/DAA8Ff3APBdy8shBBCCNEdEhNCiKHGeiXY8ZplYJdYYokwzOmHP/xhGPK08MILV9tvv/3YkrDWk2EgJnD+PyGEEEJ0g8SEEGKoMRHA8rDsfv3FL36x+sY3vhF6JJZZZplq/fXXry699NLqrbfeCv7ACwo+ERMa4iSEEEJ0j8SEEGJKQO/EAQccEJaGXWyxxULvBJvU3XrrrUFI+CFMfEc8mKDgO6tBCSGEEKJbJCaEEEON9TLg7r///ur888+vjjvuuOqUU04ZmycB5gdiMUHPhDasE0IIIbpHYkIIIYQQQgjRExITQgghhBBCiJ6QmBBCCCGEEEL0hMSEEEIIIYQQoickJoQQQgghhBA9ITEhhBBCCCGE6IGq+v/ItPwI2W8EeQAAAABJRU5ErkJggg==',
                              width: 150,
                              height: 150,
                              style: `imgSign`,
                             }],
                            ]
                          },
                         layout: 'noBorders',
                       },
                      ]
                    },
                  ];
       
                           
               this.docOLDefinition.content.push(myOFLtContent);
               this.downloadOfferLetter();
             }, 1500)
           }, error => {
               console.log('[ERROR] Fail to fetch Report for All Candidate: ' + error);
           });
    }

    downloadOfferLetter() {  

            //onclick modal downloading..
            setTimeout(function () {
                $('#modalLoading').modal('hide');
            }, 3000);

            //disable button generate offer and countdown 10 sec to prevent multiple attempt
            $('#btnGenOffer').prop('disabled', true);
            $('#btnGenOffer2').addClass("disabled");
            var timeleft = 10;
            var downloadTimer = setInterval(function(){
            if(timeleft <= 0){
                clearInterval(downloadTimer);
                document.getElementById("timerEnableBtn").innerHTML = "";
                $('#btnGenOffer').prop('disabled', false);
                $('#btnGenOffer2').removeClass("disabled");
            } else {
                document.getElementById("timerEnableBtn").innerHTML = "( " + timeleft + " )";
            }
            timeleft -= 1;
            }, 1000);

           pdfMake.createPdf(this.docOLDefinition).download(this.titleOfferLetterPdf);   
           //pdfMake.createPdf(this.docOLDefinition).open();         
    }

      tncHashes: any;
      getTnc() {
          // pdfMake.createPdf(this.docCPDefinition).download(this.titleCPPdf);
          // this.imgDataUrl = '';       
  
          this.loading = true;
          this._GET_api_Service.GET_VRP_data(trackingVars.getTnc).subscribe(data => {   
              this.tncHashes = data[0].tnchash;
              this.tncMesraPdfURL = GlobalVariable.BASE_API_URL + "/get/image/" + this.tncHashes+ "?api_key=" + GlobalVariable.API_KEY;
              console.log(this.tncMesraPdfURL); 
              this.loading = false;
              },
              error => {
                  console.log('[ERROR Get api tnc] ' + error);
          });
          
      }
  
      faqHashes: any;
      getFaq() {        
  
          this.loading = true;
          this._GET_api_Service.GET_VRP_data(trackingVars.getFaq).subscribe(data => {  
              if(data)
              {
                  this.faqHashes = data[0].faqhash;
                  this.faqMesraPdfURL = GlobalVariable.BASE_API_URL + "/get/image/" + this.faqHashes+ "?api_key=" + GlobalVariable.API_KEY;
                  //console.log(this.faqMesraPdfURL); 
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
        }

        returnAssetHashes: any;
        getRoa() {           
            this.loading = true;
            this._GET_api_Service.GET_VRP_data(trackingVars.getRoa).subscribe(data => {  
                if(data)
                {
                    this.returnAssetHashes = data[0].roahash;
                    this.returnAssetFormPdfURL = GlobalVariable.BASE_API_URL + "/get/image/" + this.returnAssetHashes+ "?api_key=" + GlobalVariable.API_KEY;
                    //console.log(this.returnAssetFormPdfURL); 
                    this.loading = false;
                } else {
                    console.log('Error API fetch RoA: No Data'); 
                    //console.log(data); 
                    this.loading = false;
                }
                },
                error => {
                    console.log('[ERROR Get api tnc] ' + error);
            });
          }

}//end export class
