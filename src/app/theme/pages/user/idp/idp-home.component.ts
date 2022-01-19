import { ComponentFactoryResolver, Component, OnInit, ViewEncapsulation, Injectable, HostListener } from '@angular/core';
import { GET_Service } from '../../../api/get.service';
import { POST_Service } from '../../../api/post.service';
import { AlertService } from '../../../../auth/_services/alert.service';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Rx";
import { GlobalVariable } from "../../../../../environments/environment";
import { ScriptLoaderService } from '../../../../_services/script-loader.service';
import { En, My } from './lang-vars';
import { IVars } from './idp-vars';


@Component({
    selector: 'idp-home',
    templateUrl: './idp-home.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./idp.component.css']
})

export class IDPHomeComponent implements OnInit {

    constructor(
        private http: Http,
        private _GET_api_Service: GET_Service,
        private _POST_api_Service: POST_Service,
        private router: Router,
        private _script: ScriptLoaderService
    ) {
        this.getScreenSize();
    }

    screenHeight: number;
    screenWidth: number;

    enChecked: boolean = true;
    word: any;
    isSuperior = false;

    view: any[] = [];

    // options
    gradient: boolean = true;
    showLegend: boolean = true;
    showLabels: boolean = true;
    isDoughnut: boolean = false;
    legendPosition: string = 'below';

    
    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C']
    };

    loading = false;
    newIDP_list;
    pendingList;
    completedList;
    sup_PendingList = [];
    sup_MyTeamList = [];
    sup_MyMenteeList = [];
    ngOnInit() {
        this.checkSelectedLang();
        this.renderPieChart();
        this.getSummaryData();
        localStorage.setItem('menteeValue', 'false')
    }

    startIDP(newId) {
        let api = IVars.createIDP;
        let posData = {
            id: newId
        }

        this._POST_api_Service.POST_IDP_data(api, posData).subscribe( res => {
            if(res.status === 'OK') {
                this.router.navigate(['/idp/form', res.msg.id]);
            }

        }, err => {
            console.log("Error - failed to create IDP", err);
        })
    }

    handbookURL;
    ccToolURL;
    getSummaryData() {
        this.loading = true;
        let api = IVars.getIDPSummary;

        this._GET_api_Service.GET_IDP_data(api).subscribe(res => {
            this.newIDP_list = res.summary.create;
            this.pendingList = res.summary.pending;
            this.completedList = res.summary.complete;
            if (res.summary.url.length > 0) {
                this.handbookURL = res.summary.url[0].value;
                this.ccToolURL = res.summary.url[1].value;
            }
            
            if (res.summary.supervisor.length > 0) {
                for (let i = 0; i < res.summary.supervisor.length; i++) {
                    let img = GlobalVariable.BASE_API_URL + '/get/image/' + res.summary.supervisor[i].image_url + "?api_key=" + GlobalVariable.API_KEY;
                    this._GET_api_Service.GET_PictureByUrl(img).subscribe(data => {     
                        if (data) {
                            if (res.summary.supervisor[i].status < 3) this.sup_PendingList.push({ det: res.summary.supervisor[i], imgUrl: img })
                            else this.sup_MyTeamList.push({ det: res.summary.supervisor[i], imgUrl: img });
                        }
                        else {
                            let img = '../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
                            if (res.summary.supervisor[i].status < 3) this.sup_PendingList.push({ det: res.summary.supervisor[i], imgUrl: img })
                            else this.sup_MyTeamList.push({ det: res.summary.supervisor[i], imgUrl: img });
                        }
                    }, err => {
                        let img = '../../../../../assets/app/media/img/users/ghcm-user-default.jpg';
                        if (res.summary.supervisor[i].status < 3) this.sup_PendingList.push({ det: res.summary.supervisor[i], imgUrl: img })
                        else this.sup_MyTeamList.push({ det: res.summary.supervisor[i], imgUrl: img });
                    })
                }
            }

            if (res.summary.mentor.length > 0) {
                for (let i = 0; i < res.summary.mentor.length; i++) {
                    let img = GlobalVariable.BASE_API_URL + '/get/image/' + res.summary.mentor[i].image_url + "?api_key=" + GlobalVariable.API_KEY;
                    this._GET_api_Service.GET_PictureByUrl(img).subscribe(data => {     
                        if (data) this.sup_MyMenteeList.push({ 
                            det: res.summary.mentor[i], 
                            imgUrl: img 
                        })
                        else this.sup_MyMenteeList.push({ 
                            det: res.summary.mentor[i], 
                            imgUrl: '../../../../../assets/app/media/img/users/ghcm-user-default.jpg' 
                        })
                    }, err => {
                        this.sup_MyMenteeList.push({ 
                            det: res.summary.mentor[i], 
                            imgUrl: '../../../../../assets/app/media/img/users/ghcm-user-default.jpg' 
                        })
                    })
                }
            } 

            this.loading = false;
        },
        err => {
            console.log('[ERROR - Failed to fetch summary] ' + err);
        })
    }

    chartData;
    renderPieChart() {
        if(this.enChecked) {
            this.chartData = [
                {
                  "name": "Structured Training/ Education",
                  "value": 10,
                },
                {
                  "name": "Learning from Relationship",
                  "value": 20
                },
                {
                  "name": "Learning from Experience",
                  "value": 70
                }
            ];
        }
        else {
            this.chartData = [
                {
                  "name": "Latihan berstruktur/pendidikan",
                  "value": 10,
                },
                {
                  "name": "Belajar melalui hubungan dengan orang lain",
                  "value": 20
                },
                {
                  "name": "Belajar melalui pengalaman",
                  "value": 70
                }
            ];
        }
        
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
        
        if(this.screenWidth < 768) {
            this.view = [this.screenWidth / 1.35, 300];
            this.showLabels = false;
            this.showLegend = true;
        }
        else {
            this.view = [650,400];
            this.showLabels = true;
            this.showLegend = false;
        }
            
    }

    itemClicked = false;
    clickedItem;
    clickedItemHead; clickedItemBody; clickedItemEx
    onSelect(data): void {
        this.itemClicked = true;
        this.clickedItem = JSON.parse(JSON.stringify(data));
        
        if(this.clickedItem.value === 10) {
            this.clickedItemHead = this.word.clickedItemHead_10;
            this.clickedItemBody = this.word.clickedItemBody_10;
            this.clickedItemEx = this.word.clickedItemEx_10;
        }
        else if(this.clickedItem.value === 20) {
            this.clickedItemHead = this.word.clickedItemHead_20;
            this.clickedItemBody = this.word.clickedItemBody_20;
            this.clickedItemEx = this.word.clickedItemEx_20;
        }
        else if(this.clickedItem.value === 70) {
            this.clickedItemHead = this.word.clickedItemHead_70;
            this.clickedItemBody = this.word.clickedItemBody_70; 
            this.clickedItemEx = this.word.clickedItemEx_70;
        }
    }
    
    chartItemVal;
    onActivate(data): void {
        this.chartItemVal = JSON.parse(JSON.stringify(data)).value;
    }

    getItemName() {
        return this.chartItemVal.name + ' : ' + this.chartItemVal.value + '%';
    }
    
    onDeactivate(data): void {
        // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
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
            this.renderPieChart();
            this.itemClicked = false;
        }
        if (selectedLang === 'my') {
            this.word = My;
            localStorage.setItem('idpLang', 'my');
            this.enChecked = false;
            this.renderPieChart();
            this.itemClicked = false;
        }
        $('#lang_close').click();
    }

    menteeValue() {
        localStorage.setItem('menteeValue', 'true')
    }
}
