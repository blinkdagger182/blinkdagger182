import { Component, OnInit } from '@angular/core';
import { BlankVars } from './../default/blank/blank-vars';
import { Router } from '@angular/router';
import { GET_Service } from '../../../api/get.service';
import { GlobalVariable } from "../../../../../environments/environment";

@Component({
    selector: 'app-features',
    templateUrl: './features.component.html',
    styleUrls: ['./features.component.css'],
})

export class FeaturesComponent implements OnInit {

    actionSum = [];

    showTalent = false;
    showNomination = false;
    isCritical = false;
    loading = true;

    constructor(
        private _GET_api_Service: GET_Service,
        private routers: Router
    ) { }

    showMaps = false;
    ngOnInit() {
        let role = JSON.parse(localStorage.getItem('roleMaps'));
        if ((role.role_lvl > 0) && (role.role_lvl < 5)) this.showMaps = true;
        else this.showMaps = false;

        this.getActionSummary();
        this.getTime();
        this.checkProject();
    }

    //For Extraordinaire
    showExtra = false;
    displayName;
    checkProject() {
        this._GET_api_Service.GET_data(BlankVars.checkProjectAPI).subscribe(res => {
            console.log(res[0].allow);
            if (res[0].allow === 1) {
                this.showExtra = true;
                this.displayName = res[0].display_name;
            }
            else
                this.showExtra = false;
        })
    }

    // To checking time for changing the background
    timeZone;
    imgTimeZone;
    userName;
    bgClass;
    bgChange;
    getTime() {
        this._GET_api_Service.GET_SEA_data(BlankVars.backgroundImg).subscribe(res => {

            let special = res.findIndex(item => item.type === "special");
            if (special >= 0) {
                let img = GlobalVariable.BASE_API_URL + '/get/image/' + res[special].img_web + "?api_key=" + GlobalVariable.API_KEY;

                this._GET_api_Service.GET_PictureByUrl(img).subscribe(data => {
                    if (data) this.bgChange = `url(${img})`;
                    else this.bgClass = 'mor-bg';
                }, error => {
                    this.bgClass = 'mor-bg';
                });

            } else {

                this.timeZone = new Date().getHours();
                if (this.timeZone < 12) {
                    this.bgClass = 'mor-bg';
                } else if (this.timeZone >= 17) {
                    this.bgClass = 'eve-bg';
                } else {
                    this.bgClass = 'noon-bg';
                }

            }

        }, error => {
            this.bgClass = 'mor-bg';
        })
    }

    getActionSummary() {
        this._GET_api_Service.GET_data(BlankVars.actionSummaryAPI).subscribe(sum => {
            this.actionSum = sum;
            let num = (this.actionSum[14].badge != 0) ? this.actionSum[14].badge : this.actionSum[14].total;
            let total = (num == null) ? 0 : num;
            if (total === 0) {
                this.showTalent = false;
            }
            else {
                this.showTalent = true;
            }

            let isCritical;

            let j = sum.findIndex(x => x.TYPE === 'critical');
            if (j >= 0) {
                if (sum[j].badge > 0) {
                    isCritical = '1';
                    this.showNomination = true;
                    this.isCritical = true;

                } else {
                    isCritical = '0';
                    this.showNomination = false;
                    this.isCritical = false;
                }

            }

            localStorage.setItem('isCritical', isCritical);
            this.loading = false;
        });
    }

    getSummaryNum(index) {
        let num = (this.actionSum[index].badge != 0) ? this.actionSum[index].badge : this.actionSum[index].total;
        return (num == null) ? 0 : num;
    }

    getTalentSummary(index) {
        let num = (this.actionSum[index].badge != 0) ? this.actionSum[index].badge : this.actionSum[index].total;
        let total = (num == null) ? 0 : num;
        return total;
    }

    getIDPSum(index0, index1) {
        let num = this.actionSum[index0].total + this.actionSum[index1].total;
        //return (num == null) ? 0 : num;
    }

    menuClicked(path) {
        this.routers.navigate([path]);
    }

    menuOpen(type) {
        switch (type) {
            case 'tml':
                window.open('https://learn.tm.com.my/login/index.php');
                break;
            case 'la':
                window.open('https://gems.tm.com.my/irj/portal');
                break;
            case 'g':
                window.open('https://grow.tm.com.my/');
                break;
            case 'covid':
                window.open('https://www.sub.tm.com.my/sub/covid/index.cfm?path=pwa');
                break;
            case 'iris':
                window.open('https://iris2.tm.com.my/');
                break;
            case 'edu':
                window.open('https://edubite.tm.com.my/');
                break;
            case 'neo':
                window.open('https://ot.tm.com.my/');
                break;
            case 'eclaim':
                window.open('https://hc.tm.com.my/ECLAIM/index.cfm?go=sys.login');
                break;
        }
    }
}


