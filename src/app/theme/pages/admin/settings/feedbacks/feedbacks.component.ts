import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
//import { ActivatedRoute } from '@angular/router';
import { Routes, Router, RouterModule, ActivatedRoute, NavigationStart, ActivatedRouteSnapshot, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { Vars } from '../settings-vars';
import { GET_Service } from '../../../../api/get.service';
import { PagerService } from '../../job/shared/pager/pager.component';
import { Http, Response } from '@angular/http';
import { StgLoadingComponent } from '../loading/loading.component';
import { DatePipe } from '@angular/common';
import { GlobalVariable } from "../../../../../../environments/environment";

@Component({
    selector: 'app-feedbacks-component',
    templateUrl: './feedbacks.component.html',
    styleUrls: ['../settings-css.css']
})
export class StgFeedbacksComponent implements OnInit {
    title1 = Vars.title1;
    feedBack = Vars.feedBack;
    loading = true; loadingErr = false;
    downloadAllXLS = Vars.downloadAllXLS;
    downloadCSV = false;
    constructor(
        private datePipe: DatePipe,
        private pagerService: PagerService,
        private _GET_api_Service: GET_Service, private route: ActivatedRoute,
        private http: Http, private routers: Router,
    ) { }

    fbListData = [];
    imageData= [];
    displayImg = [];
    APIGetImg = Vars.APIGetImg;
    apiUrl = GlobalVariable.BASE_API_URL;
    apiKey = GlobalVariable.API_KEY;
    ngOnInit() {
        // FEEDBACK API
        let fbAPI = Vars.fbList;
        this._GET_api_Service.GET_data(fbAPI).subscribe(data => {
                // this.fbListData = data;
                let temp = [];
                let res = [];
                for(let i=0; i<data.length; i++){
                    this.imageData.push({img:data[i].image});
                    if(this.imageData[i].img === null){
                        this.displayImg[i] = [];
                    }
                    else if(this.imageData[i].img !== null){
                        this.displayImg[i] = this.imageData[i].img.split(";");
                    }
                }
                for(let i=0; i<data.length; i++){
                    this.fbListData.push({
                        Cell_No: data[i].Cell_No,
                        Company_Desc: data[i].Company_Desc,
                        Email: data[i].Email,
                        EmpGroup: data[i].EmpGroup,
                        EmpSGroup: data[i].EmpSGroup,
                        LOB_Desc: data[i].LOB_Desc,
                        Name: data[i].Name,
                        datetime: data[i].datetime,
                        description: data[i].description,
                        image: data[i].image,
                        rating: data[i].rating,
                        rating_desc: data[i].rating_desc,
                        title: data[i].title,
                        user_id: data[i].user_id,
                        displayImage:this.displayImg[i]
                    });
                }
                this.setPage(1);
                this.loading = false; this.downloadCSV = true;
                console.log('this.fbListData', this.fbListData);
                // console.log('displayImg',this.displayImg);
            },
            error => {
                this.loadingErr = true;
                console.log('[ERROR - Super Admin Feedback List] ' + error);
                this.loading = false;
            })
    }

    private allItems: any[];// array of all items to be paged
    pager: any = {};// pager object
    pagedItems: any[];// paged items
    pageSize = Vars.maxFbPerPage;
    setPage(page: number) {
        this.pager = this.pagerService.getPager(this.fbListData.length, page, this.pageSize);
        this.pagedItems = this.fbListData.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    /** :start DOWNLOAD CSV  */
    ConvertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = ''; var row = "";

        for (var index in objArray[0]) {
            row += index + ',';//Now convert each value to string and comma-separated
        }
        row = row.slice(0, -1);
        //append Label row with line break
        str += row + '\r\n';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ',';
                if (index !== 'datetime') {
                    line += '"' + array[i][index] + '"';
                } else {
                    let newDt = this.transformDate(array[i][index]);
                    line += '"' + newDt + '"';
                }
            }
            str += line + '\r\n';
        }
        return str;
    }

    transformDate(date) {
        return this.datePipe.transform(date, 'dd-MM-yyyy h:mma'); //whatever format you need.
    }

    download() {
        var csvData = this.ConvertToCSV(this.fbListData);
        var a = document.createElement("a");
        a.setAttribute('style', 'display:none;');
        document.body.appendChild(a);
        var blob = new Blob([csvData], { type: 'text/csv' });
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        let todayDate = new Date();
        let dateToday = (todayDate.getFullYear() + '' + ((todayDate.getMonth() + 1)) + '' + todayDate.getDate() + '' + todayDate.getHours() + '' + todayDate.getMinutes() + '' + todayDate.getSeconds());
        a.download = 'Feedbacks_' + dateToday + '.csv';
        a.click();
        return 'success';
    }
    /** :end DOWNLOAD CSV  */

    selectedImg
    selImg(img){
        this.selectedImg = img;
    }
}
