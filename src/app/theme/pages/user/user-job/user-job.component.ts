import { ComponentFactoryResolver, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GET_Service } from '../../../api/get.service';
import { AlertService } from '../../../../auth/_services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertComponent } from '../../../../auth/_directives/alert.component';
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { JobsVars } from './user-job-vars';
import { EnLang, MyLang } from './language/language-vars';
import { GlobalVariable } from "../../../../../environments/environment";
import { connectableObservableDescriptor } from 'rxjs/observable/ConnectableObservable';
//import { GlobalVariable } from '../../../../../../ghcm-global';

@Component({
    selector: 'user-job',
    templateUrl: './user-job.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./user-job.component.css']
})

export class UserJobComponent implements OnInit {
    jobTotalAPI = JobsVars.jobTotalAPI;

    constructor(
        private http: Http,
        private _GET_api_Service: GET_Service,
        //private http: Http, private activeRoute: ActivatedRoute, 
        private routers: Router,
        private _alertService: AlertService, private cfr: ComponentFactoryResolver
    ) {

    }

    loading = true;
    lobData: any[];
    data: any[]; data2 = [];
    data_all: any[];
    data_rel: any[];
    data_exec: any[];
    data_non_exec: any[];
    data_ne_promo: any[];

    enChecked: boolean = true;
    word: any;
    filterType: any;

    ngOnInit() {
        let lang = localStorage.getItem('lang');
        if (lang) {
            if (lang === 'en') {
                this.enChecked = true;
                this.word = EnLang;
            }
            if (lang === 'my') {
                this.enChecked = false;
                this.word = MyLang;
            }
        }
        else {
            this.enChecked = true;
            this.word = EnLang;
            localStorage.setItem('lang', 'en');
        }

        let flt = localStorage.getItem('filter');
        this.setFilter(flt);

        this._GET_api_Service.GET_data(this.jobTotalAPI).subscribe(data => {

            this.lobData = data;
            
            this.loadData(data);
            this.loading = false;


        },
        error => {
            this._alertService.error("Loading Job Total List Failed");
            console.log('[ERROR - Job Total List] ' + error);
            this.loading = false;
        })
        
        localStorage.setItem('tabMode', JSON.stringify('jobs')); // to save mode
    }

    loadData(data) {
        type TrackingData = {
            idx: number, lob: string, total: string, img_url: string, rel: string, ne_promo: number,
        };
        let all: TrackingData[] = [];
        let relevant: TrackingData[] = [];
        let exec: TrackingData[] = [];
        let non_exec: TrackingData[] = [];
        let ne_promo: TrackingData[] = [];

       

        for (let i = 0; i < data.length; i++) {
            let imgUrl = GlobalVariable.BASE_API_URL + JobsVars.imgAPI + data[i].image_url + '?api_key=' + GlobalVariable.API_KEY;

            if (this.filterType != 'all') {
                if (data[i].relevant > 0) {
                    relevant.push({
                        idx: i, lob: data[i].lob, total: data[i].relevant, img_url: imgUrl, rel: data[i].relevant, ne_promo: data[i].ne_promo,
                    });
                }

                if (data[i].exec > 0) {
                    exec.push({
                        idx: i, lob: data[i].lob, total: data[i].exec, img_url: imgUrl, rel: data[i].relevant,ne_promo: data[i].ne_promo,
                    });
                }

                if (data[i].non_exec > 0) {
                    non_exec.push({
                        idx: i, lob: data[i].lob, total: data[i].non_exec, img_url: imgUrl, rel: data[i].relevant,ne_promo: data[i].ne_promo,
                    });
                }

                if (data[i].ne_promo > 0) {
                    ne_promo.push({
                        idx: i, lob: data[i].lob, total: data[i].ne_promo, img_url: imgUrl, rel: data[i].relevant,ne_promo: data[i].ne_promo,
                    });
                    
                }

            }
            else {
                all.push({
                    idx: i, lob: data[i].lob, total: data[i].total, img_url: imgUrl, rel: data[i].relevant,ne_promo: data[i].ne_promo,
                });
            }
        }

        if (this.filterType === 'all') {
            this.data_all = all;
            this.data = this.data_all;
        }
        else if (this.filterType === 'relevant') {
            this.data_rel = relevant;
            this.data = this.data_rel;
        }
        else if (this.filterType === 'exec') {
            this.data_exec = exec;
            this.data = this.data_exec;
        }
        else if (this.filterType === 'non_exec') {
            this.data_non_exec = non_exec;
            this.data = this.data_non_exec;
        }
        else if (this.filterType === 'ne_promo') {
            this.data_ne_promo = ne_promo;
            this.data = ne_promo;
        }

    }

    filterOk() {
        this.loadData(this.lobData);
        document.getElementById('cancel_btn').click();
    }

    checkFilter(val) {
        if (this.filterType == val)
            return true;
        else
            return false;
    }


    flt_all: any; flt_rel: any; flt_exec: any; flt_nonEx: any; flt_neP: any;
    fltText;
    setFilter(flt) {
        localStorage.setItem('filter', flt);
        this.filterType = flt;

        if (this.filterType === 'all') {
            this.flt_all = true; this.flt_rel = false; this.flt_exec = false;
            this.flt_nonEx = false; this.flt_neP = false;
            this.fltText = this.word.flt_all;
        }
        else if (this.filterType === 'relevant') {
            this.flt_all = false; this.flt_rel = true; this.flt_exec = false;
            this.flt_nonEx = false; this.flt_neP = false;
            this.fltText = this.word.flt_rel;
        }
        else if (this.filterType === 'exec') {
            this.flt_all = false; this.flt_rel = false; this.flt_exec = true;
            this.flt_nonEx = false; this.flt_neP = false;
            this.fltText = this.word.flt_exec;
        }
        else if (this.filterType === 'non_exec') {
            this.flt_all = false; this.flt_rel = false; this.flt_exec = false;
            this.flt_nonEx = true; this.flt_neP = false;
            this.fltText = this.word.flt_nonEx;
        }
        else if (this.filterType === 'ne_promo') {
            this.flt_all = false; this.flt_rel = false; this.flt_exec = false;
            this.flt_nonEx = false; this.flt_neP = true;
            this.fltText = this.word.flt_NE;
        }
    }

    getFltText() {
        if (this.filterType === 'all') return this.word.flt_all;
        else if (this.filterType === 'relevant') return this.word.flt_rel;
        else if (this.filterType === 'exec') return this.word.flt_exec;
        else if (this.filterType === 'non_exec') return this.word.flt_nonEx;
        else if (this.filterType === 'ne_promo') return this.word.flt_NE;
    }

    changeFilter(flt) {
        this.filterType = flt;
        this.setFilter(flt);

        this.loadData(this.lobData);
        document.getElementById('cancel_btn').click();
    }

    langChange(id) {
        let selectedLang = id.value;

        if (selectedLang === 'en') {
            this.word = EnLang;
            localStorage.setItem('lang', 'en');
            this.enChecked = true;
        }
        if (selectedLang === 'my') {
            this.word = MyLang;
            localStorage.setItem('lang', 'my');
            this.enChecked = false;
        }

        document.getElementById('lang_close').click();
    }

    lobName: any;
    jobSecClicked(lob,idx) {
       
        this.lobName = lob;
        this.routers.navigate(['/user-job/select-job', idx + 1]);
        localStorage.setItem("lobnames", lob);
    }

    searchClicked(){
        this.routers.navigate(['/user-job/search-job']);        
    }


}