import { ComponentFactoryResolver, Component, OnInit, ViewEncapsulation, Injectable, HostListener } from '@angular/core';
import { GET_Service } from '../../../../api/get.service';
import { POST_Service } from '../../../../api/post.service';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { En, My } from './lang-vars';
import { resultVars } from './result-vars';
import "rxjs/add/operator/map";


@Component({
    selector: 'vrp-result',
    templateUrl: './result.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./result.component.css']
})

export class ResultComponent implements OnInit {

  constructor(    
    private http: Http,
    private _GET_api_Service: GET_Service,
    private _POST_api_Service: POST_Service,
    private router: Router,
    private _script: ScriptLoaderService
  ) { }
  
  enChecked: boolean = true;
  word: any;
  loading = false;
  
  showVrp: boolean = false;
  staff_no: string;
  checkStatus: any;
  checkStatusText: string;  
  date_apply: string; 
  formatDateExit = "d MMMM yyyy";

  ngOnInit() {

    this.checkSelectedLang();
    //this.checkVrpRole();
    //this.checkVrpSession();
    this.checkEligibleVrpUsr();
    this.checkApplicationStatus();
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }

  checkVrpRole(){
    this._GET_api_Service.GET_VRP_data(resultVars.getRoleVrp).subscribe(data => {
        console.log('getRoleVrp: ' + data.role_lvl);
        if ((data.role_lvl > 0) && (data.role_lvl < 5))  
        {  
            this.showVrp = true;
        }  else {         
            this.router.navigateByUrl('/index');       
        }
    }, error => {
            console.log('[ERROR] cannot check role ' + error);
    })   
}

checkVrpSession(){
    this._GET_api_Service.GET_VRP_data(resultVars.getVrpSession).subscribe(data => {
        console.log('getVrpSession: DataLen '+data.length);
        if (data.length>0) 
        {
            this.showVrp = true;
        } else {                
            this.router.navigateByUrl('/index');
        }
    }, error => {
        console.log('[ERROR] cannot check role ' + error);
    });     
}
  
  checkEligibleVrpUsr() {               
    //check role user for VRP
    this._GET_api_Service.GET_VRP_data(resultVars.getRoleVrp).subscribe(data => {
        console.log('getRoleVrp: ',data.role_lvl);
            if ((data.role_lvl > 0) && (data.role_lvl < 5)) 
            {                
                //check session user for VRP
                this._GET_api_Service.GET_VRP_data(resultVars.getVrpSession).subscribe(data => {
                    console.log('getVrpSession: ',data);
                    if (data.length>0) 
                    {
                        this.showVrp = true;
                    } else {
                        this.router.navigateByUrl('/index');                        
                    }
                }, error => {
                    console.log('[ERROR] cannot check role ' + error);
                });              
            }   
        }, error => {
            console.log('[ERROR] cannot check role ' + error);
        })
    }

  //check status to navigate to result
  checkApplicationStatus() {      
    this.loading = true;
    this._GET_api_Service.GET_VRP_data(resultVars.getStatusAppl).subscribe(data => {  
        console.log(data);
        if(data) {
            this.staff_no = data[0].staff_no,
            this.checkStatus = data[0].status,
            this.checkStatusText = data[0].text,
            this.date_apply = data[0].choice_of_date  
            //console.log('date_apply: '+this.date_apply);
            //divert back to mainpage if the user is status NEW or Null
            if(this.checkStatus === 1 || this.checkStatus === null){
                this.router.navigateByUrl('/vsp');
            }
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

    convertMonthBM(dateToConvert){         
        let monthBm = ['Januari','Februari','Mac','April','Mei','Jun','Julai','Ogos','September','Oktober','November','Disember']; 
        let dateString = dateToConvert; 
        let newDate = new Date(dateString);
        let convertedMonthBM = monthBm[newDate.getMonth()];
        return convertedMonthBM;
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

}